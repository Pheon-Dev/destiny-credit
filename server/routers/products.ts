import { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../create-router";

const prisma = new PrismaClient();
const defaultProductsSelect = Prisma.validator<Prisma.ProductSelect>()({
  id: true,
  createdAt: true,
  updatedAt: true,
  productId: true,
  productName: true,
  minimumRange: true,
  maximumRange: true,
  interestRate: true,
  frequency: true,
  maximumTenure: true,
  repaymentCycle: true,
  processingFee: true,
  gracePeriod: true,
  penaltyRate: true,
  penaltyCharge: true,
  penaltyPayment: true,
  approved: true,
});

export const productsRouter = createRouter()
  .query("products", {
    resolve: async () => {
      try {
        return await prisma.product.findMany();
      } catch (error) {
        console.log("products.products");
      }
    },
  })
  .query("product", {
    input: z.object({
      productName: z.string(),
    }),
    resolve: async ({ input }) => {
      try {
        return await prisma.product.findFirst({
          where: {
            productName: input.productName,
          },
        });
      } catch (error) {
        console.log("products.product");
      }
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
      try {
        return await prisma.product.create({
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
      } catch (error) {
        console.log("products.create-product");
      }
    },
  });
