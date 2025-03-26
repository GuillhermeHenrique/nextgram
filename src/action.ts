"use server";

import { PrismaClient } from "@prisma/client";

import { User } from "@prisma/client";
import { promises } from "dns";

import path from "path";

const prisma = new PrismaClient();

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
