// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export default prisma;

import type { PrismaClient as ImportedPrismaClient } from '@prisma/client';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const { PrismaClient: RequiredPrismaClient } = require('@require/client');

const _PrismaClient: typeof ImportedPrismaClient = RequiredPrismaClient;

export class PrismaClient extends _PrismaClient {}

const prisma = new PrismaClient();
export default prisma;