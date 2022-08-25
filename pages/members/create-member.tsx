import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useForm } from "@mantine/form";
import { TextInput, Grid, Button, Divider, Group, Select } from "@mantine/core";
import { TitleText } from "../../components";

const CreateMember = () => {
  const form = useForm({
    initialValues: {
      date: "",
      branchName: "",
      memberNumber: "",
      firstName: "",
      lastName: "",
      dob: "",
      idPass: "",
      kraPin: "",
      mobileNumber: "",
      gender: "",
      age: "",
      religion: "",
      maritalStatus: "",
      spouseName: "",
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
      mpesaCode: "",
      membershipAmount: "",
      nameKin: "",
      relationship: "",
      residentialAddressKin: "",
      postalAddressKin: "",
      postalCodeKin: "",
      cityTownKin: "",
      numberKin: "",
    },
  });

  const fetchMembers = async () => {
    const { data, error } = await supabase.from("members").select();
  };

  const handleSave = async () => {
    console.log(form.values.firstName)
    await supabase.from("members").insert([
      {
        date: form.values.date,
        branchName: form.values.branchName,
        memberNumber: form.values.memberNumber,
        firstName: form.values.firstName,
        lastName: form.values.lastName,
        dob: form.values.dob,
        idPass: form.values.idPass,
        kraPin: form.values.kraPin,
        mobileNumber: form.values.mobileNumber,
        gender: form.values.gender,
        age: form.values.age,
        religion: form.values.religion,
        maritalStatus: form.values.maritalStatus,
        spouseName: form.values.spouseName,
        spouseNumber: form.values.spouseNumber,
        postalAddress: form.values.postalAddress,
        postalCode: form.values.postalCode,
        cityTown: form.values.cityTown,
        residentialAddress: form.values.residentialAddress,
        emailAddress: form.values.emailAddress,
        rentedOwned: form.values.rentedOwned,
        landCareAgent: form.values.landCareAgent,
        occupationEmployer: form.values.occupationEmployer,
        employerNumber: form.values.employerNumber,
        businessLocation: form.values.businessLocation,
        businessAge: form.values.businessAge,
        refereeName: form.values.refereeName,
        refereeNumber: form.values.refereeNumber,
        communityPosition: form.values.communityPosition,
        mpesaCode: form.values.mpesaCode,
        membershipAmount: form.values.membershipAmount,
        nameKin: form.values.nameKin,
        relationship: form.values.relationship,
        residentialAddressKin: form.values.residentialAddressKin,
        postalAddressKin: form.values.postalAddressKin,
        postalCodeKin: form.values.postalCodeKin,
        cityTownKin: form.values.cityTownKin,
        numberKin: form.values.numberKin,
      },
    ]);
  };
  return (
    <div>
      <Group position="center" m="md">
        <TitleText title="Member Registration" />
      </Group>

      <Grid grow>
        <Grid.Col span={4}>
          <TextInput
            label="Date"
            placeholder="Date"
            {...form.getInputProps("date")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Branch Name"
            placeholder="Branch Name"
            {...form.getInputProps("branchName")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Member Number"
            placeholder="Member Number"
            {...form.getInputProps("memberNumber")}
            required
          />
        </Grid.Col>
      </Grid>

      <Divider mt="lg" variant="dashed" my="sm" />
      <Group position="center" m="md">
        <TitleText title="Personal Details" />
      </Group>

      <Grid grow>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="First Name"
            placeholder="First Name"
            {...form.getInputProps("firstName")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Last Name (other names)"
            placeholder="Last Name (other names)"
            {...form.getInputProps("lastName")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Phone No."
            placeholder="Phone No."
            {...form.getInputProps("mobileNumber")}
            required
          />
        </Grid.Col>
      </Grid>

      <Grid grow>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Date of Birth"
            placeholder="Date of Birth"
            {...form.getInputProps("dob")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="ID | Passport No."
            placeholder="ID | Passport No."
            {...form.getInputProps("idPass")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="KRA PIN"
            placeholder="KRA PIN"
            {...form.getInputProps("kraPin")}
            required
          />
        </Grid.Col>
      </Grid>

      <Grid grow>
        <Grid.Col span={4}>
          <Select
            mt="md"
            label="Gender"
            placeholder="Gender"
            data={[
              { value: "female", label: "Female" },
              { value: "male", label: "Male" },
            ]}
            {...form.getInputProps("gender")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Age"
            placeholder="Age"
            {...form.getInputProps("age")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Select
            mt="md"
            label="Religion"
            placeholder="Religion"
            data={[
              { value: "christian", label: "Christian" },
              { value: "muslim", label: "Muslim" },
              { value: "hindu", label: "Hindu" },
              { value: "other", label: "Other" },
            ]}
            {...form.getInputProps("religion")}
            required
          />
        </Grid.Col>
      </Grid>

      <Grid grow>
        <Grid.Col span={4}>
          <Select
            mt="md"
            label="Marital Status"
            placeholder="Marital Status"
            data={[
              { value: "single", label: "Single" },
              { value: "married", label: "Married" },
              { value: "widowed", label: "Widowed" },
            ]}
            {...form.getInputProps("maritalStatus")}
            required
          />
        </Grid.Col>
        {form.values.maritalStatus === "married" ? (
          <>
            <Grid.Col span={4}>
              <TextInput
                mt="md"
                label="Names (spouse)"
                placeholder="Names (spouse)"
                {...form.getInputProps("spouseName")}
                required
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                mt="md"
                label="Phone No. (spouse)"
                placeholder="Phone No. (spouse)"
                {...form.getInputProps("spouseNumber")}
                required
              />
            </Grid.Col>
          </>
        ) : (
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Postal Address"
              placeholder="Postal Address"
              {...form.getInputProps("postalAddress")}
              required
            />
          </Grid.Col>
        )}
      </Grid>

      <Grid grow>
        {form.values.maritalStatus === "married" ? (
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Postal Address"
              placeholder="Postal Address"
              {...form.getInputProps("postalAddress")}
              required
            />
          </Grid.Col>
        ) : null}
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Postal Code"
            placeholder="Postal Code"
            {...form.getInputProps("postalCode")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="City | Town"
            placeholder="City | Town"
            {...form.getInputProps("cityTown")}
            required
          />
        </Grid.Col>
      </Grid>

      <Grid grow>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Email Address"
            placeholder="Email Address"
            {...form.getInputProps("emailAddress")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Residential Address"
            placeholder="Residential Address"
            {...form.getInputProps("residentialAddress")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Select
            mt="md"
            label="Rented | Owned"
            placeholder="Rented | Owned"
            data={[
              { value: "rented", label: "Rented" },
              { value: "owned", label: "Owned" },
            ]}
            {...form.getInputProps("rentedOwned")}
            required
          />
        </Grid.Col>
      </Grid>

      <Grid grow>
        {form.values.rentedOwned === "rented" ? (
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Landlord | Care Taker | Agent (names)"
              placeholder="Landlord | Care Taker | Agent (names)"
              {...form.getInputProps("landCareAgent")}
              required
            />
          </Grid.Col>
        ) : (
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Occupation | Employer"
              placeholder="Occupation | Employer"
              {...form.getInputProps("occupationEmployer")}
              required
            />
          </Grid.Col>
        )}
        {form.values.rentedOwned !== "rented" ? null : (
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Occupation | Employer"
              placeholder="Occupation | Employer"
              {...form.getInputProps("occupationEmployer")}
              required
            />
          </Grid.Col>
        )}
        {form.values.occupationEmployer.toUpperCase() === "BUSINESS" ? (
          <>
            <Grid.Col span={4}>
              <TextInput
                mt="md"
                label="Business Location"
                placeholder="Business Location"
                {...form.getInputProps("businessLocation")}
                required
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                mt="md"
                label="Age of Business"
                placeholder="Age of Business"
                {...form.getInputProps("businessAge")}
                required
              />
            </Grid.Col>
          </>
        ) : (
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Employer Contacts"
              placeholder="Employer Contacts"
              {...form.getInputProps("employerNumber")}
              required
            />
          </Grid.Col>
        )}
        {form.values.occupationEmployer.toUpperCase() !== "BUSINESS" ? (
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Business Location"
              placeholder="Business Location"
              {...form.getInputProps("businessLocation")}
              required
            />
          </Grid.Col>
        ) : null}
      </Grid>

      <Grid grow>
        {form.values.occupationEmployer.toUpperCase() !== "BUSINESS" ? (
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Age of Business"
              placeholder="Age of Business"
              {...form.getInputProps("businessAge")}
              required
            />
          </Grid.Col>
        ) : null}
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Referee (name)"
            placeholder="Referee (name)"
            {...form.getInputProps("refereeName")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Phone No. (referee)"
            placeholder="Phone No. (referee)"
            {...form.getInputProps("refereeNumber")}
            required
          />
        </Grid.Col>
        {form.values.occupationEmployer.toUpperCase() === "BUSINESS" ? (
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Position in Community"
              placeholder="Position in Community"
              {...form.getInputProps("refereeName")}
              required
            />
          </Grid.Col>
        ) : null}
      </Grid>

      <Grid grow>
        {form.values.occupationEmployer.toUpperCase() !== "BUSINESS" ? (
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Position in Community"
              placeholder="Position in Community"
              {...form.getInputProps("refereeName")}
              required
            />
          </Grid.Col>
        ) : null}
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Membership Fee (M-PESA Code)"
            placeholder="Membership Fee (M-PESA Code)"
            {...form.getInputProps("mpesaCode")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Membership Fee Amount"
            placeholder="Membership Fee Amount"
            {...form.getInputProps("membershipAmount")}
            required
          />
        </Grid.Col>
      </Grid>

      <Divider mt="lg" variant="dashed" my="sm" />
      <Group position="center" m="md">
        <TitleText title="Next of Kin Details" />
      </Group>

      <Grid grow>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Names (kin)"
            placeholder="Names (kin)"
            {...form.getInputProps("nameKin")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Relationship"
            placeholder="Relationship"
            {...form.getInputProps("relationship")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Phone No. (kin)"
            placeholder="Phone No. (kin)"
            {...form.getInputProps("numberKin")}
            required
          />
        </Grid.Col>
      </Grid>

      <Grid grow>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Residential Address"
            placeholder="Residential Address"
            {...form.getInputProps("residentialAddressKin")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="City | Town"
            placeholder="City | Town"
            {...form.getInputProps("cityTownKin")}
            required
          />
        </Grid.Col>
      </Grid>

      <Grid grow>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Postal Address"
            placeholder="Postal Address"
            {...form.getInputProps("postalAddressKin")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Postal Code"
            placeholder="Postal Code"
            {...form.getInputProps("postalCodeKin")}
            required
          />
        </Grid.Col>
      </Grid>

      <Divider mt="lg" variant="dashed" my="sm" />
      <Group position="center" mt="xl">
        <Button
          variant="outline"
          onClick={() => {
            handleSave();
          }}
        >
          Submit
        </Button>
      </Group>
    </div>
  );
};

export default CreateMember;
