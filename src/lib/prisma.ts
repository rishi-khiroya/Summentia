import { PrismaClient, type Project, type User } from '@prisma/client';
import type { PrismaProject, PrismaUser } from './types/prisma';

const prisma = new PrismaClient();

export async function createUser(data: PrismaUser): Promise<User> {
    // TODO: VERIFY EMAIL 
    return await prisma.user.create({ data })
}

export async function createProject(data: PrismaProject): Promise<Project> {
    return await prisma.project.create({ data });
}

export async function getProjectsByUserId(id: number): Promise<Project[]> {
    const result = await prisma.user.findUnique({
        where: { id },
        select: { projects: true }
    });

    return result ? result.projects : [];
}