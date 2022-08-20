import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { Text, TextInput, Grid, Button, Group } from "@mantine/core";
import { randomId } from "@mantine/hooks";

const CreateMember = () => {
  const form = useForm({
    initialValues: {
  date: "",
  branchName: "",
  memberNumber: "",
  surName: "",
  otherNames: "",
  dob: "",
  idPass: "",
  pinNumber: "",
  mobileNumber: "",
  gender: "",
  age: "",
  religion: "",
  maritalStatus: "",
  nameSpouse: "",
  spouseNumber: "",
  postalAddress: "",
  postalCode: "",
  cityTown: "",
  residentialAddress: "",
  emailAddress: "",
  rentedOwned: "",
  landCareAgent: "",
  occupationEmployer: "",
  employerNumber: "",
  businessLocation: "",
  businessAge: "",
  refereeName: "",
  refereeNumber: "",
  communityPosition: "",
  mpesaTransNumber: "",
  mpesaAmount: "",
  nameKin: "",
  relationship: "",
  residentialAddressKin: "",
  postalAddressKin: "",
  postalCodeKin: "",
  cityTownKin: "",
  mobileNumberKin: "",
    },
  });
  return (
    <div>
      <Group position="center" m="md">
      <Text>MEMBER REGISTRATION</Text>
      </Group>
      <Grid grow>
        <Grid.Col span={4}> <TextInput label="Date" placeholder="Date" {...form.getInputProps("date")} /> </Grid.Col>
        <Grid.Col span={4}> <TextInput label="Branch Name" placeholder="Branch Name" {...form.getInputProps("branchName")} /> </Grid.Col>
        <Grid.Col span={4}> <TextInput label="Member Number" placeholder="Member Number" {...form.getInputProps("memberNumber")} /> </Grid.Col>
      </Grid>
      <Group position="center" m="md">
      <Text>PERSONAL DETAILS</Text>
      </Group>
      <Grid grow>
        <Grid.Col span={4}>
        <TextInput mt="md" label="Surname" placeholder="Surname" {...form.getInputProps("surName")} /> 
        <TextInput mt="md" label="Date of Birth" placeholder="Date of Birth" {...form.getInputProps("dob")} /> 
        <TextInput mt="md" label="KRA PIN" placeholder="KRA PIN" {...form.getInputProps("pinNumber")} /> 
        </Grid.Col>
        <Grid.Col span={4}>
        <TextInput mt="md" label="Other Names" placeholder="Other Names" {...form.getInputProps("otherNames")} /> 
        <TextInput mt="md" label="ID|Passport No." placeholder="ID|Passport No." {...form.getInputProps("idPass")} /> 
        <TextInput mt="md" label="Phone No." placeholder="Phone No." {...form.getInputProps("mobileNumber")} /> 
        </Grid.Col>
      </Grid>
      <Group position="center" mt="xl">
        <Button
          variant="outline"
          onClick={() => {
            form.setValues({
  date: "",
  branchName: "",
  memberNumber: "",
  surName: "",
  otherNames: "",
  dob: "",
  idPass: "",
  pinNumber: "",
  mobileNumber: "",
  gender: "",
  age: "",
  religion: "",
  maritalStatus: "",
  nameSpouse: "",
  spouseNumber: "",
  postalAddress: "",
  postalCode: "",
  cityTown: "",
  residentialAddress: "",
  emailAddress: "",
  rentedOwned: "",
  landCareAgent: "",
  occupationEmployer: "",
  employerNumber: "",
  businessLocation: "",
  businessAge: "",
  refereeName: "",
  refereeNumber: "",
  communityPosition: "",
  mpesaTransNumber: "",
  mpesaAmount: "",
  nameKin: "",
  relationship: "",
  residentialAddressKin: "",
  postalAddressKin: "",
  postalCodeKin: "",
  cityTownKin: "",
  mobileNumberKin: "",
            });
          }}
        >
          Submit
        </Button>
      </Group>
    </div>
  );
};

export default CreateMember;
