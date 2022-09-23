import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { t } from "../trpc";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const membersRouter = t.router({
  members: t.procedure.query(async () => {
    const members = await prisma.member.findMany({
      where: {},
      include: {
        loans: true,
        collaterals: true,
        guarantor: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!members) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `members.members not found`,
      });
    }
    return members;
  }),
  member: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (input.id === "") return;
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
    }),
  maintain: t.procedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        phoneNumber: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (input.firstName === "") return;
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
    }),
  register: t.procedure
    .input(
      z.object({
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
      })
    )
    .mutation(async ({ input }) => {
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
    }),
  collateral: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (input.id === "") return;
      const collateral = await prisma.collateral.findMany({
        where: {
          memberId: input.id,
        },
      });
      if (!collateral) {
        return;
      }
      return collateral;
    }),
  collateral_delete: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const collateral = await prisma.collateral.deleteMany({
        where: { id: input.id },
      });
      if (collateral.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `members.collateral_delete not found`,
        });
      }
      return collateral;
    }),
  guarantor: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (input.id === "") return;
      const guarantor = await prisma.guarantor.findFirst({
        where: {
          memberId: input.id,
        },
      });
      if (!guarantor) {
        return;
      }
      return guarantor;
    }),
  update_member: t.procedure.mutation(async () => {
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
        message: `members.update_member not found`,
      });
    }
    return member;
  }),
  maintain_member: t.procedure
    .input(
      z.object({
        id: z.string(),
        maintained: z.boolean(),
        updaterId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
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
          message: `members.maintain_member not found`,
        });
      }
      return member;
    }),
  maintain_collateral: t.procedure
    .input(
      z.object({
        item: z.string(),
        value: z.string(),
        memberId: z.string(),
        updaterId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
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
          message: `members.maintain_collateral not found`,
        });
      }
      return collateral;
    }),
  maintain_guarantor: t.procedure
    .input(
      z.object({
        id: z.string(),
        guarantorName: z.string(),
        guarantorPhone: z.string(),
        guarantorRelationship: z.string(),
        guarantorID: z.string(),
        memberId: z.string(),
        updaterId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
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
          message: `members.maintain_guarantor not found`,
        });
      }
      return guarantor;
    }),
  maintain_loan: t.procedure
    .input(
      z.object({
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
      })
    )
    .mutation(async ({ input }) => {
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
          message: `members.maintain_loan not found`,
        });
      }
      return loan;
    }),
});
