import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { Text, TextInput, Grid, Button, Group, Select } from "@mantine/core";
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

      <Group position="center" m="md">
        <Text>PERSONAL DETAILS</Text>
      </Group>

      <Grid grow>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Surname"
            placeholder="Surname"
            {...form.getInputProps("surName")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Other Names"
            placeholder="Other Names"
            {...form.getInputProps("otherNames")}
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
            {...form.getInputProps("pinNumber")}
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
        ) : 
        null
        }
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
              label="Referee (number)"
              placeholder="Referee (number)"
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
        ) : 
        null
        }
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
        ) : 
        null
        }
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Membership Fee (M-PESA Code)"
              placeholder="Membership Fee (M-PESA Code)"
              {...form.getInputProps("mpesaTransNumber")}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              mt="md"
              label="Membership Fee Amount"
              placeholder="Membership Fee Amount"
              {...form.getInputProps("mpesaAmount")}
              required
            />
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
