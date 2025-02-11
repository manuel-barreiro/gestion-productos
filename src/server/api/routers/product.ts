import { z } from "zod"
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"

const productSchema = z.object({
  name: z.string().min(1),
  ingredients: z.string(),
  // Add other product fields as needed
})

export const productRouter = createTRPCRouter({
  // Public procedures - Available to all authenticated users
  getProducts: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.product.findMany({
      orderBy: { name: "asc" },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    })
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
        include: {
          createdBy: {
            select: {
              name: true,
            },
          },
        },
      })

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        })
      }

      return product
    }),

  // Admin-only procedures
  create: adminProcedure
    .input(productSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.create({
        data: {
          ...input,
          createdById: ctx.session.user.id,
        },
      })
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        data: productSchema.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input

      const product = await ctx.db.product.findUnique({
        where: { id },
      })

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        })
      }

      return ctx.db.product.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      })
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
      })

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        })
      }

      return ctx.db.product.delete({
        where: { id: input.id },
      })
    }),
})
