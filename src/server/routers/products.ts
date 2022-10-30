import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { t } from "../trpc";
import { prisma } from "../prisma";

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
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (!input.id) return;

      const product = await prisma.product.findFirst({
        where: {
          id: input.id,
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
      if (!input.productId) return;

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
