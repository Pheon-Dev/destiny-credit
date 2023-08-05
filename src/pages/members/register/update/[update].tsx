import {
  Button,
  Divider, Grid, Group, LoadingOverlay, Select, TextInput
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconAlertCircle, IconCalendar, IconCheck, IconX } from "@tabler/icons";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { Protected, TitleText } from "../../../../components";
import { trpc } from "../../../../utils/trpc";

const schema = z.object({
  /* date: z.date({ required_error: "Select Todays' Date" }), */
  branchName: z.string().min(2, { message: "Enter Branch Name" }),
  memberId: z.string().min(2, { message: "Enter Member ID" }),
  firstName: z.string().min(2, { message: "Enter First Name" }),
  lastName: z.string().min(2, { message: "Enter Last Name" }),
  /* dob: z.date({ required_error: "Select Date of Birth" }), */
  idPass: z.string().min(2, { message: "Enter ID | Passport #" }),
  kraPin: z.string().min(2, { message: "Enter KRA PIN" }),
  phoneNumber: z.string().min(2, { message: "Enter Phone Number" }),
  gender: z.string().min(2, { message: "Select Gender" }),
  age: z.string().min(2, { message: "Select (Date | DOB)" }),
  religion: z.string().min(2, { message: "Select Religion" }),
  maritalStatus: z.string().min(2, { message: "Select Marital Status" }),
  spouseName: z.string().min(2, { message: "Enter Name (spouse)" }),
  spouseNumber: z.string().min(2, { message: "Enter Number (spouse)" }),
  postalAddress: z.string().min(2, { message: "Enter Postal Address" }),
  postalCode: z.string().min(2, { message: "Enter Postal Code" }),
  cityTown: z.string().min(2, { message: "Enter City | Town" }),
  residentialAddress: z
    .string()
    .min(2, { message: "Enter Residential Address" }),
  emailAddress: z.string().min(2, { message: "Enter Email Address" }),
  rentedOwned: z.string().min(2, { message: "Select Rented | Owned" }),
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

const CreateMember = ({ email }: { email: string; status: string }) => {
  const router = useRouter();
  const id = router.query.update as string;

  const [user, setUser] = useState({
    id: "",
    role: "",
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    state: "",
  });

  const user_data = trpc.users.user.useQuery({
    email: `${email}`,
  });

  useEffect(() => {
    let subscribe = true;
    if (subscribe) {
      setUser({
        id: `${user_data?.data?.id}`,
        role: `${user_data?.data?.role}`,
        username: `${user_data?.data?.username}`,
        firstname: `${user_data?.data?.firstName}`,
        lastname: `${user_data?.data?.lastName}`,
        email: `${user_data?.data?.email}`,
        state: `${user_data?.data?.state}`,
      });
    }
    return () => {
      subscribe = false;
    };
  }, [
    user_data?.data?.id,
    user_data?.data?.role,
    user_data?.data?.username,
    user_data?.data?.firstName,
    user_data?.data?.lastName,
    user_data?.data?.email,
    user_data?.data?.state,
  ]);


  const {
    data: member,
    status: member_status,
  } = trpc.members.member.useQuery({ id: id });

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      date: `${member?.date}`,
      branchName: `${member?.branchName}`,
      memberId: `${member?.memberId}`,
      firstName: `${member?.firstName}`,
      lastName: `${member?.lastName}`,
      dob: `${member?.dob}`,
      idPass: `${member?.idPass}`,
      kraPin: `${member?.kraPin}`,
      phoneNumber: `${member?.phoneNumber}`,
      gender: `${member?.gender}`,
      age: `${member?.age}`,
      religion: `${member?.religion}`,
      maritalStatus: `${member?.maritalStatus}`,
      spouseName: `${member?.spouseName}`,
      spouseNumber: `${member?.spouseNumber}`,
      postalAddress: `${member?.postalAddress}`,
      postalCode: `${member?.postalCode}`,
      cityTown: `${member?.cityTown}`,
      residentialAddress: `${member?.residentialAddress}`,
      emailAddress: `${member?.emailAddress}`,
      rentedOwned: `${member?.rentedOwned}`,
      landCareAgent: `${member?.landCareAgent}`,
      occupationEmployer: `${member?.occupationEmployer}`,
      employerNumber: `${member?.employerNumber}`,
      businessLocation: `${member?.businessLocation}`,
      businessAge: `${member?.businessAge}`,
      refereeName: `${member?.refereeName}`,
      refereeNumber: `${member?.refereeNumber}`,
      communityPosition: `${member?.communityPosition}`,
      mpesaCode: `${member?.mpesaCode}`,
      membershipAmount: `${member?.membershipAmount}`,
      nameKin: `${member?.nameKin}`,
      relationship: `${member?.relationship}`,
      residentialAddressKin: `${member?.residentialAddressKin}`,
      postalAddressKin: `${member?.postalAddressKin}`,
      postalCodeKin: `${member?.postalCodeKin}`,
      cityTownKin: `${member?.cityTownKin}`,
      numberKin: `${member?.numberKin}`,
      maintained: `${member?.maintained}`,
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
  const renderAge = (today_month: number, birth_month: number) => {
    let result: number = 0;
    if (today_month === birth_month) result = 1;
    if (today_month > birth_month) result = 1;
    if (today_month < birth_month) result = 0;
    return result;
  };

  let month_difference = renderAge(
    Number(local_today_date.split("-")[1]),
    Number(local_birth_date.split("-")[1])
  );

  let age_result = year_difference + month_difference - 1;
  age_result = age_result > 0 ? age_result : age_result * -1;

  useEffect(() => {
    let subscribe = true;
    if (subscribe) {
      form.values.date === member?.date &&
        (age_result = +member?.age) ||
        form.values.dob === member?.dob &&
        (age_result = +member?.age) ||
        (age_result = age_result);

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
  }, [age_result, form.values.age, form.values.date, form.values.dob, member?.age, member?.dob, member?.date]);

  const update = trpc.members.update.useMutation({
    onSuccess: () => {
      updateNotification({
        id: "submit",
        color: "teal",
        title: `${form.values.firstName} ${form.values.lastName}`,
        message: "Member Details Updated Successfully!",
        icon: <IconCheck size={16} />,
        autoClose: 5000,
      });
      return router.push(`/members/details/${id}`);
    },
  });

  const handleSave = useCallback(() => {
    try {
      try {
        if (
          (user?.id &&
            form.values.date &&
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
          form.values.maintained
        ) {
          update.mutate({
            id: id,
            date: form.values.date === member?.date && form.values.date || dash_today_date,
            branchName: form.values.branchName.toUpperCase(),
            memberId: form.values.memberId.toUpperCase(),
            firstName: form.values.firstName.toUpperCase(),
            lastName: form.values.lastName.toUpperCase(),
            dob: form.values.dob === member?.dob && form.values.dob || dash_birth_date,
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
            maintained: false,
            registrarId: `${user?.id}`,
          });
        }
      } catch (error) {
        return updateNotification({
          id: "submit",
          title: "Missing Fields",
          message: "Please Make Sure All Fields Are Filled!",
          color: "red",
          icon: <IconAlertCircle size={16} />,
          autoClose: 5000,
        });
      }
    } catch (error) {
      updateNotification({
        id: "submit",
        title: "Missing Fields",
        message: `${error}. Highlighted Fields are missing!`,
        color: "red",
        icon: <IconX size={16} />,
        autoClose: 5000,
      });
    }
  }, [form.values, dash_today_date, dash_birth_date, update, user?.id]);

  return (
    <>
      {/* <pre>{JSON.stringify(member, undefined, 2)}</pre> */}
      <form style={{ position: "relative" }}>
        <Group position="center" m="md">
          <TitleText title="Details Update" />
        </Group>

        <LoadingOverlay
          overlayBlur={2}
          visible={
            member_status === "loading"
          }
        />
        <Grid grow>
          <Grid.Col span={4}>
            <DatePicker
              label="Date"
              placeholder={`${member?.date}`}
              defaultValue={`${member?.date}`}
              icon={<IconCalendar size={16} />}
              inputFormat="DD-MM-YYYY"
              dropdownType="modal"
              firstDayOfWeek="sunday"
              maxDate={dayjs(new Date()).toDate()}
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
              placeholder={`${member?.branchName}`}
              {...form.getInputProps("branchName")}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="Member ID"
              placeholder={`${member?.memberId}`}
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
              placeholder={`${member?.firstName}`}
              {...form.getInputProps("firstName")}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Last Name (other names)"
              placeholder={`${member?.lastName}`}
              {...form.getInputProps("lastName")}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Phone #"
              placeholder={`${member?.phoneNumber}`}
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
              placeholder={member?.dob}
              defaultValue={dayjs(new Date(`${member?.dob}`)).toDate()}
              icon={<IconCalendar size={16} />}
              inputFormat="DD-MM-YYYY"
              dropdownType="modal"
              firstDayOfWeek="sunday"
              maxDate={dayjs(new Date()).toDate()}
              {...form.getInputProps("dob")}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="ID | Passport #"
              placeholder={`${member?.idPass}`}
              {...form.getInputProps("idPass")}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="KRA PIN"
              placeholder={`${member?.kraPin}`}
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
              placeholder={`${member?.gender}`}
              data={[
                { value: "female", label: "FEMALE" },
                { value: "male", label: "MALE" },
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
              placeholder={`${member?.age}`}
              {...form.getInputProps("age")}
              disabled
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              mt="md"
              label="Religion"
              placeholder={`${member?.religion}`}
              data={[
                { value: "christian", label: "CHRISTIAN" },
                { value: "muslim", label: "MUSLIM" },
                { value: "hindu", label: "HINDU" },
                { value: "other", label: "OTHER" },
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
              placeholder={`${member?.maritalStatus}`}
              data={[
                { value: "single", label: "SINGLE" },
                { value: "married", label: "MARRIED" },
                { value: "widowed", label: "WIDOWED" },
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
                  placeholder={`${member?.spouseName}`}
                  {...form.getInputProps("spouseName")}
                  required
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  mt="md"
                  label="Phone # (spouse)"
                  placeholder={`${member?.spouseNumber}`}
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
                placeholder={`${member?.postalAddress}`}
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
                placeholder={`${member?.postalAddress}`}
                {...form.getInputProps("postalAddress")}
                required
              />
            </Grid.Col>
          ) : null}
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Postal Code"
              placeholder={`${member?.postalCode}`}
              {...form.getInputProps("postalCode")}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="City | Town"
              placeholder={`${member?.cityTown}`}
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
              placeholder={`${member?.emailAddress}`}
              {...form.getInputProps("emailAddress")}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Residential Address"
              placeholder={`${member?.residentialAddress}`}
              {...form.getInputProps("residentialAddress")}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              mt="md"
              label="Rented | Owned"
              placeholder={`${member?.rentedOwned}`}
              data={[
                { value: "rented", label: "RENTED" },
                { value: "owned", label: "OWNED" },
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
                placeholder={`${member?.landCareAgent}`}
                {...form.getInputProps("landCareAgent")}
                required
              />
            </Grid.Col>
          ) : (
            <Grid.Col span={4}>
              <TextInput
                mt="md"
                label="Occupation | Employer"
                placeholder={`${member?.occupationEmployer}`}
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
                placeholder={`${member?.occupationEmployer}`}
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
                  placeholder={`${member?.businessLocation}`}
                  {...form.getInputProps("businessLocation")}
                  required
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  mt="md"
                  label="Age of Business"
                  placeholder={`${member?.businessAge}`}
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
                placeholder={`${member?.employerNumber}`}
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
                placeholder={`${member?.businessLocation}`}
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
                placeholder={`${member?.businessAge}`}
                {...form.getInputProps("businessAge")}
                required
              />
            </Grid.Col>
          ) : null}
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Referee (name)"
              placeholder={`${member?.refereeName}`}
              {...form.getInputProps("refereeName")}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Phone # (referee)"
              placeholder={`${member?.refereeNumber}`}
              {...form.getInputProps("refereeNumber")}
              required
            />
          </Grid.Col>
          {form.values.occupationEmployer.toUpperCase() === "BUSINESS" ? (
            <Grid.Col span={4}>
              <TextInput
                mt="md"
                label="Position in Community"
                placeholder={`${member?.communityPosition}`}
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
                placeholder={`${member?.communityPosition}`}
                {...form.getInputProps("communityPosition")}
                required
              />
            </Grid.Col>
          ) : null}
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Membership Fee (M-PESA Code)"
              placeholder={`${member?.mpesaCode}`}
              {...form.getInputProps("mpesaCode")}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Membership Fee Amount"
              placeholder={`${member?.membershipAmount}`}
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
              placeholder={`${member?.nameKin}`}
              {...form.getInputProps("nameKin")}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Relationship"
              placeholder={`${member?.relationship}`}
              {...form.getInputProps("relationship")}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Phone # (kin)"
              placeholder={`${member?.numberKin}`}
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
              placeholder={`${member?.residentialAddressKin}`}
              {...form.getInputProps("residentialAddressKin")}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="City | Town"
              placeholder={`${member?.cityTownKin}`}
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
              placeholder={`${member?.postalAddressKin}`}
              {...form.getInputProps("postalAddressKin")}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Postal Code"
              placeholder={`${member?.postalCodeKin}`}
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
              form.validate();
              showNotification({
                id: "submit",
                title: "Update Details",
                message: "Updating Member Details ...",
                disallowClose: true,
                loading: true,
              });
              handleSave();
            }}
          >
            Submit
          </Button>
        </Group>
      </form>
    </>
  );
};

const Page = () => {
  const { status, data } = useSession();

  const email = `${data?.user?.email}`;
  const check = email.split("@")[1];

  return (
    <Protected>
      {check && <CreateMember email={email} status={status} />}
    </Protected>
  );
};

export default Page;


