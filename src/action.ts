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
