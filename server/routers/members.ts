import { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../create-router";

const prisma = new PrismaClient();
const defaultMembersSelect = Prisma.validator<Prisma.MemberSelect>()({
  id: true,
  createdAt: true,
  updatedAt: true,
  date: true,
  branchName: true,
  memberId: true,
  firstName: true,
  lastName: true,
  dob: true,
  idPass: true,
  kraPin: true,
  phoneNumber: true,
  gender: true,
  age: true,
  religion: true,
  maritalStatus: true,
  spouseName: true,
  spouseNumber: true,
  postalAddress: true,
  postalCode: true,
  cityTown: true,
  residentialAddress: true,
  emailAddress: true,
  rentedOwned: true,
  landCareAgent: true,
  occupationEmployer: true,
  employerNumber: true,
  businessLocation: true,
  businessAge: true,
  refereeName: true,
  refereeNumber: true,
  communityPosition: true,
  mpesaCode: true,
  membershipAmount: true,
  nameKin: true,
  relationship: true,
  residentialAddressKin: true,
  postalAddressKin: true,
  postalCodeKin: true,
  cityTownKin: true,
  numberKin: true,
  maintained: true,
  group: true,
});

export const membersRouter = createRouter()
  .query("members", {
    resolve: async () => {
        const members = await prisma.member.findMany();
        if (!members) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `members.members not found`
          })
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
            message: `members.member not found`
          })
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
    }),
    resolve: async ({ input }) => {
      try {
        return await prisma.member.create({
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
          },
        });
      } catch (error) {
        console.log("members.register");
      }
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
            message: `members.collateral not found`
          })
        }
        return collateral;
    },
  })
  .mutation("collateral-delete", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input }) => {
      try {
        return await prisma.collateral.deleteMany({
          where: { id: input.id },
        });
      } catch (error) {
        console.log("members.collateral-delete");
      }
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
        if (!guarantor) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `members.guarantor not found`
          })
        }
        return guarantor;
    },
  })
  .mutation("update-member", {
    resolve: async () => {
      try {
        return await prisma.member.updateMany({
          where: {
            maintained: true,
          },
          data: {
            maintained: false,
          },
        });
      } catch (error) {
        console.log("members.update-member");
      }
    },
  })
  .mutation("maintain-member", {
    input: z.object({
      id: z.string(),
      maintained: z.boolean(),
    }),
    resolve: async ({ input }) => {
      try {
        return await prisma.member.update({
          where: {
            id: input.id,
          },
          data: {
            maintained: input.maintained,
          },
        });
      } catch (error) {
        console.log("members.maintain-member");
      }
    },
  })
  .mutation("maintain-collateral", {
    input: z.object({
      item: z.string(),
      value: z.string(),
      memberId: z.string(),
    }),
    resolve: async ({ input }) => {
      try {
        return await prisma.collateral.create({
          data: {
            item: input.item,
            value: input.value,
            memberId: input.memberId,
          },
        });
      } catch (error) {
        console.log("members.maintain-collateral");
      }
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
    }),
    resolve: async ({ input }) => {
      try {
        await prisma.guarantor.deleteMany({
          where: {
            memberId: input.memberId,
          },
        });
        return await prisma.guarantor.create({
          data: {
            id: input.id,
            guarantorName: input.guarantorName,
            guarantorPhone: input.guarantorPhone,
            guarantorRelationship: input.guarantorRelationship,
            guarantorID: input.guarantorID,
            memberId: input.memberId,
          },
        });
      } catch (error) {
        console.log("members.maintain-guarantor");
      }
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
    }),
    resolve: async ({ input }) => {
      try {
        return await prisma.loan.create({
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
          },
        });
      } catch (error) {
        console.log("members.maintain-loan");
      }
    },
  });
