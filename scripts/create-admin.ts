"use server"

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash("Aspen3815!!", 12)

  const user = await prisma.user.upsert({
    where: { email: "ing.mbarreiro@gmail.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: password,
      role: "ADMIN",
    },
  })

  console.log({ user })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
