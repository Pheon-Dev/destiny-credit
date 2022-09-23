import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { t } from "../trpc";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

export const productsRouter = t.router({
  products: t.procedure.query(async () => {
    const products = await prisma.product.findMany({
      where: {},
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!products) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `products.products not found`,
      });
    }
    return products;
  }),
  product: t.procedure
    .input(
      z.object({
        productName: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (!input.productName) return 
      const product = await prisma.product.findFirst({
        where: {
          productName: input.productName,
        },
      });
      return product;
    }),
  create_product: t.procedure
    .input(
      z.object({
        productId: z.string(),
        productName: z.string(),
        minimumRange: z.string(),
        maximumRange: z.string(),
        interestRate: z.string(),
        frequency: z.string(),
        maximumTenure: z.string(),
        repaymentCycle: z.string(),
        processingFee: z.string(),
        gracePeriod: z.string(),
        penaltyRate: z.string(),
        penaltyCharge: z.string(),
        penaltyPayment: z.string(),
        approved: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const product = await prisma.product.create({
        data: {
          productId: input.productId,
          productName: input.productName,
          minimumRange: input.minimumRange,
          maximumRange: input.maximumRange,
          interestRate: input.interestRate,
          frequency: input.frequency,
          maximumTenure: input.maximumTenure,
          repaymentCycle: input.repaymentCycle,
          processingFee: input.processingFee,
          gracePeriod: input.gracePeriod,
          penaltyRate: input.penaltyRate,
          penaltyCharge: input.penaltyCharge,
          penaltyPayment: input.penaltyPayment,
          approved: input.approved,
        },
      });
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `products.create-product not found`,
        });
      }
      return product;
    }),
});
