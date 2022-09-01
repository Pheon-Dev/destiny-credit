import React, { FormEvent, useEffect, useState } from "react";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { supabase } from "../../lib/supabase";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { IconAlertCircle, IconCalendar, IconCheck, IconX } from "@tabler/icons";
import { DatePicker } from "@mantine/dates";
import {
  LoadingOverlay,
  TextInput,
  Grid,
  Button,
  Divider,
  Group,
  Select,
  Indicator,
  Text,
} from "@mantine/core";
import { TitleText } from "../../components";
import { Members } from "../../types";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { showNotification, updateNotification } from "@mantine/notifications";

const schema = z.object({
  date: z.date({ required_error: "Enter Todays' Date" }),
  branchName: z.string().min(2, { message: "Enter Branch Name" }),
  memberId: z.string().min(2, { message: "Enter Member Number" }),
  firstName: z.string().min(2, { message: "Enter First Name" }),
  lastName: z.string().min(2, { message: "Enter Last Name" }),
  dob: z.date({ required_error: "Enter Date of Birth" }),
  idPass: z.string().min(2, { message: "Enter ID | Passport #" }),
  kraPin: z.string().min(2, { message: "Enter KRA PIN" }),
  phoneNumber: z.string().min(2, { message: "Enter Phone Number" }),
  gender: z.string().min(2, { message: "Enter Gender" }),
  age: z.string().min(2, { message: "Enter Age" }),
  religion: z.string().min(2, { message: "Enter Religion" }),
  maritalStatus: z.string().min(2, { message: "Enter Marital Status" }),
  spouseName: z.string().min(2, { message: "Enter Name (spouse)" }),
  spouseNumber: z.string().min(2, { message: "Enter Number (spouse)" }),
  postalAddress: z.string().min(2, { message: "Enter Postal Address" }),
  postalCode: z.string().min(2, { message: "Enter Postal Code" }),
  cityTown: z.string().min(2, { message: "Enter City | Town" }),
  residentialAddress: z
    .string()
    .min(2, { message: "Enter Residential Address" }),
  emailAddress: z.string().min(2, { message: "Enter Email Address" }),
  rentedOwned: z.string().min(2, { message: "Enter Rented | Owned" }),
  landCareAgent: z
    .string()
    .min(2, { message: "Enter Landlord | Care Taker | Agent" }),
  occupationEmployer: z
    .string()
    .min(2, { message: "Enter Occupation | Employer" }),
  employerNumber: z.string().min(2, { message: "Enter Employer Number" }),
  businessLocation: z.string().min(2, { message: "Enter Business Location" }),
  businessAge: z.string().min(2, { message: "Enter Business Age" }),
  refereeName: z.string().min(2, { message: "Enter Referee (name)" }),
  refereeNumber: z.string().min(2, { message: "Enter Referee (number)" }),
  communityPosition: z.string().min(2, { message: "Enter Community Position" }),
  mpesaCode: z.string().min(2, { message: "Enter M-PESA Code" }),
  membershipAmount: z.string().min(2, { message: "Enter Membership Amount" }),
  nameKin: z.string().min(2, { message: "Enter Name (kin)" }),
  relationship: z.string().min(2, { message: "Enter Relationship (kin)" }),
  residentialAddressKin: z
    .string()
    .min(2, { message: "Enter Residential Address (kin)" }),
  postalAddressKin: z
    .string()
    .min(2, { message: "Enter Postal Address (kin)" }),
  postalCodeKin: z.string().min(2, { message: "Enter Postal Code (kin)" }),
  cityTownKin: z.string().min(2, { message: "Enter City | Town (kin)" }),
  numberKin: z.string().min(2, { message: "Enter  Phone # (kin)" }),
});

