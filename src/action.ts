"use server";

import { PrismaClient } from "@prisma/client";

import { User } from "@prisma/client";

import { auth } from "auth";

import { redirect } from "next/navigation";

const prisma = new PrismaClient();

import path from "path";

import { promises as fs } from "fs";

import { revalidatePath } from "next/cache";

type FormState = {
  message: string;
  type: string;
};

// Resgatar usuário por email
export const getUserByEmail = async (
  email: string | null
): Promise<User | null> => {
  if (!email) return null;

  const user = await prisma.user.findFirst({
    where: { email: email },
  });

  return user;
};

// Atualização de perfil usuario
export async function updateUserProfile(
  formState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();

  if (!session) redirect("/");

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const imageFile = formData.get("image") as File;

  if (name.length < 5) {
    return { message: "O nome precisa ter 5 caracteres", type: "error" };
  }

  if (session.user.userId !== id) {
    throw new Error("Não autorizado!");
  }

  let imageUrl;
  if (imageFile && imageFile.name !== "undefined") {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    // Criar o repositório/pasta
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, imageFile.name);
    const arrayBuffer = await imageFile.arrayBuffer();
    // Criar o arquivo no diretório
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));

    imageUrl = `/uploads/${imageFile.name}`;
  }

  const dataToUpdate = imageUrl ? { name, image: imageUrl } : { name };

  await prisma.user.update({
    where: { id },
    data: dataToUpdate,
  });

  revalidatePath("/profile");

  return { message: "Perfil atualizado com sucesso!", type: "success" };
}

// Criar posts
export async function createPost(
  formState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();

  if (!session) redirect("/");

  const caption = formData.get("caption") as string;
  const imageFile = formData.get("image") as File;

  if (!caption || imageFile.size === 0) {
    return { message: "Legenda e fotos são obrigatórios!", type: "error" };
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  // Criar o repositório/pasta
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, imageFile.name);
  const arrayBuffer = await imageFile.arrayBuffer();
  // Criar o arquivo no diretório
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));

  const imageUrl = `/uploads/${imageFile.name}`;

  await prisma.post.create({
    data: {
      imageUrl,
      caption,
      userId: session.user.userId,
    },
  });

  revalidatePath("/");

  redirect("/");
}

// Resgatar posts do usuário
export const getUserPosts = async (userId: string) => {
  const session = await auth();

  if (!session) return redirect("/");

  if (session.user.userId !== userId) {
    throw new Error("Não autorizado!");
  }

  return await prisma.post.findMany({
    where: { userId },
    include: {
      user: true,
      likes: true,
      comments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Deletar uma postagem
export const deletePost = async (formData: FormData) => {
  const session = await auth();

  if (!session) return redirect("/");

  const userId = formData.get("userId") as string;
  const postId = formData.get("postId") as string;

  if (session.user.userId !== userId) {
    throw new Error("Não autorizado!");
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  revalidatePath("/my-posts");

  redirect("/my-posts");
};

// Resgatar posts do usuário
export const getAllPosts = async () => {
  return await prisma.post.findMany({
    include: {
      user: true,
      likes: true,
      comments: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Like no post
export async function likePost(postId: string, userId: string) {
  const session = await auth();

  if (!session) return redirect("/");

  if (session.user.userId !== userId) {
    throw new Error("Não autorizado!");
  }

  // Verificar se o like existe
  const existingLike = await prisma.like.findFirst({
    where: {
      userId,
      postId,
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
  }

  revalidatePath("/");
}

export const addComment = async (
  postId: string,
  userId: string,
  content: string
) => {
  const session = await auth();

  if (!session) redirect("/");

  if (session.user.userId !== userId) {
    throw new Error("Não autorizado!");
  }

  await prisma.comment.create({
    data: {
      userId,
      postId,
      content,
    },
  });

  revalidatePath("/");
};
