import { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../create-router";

const prisma = new PrismaClient();

export const productsRouter = createRouter()
  .query("products", {
    resolve: async () => {
      const products = await prisma.product.findMany();
      if (!products) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `products.products not found`,
        });
      }
      return products;
    },
  })
  .query("product", {
    input: z.object({
      productName: z.string(),
    }),
    resolve: async ({ input }) => {
      const product = await prisma.product.findFirst({
          where: {
            productName: input.productName,
          },
        });
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `products.product not found`,
        });
      }
      return product;
    },
  })
  .mutation("create-product", {
    input: z.object({
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
    }),
    resolve: async ({ input }) => {
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
    },
  });