const CreateMember = ({members}: { members: Members[] }) => {
  let lencode: number = members.length + 1;
  const router = useRouter();
  let memcode =
    lencode > 9
      ? lencode > 99
        ? lencode > 999
          ? lencode
          : "DC-0" + `${lencode}`
        : "DC-00" + `${lencode}`
      : "DC-000" + `${lencode}`;

  /* console.log(list) */
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      date: "",
      branchName: "Eldoret",
      memberId: `${memcode}`,
      firstName: "",
      lastName: "",
      dob: "",
      idPass: "",
      kraPin: "",
      phoneNumber: "",
      gender: "",
      age: "0",
      religion: "",
      maritalStatus: "",
      spouseName: "NA",
      spouseNumber: "NA",
      postalAddress: "",
      postalCode: "",
      cityTown: "",
      residentialAddress: "",
      emailAddress: "",
      rentedOwned: "",
      landCareAgent: "NA",
      occupationEmployer: "",
      employerNumber: "NA",
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
      group: false,
      maintained: false,
    },
  });

  let today_date = new Date(form.values.date);
  let birth_date = new Date(form.values.dob);
  //
  let local_today_date = today_date.toLocaleDateString();
  let local_birth_date = birth_date.toLocaleDateString();
  //
  const dash_today_date =
    local_today_date.split("/")[0] +
    "-" +
    local_today_date.split("/")[1] +
    "-" +
    local_today_date.split("/")[2];

  const dash_birth_date =
    local_birth_date.split("/")[0] +
    "-" +
    local_birth_date.split("/")[1] +
    "-" +
    local_birth_date.split("/")[2];

  let year_difference: number =
    Number(dash_today_date.split("-")[2]) -
    Number(dash_birth_date.split("-")[2]);
  //
  function renderAge(today_month: number, birth_month: number) {
    let result: number = 0;
    if (today_month === birth_month) result = 1;
    if (today_month > birth_month) result = 1;
    if (today_month < birth_month) result = 0;
    return result;
  }

  let month_difference = renderAge(
    Number(local_today_date.split("-")[1]),
    Number(local_birth_date.split("-")[1])
  );

  let age_result = year_difference + month_difference - 1;
  age_result = age_result > 0 ? age_result : age_result * -1;

  useEffect(() => {
    let subscribe = true;
    if (subscribe) {
      form.setFieldValue("age", `${age_result}`);
      if (form.values.age === `${age_result}`) {
        const interval = setInterval(() => {
          form.setFieldValue("age", `${age_result}`);
          // console.log(form.values.age)
        }, 500);

        return () => {
          clearInterval(interval);
        };
      }
    }
    return () => (subscribe = false);
  }, [age_result]);

  const handleSave = async () => {
    try {
      if (
        (form.values.date &&
          form.values.branchName &&
          form.values.memberId &&
          form.values.firstName &&
          form.values.lastName &&
          form.values.dob &&
          form.values.idPass &&
          form.values.kraPin &&
          form.values.phoneNumber &&
          form.values.gender &&
          form.values.age &&
          form.values.religion &&
          form.values.maritalStatus &&
          form.values.spouseName &&
          form.values.spouseNumber &&
          form.values.postalAddress &&
          form.values.postalCode &&
          form.values.cityTown &&
          form.values.residentialAddress &&
          form.values.emailAddress &&
          form.values.rentedOwned &&
          form.values.landCareAgent &&
          form.values.occupationEmployer &&
          form.values.employerNumber &&
          form.values.businessLocation &&
          form.values.businessAge &&
          form.values.refereeName &&
          form.values.refereeNumber &&
          form.values.communityPosition &&
          form.values.mpesaCode &&
          form.values.membershipAmount &&
          form.values.nameKin &&
          form.values.relationship &&
          form.values.residentialAddressKin &&
          form.values.postalAddressKin &&
          form.values.postalCodeKin &&
          form.values.cityTownKin &&
          form.values.numberKin) ||
        form.values.group ||
        form.values.maintained
      ) {
        const res = await axios.request({
          method: "POST",
          url: "/api/register",
          data: {
            date: `${dash_today_date}`,
            branchName: form.values.branchName.toUpperCase(),
            memberId: form.values.memberId.toUpperCase(),
            firstName: form.values.firstName.toUpperCase(),
            lastName: form.values.lastName.toUpperCase(),
            dob: `${dash_birth_date}`,
            idPass: form.values.idPass.toUpperCase(),
            kraPin: form.values.kraPin.toUpperCase(),
            phoneNumber: form.values.phoneNumber.toUpperCase(),
            gender: form.values.gender.toUpperCase(),
            age: form.values.age.toUpperCase(),
            religion: form.values.religion.toUpperCase(),
            maritalStatus: form.values.maritalStatus.toUpperCase(),
            spouseName: form.values.spouseName.toUpperCase(),
            spouseNumber: form.values.spouseNumber.toUpperCase(),
            postalAddress: form.values.postalAddress.toUpperCase(),
            postalCode: form.values.postalCode.toUpperCase(),
            cityTown: form.values.cityTown.toUpperCase(),
            residentialAddress: form.values.residentialAddress.toUpperCase(),
            emailAddress: form.values.emailAddress.toUpperCase(),
            rentedOwned: form.values.rentedOwned.toUpperCase(),
            landCareAgent: form.values.landCareAgent.toUpperCase(),
            occupationEmployer: form.values.occupationEmployer.toUpperCase(),
            employerNumber: form.values.employerNumber.toUpperCase(),
            businessLocation: form.values.businessLocation.toUpperCase(),
            businessAge: form.values.businessAge.toUpperCase(),
            refereeName: form.values.refereeName.toUpperCase(),
            refereeNumber: form.values.refereeNumber.toUpperCase(),
            communityPosition: form.values.communityPosition.toUpperCase(),
            mpesaCode: form.values.mpesaCode.toUpperCase(),
            membershipAmount: form.values.membershipAmount.toUpperCase(),
            nameKin: form.values.nameKin.toUpperCase(),
            relationship: form.values.relationship.toUpperCase(),
            residentialAddressKin:
              form.values.residentialAddressKin.toUpperCase(),
            postalAddressKin: form.values.postalAddressKin.toUpperCase(),
            postalCodeKin: form.values.postalCodeKin.toUpperCase(),
            cityTownKin: form.values.cityTownKin.toUpperCase(),
            numberKin: form.values.numberKin.toUpperCase(),
            group: false,
            maintained: false,
          },
        });

        local_today_date = "";
        local_birth_date = "";
        form.setFieldValue("date", "");
        form.setFieldValue("branchName", "");
        form.setFieldValue("memberId", "");
        form.setFieldValue("firstName", "");
        form.setFieldValue("lastName", "");
        form.setFieldValue("dob", "");
        form.setFieldValue("idPass", "");
        form.setFieldValue("kraPin", "");
        form.setFieldValue("phoneNumber", "");
        form.setFieldValue("gender", "");
        form.setFieldValue("age", "");
        form.setFieldValue("religion", "");
        form.setFieldValue("maritalStatus", "");
        form.setFieldValue("spouseName", "");
        form.setFieldValue("spouseNumber", "");
        form.setFieldValue("postalAddress", "");
        form.setFieldValue("postalCode", "");
        form.setFieldValue("cityTown", "");
        form.setFieldValue("residentialAddress", "");
        form.setFieldValue("emailAddress", "");
        form.setFieldValue("rentedOwned", "");
        form.setFieldValue("landCareAgent", "");
        form.setFieldValue("occupationEmployer", "");
        form.setFieldValue("employerNumber", "");
        form.setFieldValue("businessLocation", "");
        form.setFieldValue("businessAge", "");
        form.setFieldValue("refereeName", "");
        form.setFieldValue("refereeNumber", "");
        form.setFieldValue("communityPosition", "");
        form.setFieldValue("mpesaCode", "");
        form.setFieldValue("membershipAmount", "");
        form.setFieldValue("nameKin", "");
        form.setFieldValue("relationship", "");
        form.setFieldValue("residentialAddressKin", "");
        form.setFieldValue("postalAddressKin", "");
        form.setFieldValue("postalCodeKin", "");
        form.setFieldValue("cityTownKin", "");
        form.setFieldValue("numberKin", "");
        form.setFieldValue("group", false);
        form.setFieldValue("maintained", false);

        setTimeout(() => {
          updateNotification({
            id: "submit",
            color: "teal",
            title: `${res.data.firstname} ${res.data.lastName}`,
            message: "Member Registered Successfully!",
            icon: <IconCheck size={16} />,
            autoClose: 5000,
          });
        }, 2000);
        return router.push("/members");
      }
      setTimeout(() => {
        updateNotification({
          id: "submit",
          title: "Error Writing to Database",
          message: "Please Try Again!",
          color: "red",
          icon: <IconAlertCircle size={16} />,
          autoClose: 5000,
        });
      }, 2000);
    } catch (error) {
      setTimeout(() => {
        updateNotification({
          id: "submit",
          title: "Missing Fields",
          message: `${error}. Highlighted Fields are missing!`,
          color: "red",
          icon: <IconX size={16} />,
          autoClose: 5000,
        });
      }, 2000);
    }
  };

  return (
    <form
    //     onSubmit={() => {
    //       form.onSubmit((values) => {
    //           console.log(values);
    // handleSave();
    //         });
    //     }}
    >
      <Group position="center" m="md">
        <TitleText title="Member Registration" />
      </Group>

      <Grid grow>
        <Grid.Col span={4}>
          <DatePicker
            label="Date"
            placeholder="Date"
            icon={<IconCalendar size={16} />}
            inputFormat="DD-MM-YYYY"
            dropdownType="modal"
            firstDayOfWeek="sunday"
            // renderDay={(date) => {
            //   const today = new Date();
            //   const day = date.getDate();
            //   return (
            //     <Indicator
            //       size={6}
            //       color="blue"
            //       offset={8}
            //       disabled={day !== Number(today.getDate())}
            //     >
            //       <div>{day}</div>
            //     </Indicator>
            //   );
            // }}
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
            {...form.getInputProps("memberId")}
            disabled
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
            label="Phone #"
            placeholder="Phone #"
            {...form.getInputProps("phoneNumber")}
            required
          />
        </Grid.Col>
      </Grid>

      <Grid grow>
        <Grid.Col span={4}>
          <DatePicker
            mt="md"
            label="Date of Birth"
            placeholder="Date of Birth"
            icon={<IconCalendar size={16} />}
            inputFormat="DD-MM-YYYY"
            dropdownType="modal"
            firstDayOfWeek="sunday"
            {...form.getInputProps("dob")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="ID | Passport #"
            placeholder="ID | Passport #"
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
            value={age_result}
            placeholder="Age"
            {...form.getInputProps("age")}
            disabled
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
                label="Phone # (spouse)"
                placeholder="Phone # (spouse)"
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
            label="Phone # (referee)"
            placeholder="Phone # (referee)"
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
              {...form.getInputProps("communityPosition")}
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
              {...form.getInputProps("communityPosition")}
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
            label="Phone # (kin)"
            placeholder="Phone # (kin)"
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
          // type="submit"
          variant="outline"
          onClick={() => {
            form.setFieldValue("memberId", `${memcode}`);
            form.setFieldValue("date", `${new Date(local_today_date)}`);
            form.setFieldValue("dob", `${new Date(local_birth_date)}`);
            {
              form.values.maritalStatus !== "married"
                ? null
                : form.setFieldValue("spouseName", "NA");
            }
            {
              form.values.maritalStatus !== "married"
                ? null
                : form.setFieldValue("spouseNumber", "NA");
            }
            {
              form.values.rentedOwned !== "owned"
                ? null
                : form.setFieldValue("landCareAgent", "NA");
            }
            {
              form.values.rentedOwned.toUpperCase() !== "BUSINESS"
                ? null
                : form.setFieldValue("employerNumber", "NA");
            }
            form.setFieldValue("branchName", "Eldoret");
            form.setFieldValue("group", false);
            form.setFieldValue("maintained", false);
            form.validate();
            showNotification({
              id: "submit",
              title: "Member Registration",
              message: "Writing Form Data to Database ...",
              loading: true,
            });
            handleSave();
          }}
        >
          Submit
        </Button>
      </Group>
    </form>
  );
};

const Page = () => {
  const [members, setMembers] = useState([]);
  const [load, setLoad] = useState(true);

  async function fetchMembers() {
    let subscription = true;

    if (subscription) {
      const res = await axios.request({
        method: "GET",
        url: "/api/members",
      });

      const data = res.data.members;
      setMembers(data);
      members.length === 0 && setLoad(false);
    }

    return () => {
      subscription = false;
    };
  }

  useEffect(() => {
    fetchMembers();
  }, [members]);

    return (
    <>
      {(members.length >= 0 && <CreateMember members={members} />) || (
        <LoadingOverlay
          overlayBlur={2}
          onClick={() => setLoad((prev) => !prev)}
          visible={load}
        />
      )}
    </>
    )
  }

export default Page;
