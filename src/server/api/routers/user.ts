import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { hash } from "bcryptjs"

// Middleware to check if user is admin
const adminMiddleware = (ctx: any) => {
  if (ctx.session?.user?.role !== "ADMIN") {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Must be admin" })
  }
}

export const userRouter = createTRPCRouter({
  // Get all users
  getAll: protectedProcedure
    .use(async ({ ctx, next }) => {
      adminMiddleware(ctx)
      return next()
    })
    .query(async ({ ctx }) => {
      return ctx.db.user.findMany({
        orderBy: { name: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
        },
      })
    }),

  // Create new user
  create: protectedProcedure
    .use(async ({ ctx, next }) => {
      adminMiddleware(ctx)
      return next()
    })
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum(["USER", "ADMIN"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const hashedPassword = await hash(input.password, 12)

      // Check if user already exists
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      })

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        })
      }

      return ctx.db.user.create({
        data: {
          ...input,
          password: hashedPassword,
        },
      })
    }),

  // Update user - now with optional password update
  update: protectedProcedure
    .use(async ({ ctx, next }) => {
      adminMiddleware(ctx)
      return next()
    })
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        password: z.string().min(6).optional(),
        role: z.enum(["USER", "ADMIN"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, password, ...rest } = input

      // If password is provided, hash it
      const data = password
        ? { ...rest, password: await hash(password, 12) }
        : rest

      return ctx.db.user.update({
        where: { id },
        data,
      })
    }),

  // Delete user
  delete: protectedProcedure
    .use(async ({ ctx, next }) => {
      adminMiddleware(ctx)
      return next()
    })
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.delete({
        where: { id: input.id },
      })
    }),
})
