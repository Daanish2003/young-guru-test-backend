import type { PrismaConfig } from 'prisma'

export default {
  earlyAccess: true,
  schema: './src/models/schema.prisma',
} satisfies PrismaConfig