import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../create-router";

const prisma = new PrismaClient();

export const membersRouter = createRouter()
  .query("members", {
    resolve: async () => {
      const members = await prisma.member.findMany();
      if (!members) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `members.members not found`,
        });
      }
      return members;
    },
  })
  .query("member", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input }) => {
      const member = await prisma.member.findFirst({
        where: {
          id: input.id,
        },
      });
      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `members.member not found`,
        });
      }
      return member;
    },
  })
  .query("maintain", {
    input: z.object({
      firstName: z.string(),
      lastName: z.string(),
      phoneNumber: z.string(),
    }),
    resolve: async ({ input }) => {
      const member = await prisma.member.findFirst({
        where: {
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: input.phoneNumber,
        },
      });
      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `members.member not found`,
        });
      }
      return member;
    },
  })
  .mutation("register", {
    input: z.object({
      date: z.string(),
      branchName: z.string(),
      memberId: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      dob: z.string(),
      idPass: z.string(),
      kraPin: z.string(),
      phoneNumber: z.string(),
      gender: z.string(),
      age: z.string(),
      religion: z.string(),
      maritalStatus: z.string(),
      spouseName: z.string(),
      spouseNumber: z.string(),
      postalAddress: z.string(),
      postalCode: z.string(),
      cityTown: z.string(),
      residentialAddress: z.string(),
      emailAddress: z.string(),
      rentedOwned: z.string(),
      landCareAgent: z.string(),
      occupationEmployer: z.string(),
      employerNumber: z.string(),
      businessLocation: z.string(),
      businessAge: z.string(),
      refereeName: z.string(),
      refereeNumber: z.string(),
      communityPosition: z.string(),
      mpesaCode: z.string(),
      membershipAmount: z.string(),
      nameKin: z.string(),
      relationship: z.string(),
      residentialAddressKin: z.string(),
      postalAddressKin: z.string(),
      postalCodeKin: z.string(),
      cityTownKin: z.string(),
      numberKin: z.string(),
      group: z.boolean(),
      maintained: z.boolean(),
      registrarId: z.string(),
    }),
    resolve: async ({ input }) => {
      const member = await prisma.member.create({
        data: {
          date: input.date,
          branchName: input.branchName,
          memberId: input.memberId,
          firstName: input.firstName,
          lastName: input.lastName,
          dob: input.dob,
          idPass: input.idPass,
          kraPin: input.kraPin,
          phoneNumber: input.phoneNumber,
          gender: input.gender,
          age: input.age,
          religion: input.religion,
          maritalStatus: input.maritalStatus,
          spouseName: input.spouseName,
          spouseNumber: input.spouseNumber,
          postalAddress: input.postalAddress,
          postalCode: input.postalCode,
          cityTown: input.cityTown,
          residentialAddress: input.residentialAddress,
          emailAddress: input.emailAddress,
          rentedOwned: input.rentedOwned,
          landCareAgent: input.landCareAgent,
          occupationEmployer: input.occupationEmployer,
          employerNumber: input.employerNumber,
          businessLocation: input.businessLocation,
          businessAge: input.businessAge,
          refereeName: input.refereeName,
          refereeNumber: input.refereeNumber,
          communityPosition: input.communityPosition,
          mpesaCode: input.mpesaCode,
          membershipAmount: input.membershipAmount,
          nameKin: input.nameKin,
          relationship: input.relationship,
          residentialAddressKin: input.residentialAddressKin,
          postalAddressKin: input.postalAddressKin,
          postalCodeKin: input.postalCodeKin,
          cityTownKin: input.cityTownKin,
          numberKin: input.numberKin,
          group: input.group,
          maintained: input.maintained,
          ratings: 0,
          registrarId: input.registrarId,
        },
      });
      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `members.register not found`,
        });
      }
      return member;
    },
  })
  .query("collateral", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input }) => {
      const collateral = await prisma.collateral.findMany({
        where: {
          memberId: input.id,
        },
      });
      if (!collateral) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `members.collateral not found`,
        });
      }
      return collateral;
    },
  })
  .mutation("collateral-delete", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input }) => {
      const collateral = await prisma.collateral.deleteMany({
        where: { id: input.id },
      });
      if (collateral.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `members.collateral-delete not found`,
        });
      }
      return collateral;
    },
  })
  .query("guarantor", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input }) => {
      const guarantor = await prisma.guarantor.findFirst({
        where: {
          memberId: input.id,
        },
      });
      return guarantor;
    },
  })
  .mutation("update-member", {
    resolve: async () => {
      const member = await prisma.member.updateMany({
        where: {
          maintained: true,
        },
        data: {
          maintained: false,
        },
      });
      if (member?.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `members.update-member not found`,
        });
      }
      return member;
    },
  })
  .mutation("maintain-member", {
    input: z.object({
      id: z.string(),
      maintained: z.boolean(),
      updaterId: z.string(),
    }),
    resolve: async ({ input }) => {
      const member = await prisma.member.update({
        where: {
          id: input.id,
        },
        data: {
          maintained: input.maintained,
          updaterId: input.updaterId,
        },
      });
      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `members.maintain-member not found`,
        });
      }
      return member;
    },
  })
  .mutation("maintain-collateral", {
    input: z.object({
      item: z.string(),
      value: z.string(),
      memberId: z.string(),
      updaterId: z.string(),
    }),
    resolve: async ({ input }) => {
      const collateral = await prisma.collateral.create({
        data: {
          item: input.item,
          value: input.value,
          memberId: input.memberId,
          updaterId: input.updaterId,
        },
      });
      if (!collateral) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `members.maintain-collateral not found`,
        });
      }
      return collateral;
    },
  })
  .mutation("maintain-guarantor", {
    input: z.object({
      id: z.string(),
      guarantorName: z.string(),
      guarantorPhone: z.string(),
      guarantorRelationship: z.string(),
      guarantorID: z.string(),
      memberId: z.string(),
      updaterId: z.string(),
    }),
    resolve: async ({ input }) => {
      await prisma.guarantor.deleteMany({
        where: {
          memberId: input.memberId,
        },
      });
      const guarantor = await prisma.guarantor.create({
        data: {
          id: input.id,
          guarantorName: input.guarantorName,
          guarantorPhone: input.guarantorPhone,
          guarantorRelationship: input.guarantorRelationship,
          guarantorID: input.guarantorID,
          memberId: input.memberId,
          updaterId: input.updaterId,
        },
      });
      if (!guarantor) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `members.maintain-guarantor not found`,
        });
      }
      return guarantor;
    },
  })
  .mutation("maintain-loan", {
    input: z.object({
      memberId: z.string(),
      tenure: z.string(),
      principal: z.string(),
      maintained: z.boolean(),
      approved: z.boolean(),
      disbursed: z.boolean(),
      grace: z.string(),
      installment: z.string(),
      productId: z.string(),
      payoff: z.string(),
      penalty: z.string(),
      processingFee: z.string(),
      sundays: z.string(),
      memberName: z.string(),
      productName: z.string(),
      interest: z.string(),
      cycle: z.string(),
      guarantorId: z.string(),
      startDate: z.string(),
      loanRef: z.string(),
      maintainerId: z.string(),
    }),
    resolve: async ({ input }) => {
      const loan = await prisma.loan.create({
        data: {
          memberId: input.memberId,
          tenure: input.tenure,
          principal: input.principal,
          maintained: input.maintained,
          approved: input.approved,
          disbursed: input.disbursed,
          grace: input.grace,
          installment: input.installment,
          productId: input.productId,
          payoff: input.payoff,
          penalty: input.penalty,
          processingFee: input.processingFee,
          sundays: input.sundays,
          memberName: input.memberName,
          productName: input.productName,
          interest: input.interest,
          cycle: input.cycle,
          guarantorId: input.guarantorId,
          startDate: input.startDate,
          loanRef: input.loanRef,
          maintainerId: input.maintainerId,
        },
      });
      if (!loan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `members.maintain-loan not found`,
        });
      }
      return loan;
    },
  });
