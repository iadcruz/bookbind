"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) return;

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) return existingUser;

    return prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username:
          user.username ??
          user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });
  } catch (error) {
    console.log("Error in syncUser", error);
  }
}

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: { clerkId },
  });
}

export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  const user = await getUserByClerkId(clerkId);
  if (!user) throw new Error("User not found");

  return user.id;
}

export async function addToReadLater(bookData: {
  googleId: string;
  title: string;
  author?: string;
  path?: string;
}) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  const book = await prisma.book.upsert({
    where: { googleId: bookData.googleId },
    update: {},
    create: {
      googleId: bookData.googleId,
      title: bookData.title,
      author: bookData.author,
      path: bookData.path,
    },
  });

  await prisma.user.update({
    where: { clerkId },
    data: {
      readLater: { connect: { id: book.id } },
    },
  });

  return book;
}

export async function getLaters() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return [];

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { readLater: true },
    });

    return user?.readLater ?? [];
  } catch (error) {
    console.log("Error fetching reading list", error);
    return [];
  }
}