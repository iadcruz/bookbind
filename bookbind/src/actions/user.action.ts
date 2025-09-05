"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
    try {
        const {userId} = await auth()
        const user = await currentUser();
        if (!userId || !user) {
            return;
        }
        const existingUser = await prisma.user.findUnique({
            where: {
                clerkId:userId
            }
        })

        if (existingUser) {
            return existingUser;
        }
        const dbUser = await prisma.user.create({
            data: {
                clerkId: userId,
                name: `${user.firstName || ""} ${user.lastName || ""}`,
                username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
                email: user.emailAddresses[0].emailAddress,
                image: user.imageUrl
            }
        })

        return dbUser;
    } catch (error) {
        console.log("Erorr in syncUser", error);
    }
}

export async function getUserByClerkId(clerkId:string) {
    return prisma.user.findUnique({
        where: {
            clerkId:clerkId,
        }
    })
}

export async function getDbUserId() {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
        throw new Error("Unauthorized");
    }

    const user = await getUserByClerkId(clerkId);

    if (!user) {
        throw new Error("User not found");
    }

    return user.id;
}

export async function addToReadLater(bookData: {
  googleId: string;
  title: string;
  author?: string;
  path?: string;
}) {
    const { userId } = await auth();
    const dbUserId = await getDbUserId();
    const book = await prisma.book.upsert({
        where: { googleId: bookData.googleId },
        update: {},
        create: {
            googleId: bookData.googleId,
            title: bookData.title,
            author: bookData.author,
            path: bookData.path,
            authorId: dbUserId
        },
    });

    await prisma.user.update({
        where: { clerkId : userId! },
        data: {
            readLater: {
            connect: { id: book.id },
            },
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
    } catch(error) {
        console.log("Error fetching watch list", error);
    }
}