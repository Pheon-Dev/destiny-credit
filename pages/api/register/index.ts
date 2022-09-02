import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

async function register(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();

  async function main() {
    try {
      const {
        date,
        branchName,
        memberId,
        firstName,
        lastName,
        dob,
        idPass,
        kraPin,
        phoneNumber,
        gender,
        age,
        religion,
        maritalStatus,
        spouseName,
        spouseNumber,
        postalAddress,
        postalCode,
        cityTown,
        residentialAddress,
        emailAddress,
        rentedOwned,
        landCareAgent,
        occupationEmployer,
        employerNumber,
        businessLocation,
        businessAge,
        refereeName,
        refereeNumber,
        communityPosition,
        mpesaCode,
        membershipAmount,
        nameKin,
        relationship,
        residentialAddressKin,
        postalAddressKin,
        postalCodeKin,
        cityTownKin,
        numberKin,
        group,
        maintained,
      } = req.body;
      console.log(req.body)
      await prisma.members.create({
        data: {
          date: date,
          branchName: branchName,
          memberId: memberId,
          firstName: firstName,
          lastName: lastName,
          dob: dob,
          idPass: idPass,
          kraPin: kraPin,
          phoneNumber: phoneNumber,
          gender: gender,
          age: age,
          religion: religion,
          maritalStatus: maritalStatus,
          spouseName: spouseName,
          spouseNumber: spouseNumber,
          postalAddress: postalAddress,
          postalCode: postalCode,
          cityTown: cityTown,
          residentialAddress: residentialAddress,
          emailAddress: emailAddress,
          rentedOwned: rentedOwned,
          landCareAgent: landCareAgent,
          occupationEmployer: occupationEmployer,
          employerNumber: employerNumber,
          businessLocation: businessLocation,
          businessAge: businessAge,
          refereeName: refereeName,
          refereeNumber: refereeNumber,
          communityPosition: communityPosition,
          mpesaCode: mpesaCode,
          membershipAmount: membershipAmount,
          nameKin: nameKin,
          relationship: relationship,
          residentialAddressKin: residentialAddressKin,
          postalAddressKin: postalAddressKin,
          postalCodeKin: postalCodeKin,
          cityTownKin: cityTownKin,
          numberKin: numberKin,
          group: group,
          maintained: maintained,
          ratings: 0,
        },
      });

      res.status(200).json({ message: req.body });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Something went wrong", error });
    }
  }
  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export default register;
