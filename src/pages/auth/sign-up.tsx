import {
  Box, Button, Card, Group, LoadingOverlay, PasswordInput, Select, Text, TextInput
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconAlertCircle, IconCheck, IconX } from "@tabler/icons";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { z } from "zod";
import { trpc } from "../../utils/trpc";

const schema = z.object({
  username: z.string().min(2, { message: "User Name Missing" }),
  firstName: z.string().min(2, { message: "First Name Missing" }),
  lastName: z.string().min(2, { message: "Last Name Missing" }),
  role: z.string().min(2, { message: "Please Assign a Role" }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Password Missing" }),
  confirm: z.string().min(8, { message: "Confirmation Password Missing" }),
});

const Page: NextPage = (): JSX.Element => {
  const router = useRouter();

  const {
    data: users,
    refetch,
    status: users_status,
  } = trpc.users.users.useQuery();

  const lencode = users ? users?.length + 1 : 1;

  const usercode =
    lencode > 9
      ? lencode > 99
        ? lencode > 999
          ? lencode
          : "0" + `${lencode}`
        : "00" + `${lencode}`
      : "000" + `${lencode}`;

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      username: `FName&{usercode}`,
      password: "",
      firstName: "",
      lastName: "",
      confirm: "",
      email: "",
      role: "",
    },
  });

  const newUser = trpc.users.create_user.useMutation({
    onSuccess: () => {
      clear();
      refetch();

      updateNotification({
        id: "submit",
        color: "teal",
        title: `${form.values.username} @ [${form.values.email}]`,
        message: "User Registered Successfully!",
        icon: <IconCheck size={16} />,
        autoClose: 5000,
      });

      return router.push("/auth/sign-in");
    },
  });

  const clear = () => {
    form.setFieldValue("username", "");
    form.setFieldValue("email", "");
    form.setFieldValue("password", "");
    form.setFieldValue("confirm", "");
    form.setFieldValue("role", "");
    form.setFieldValue("firstName", "");
    form.setFieldValue("lastName", "");
  };
  const createUser = useCallback(() => {
    try {
      if (form.values.password !== form.values.confirm)
        return updateNotification({
          id: "submit",
          color: "red",
          title: "Password Mismatch",
          message: `Please Make Sure That The Passwords Match`,
          icon: <IconX size={16} />,
          autoClose: 8000,
        });
      try {
        if (
          form.values.email &&
          form.values.username &&
          form.values.password &&
          form.values.firstName &&
          form.values.lastName &&
          form.values.role
        ) {
          newUser.mutate({
            username: form.values.username,
            firstName: form.values.firstName,
            lastName: form.values.lastName,
            password: form.values.password,
            email: form.values.email.toLowerCase(),
            role: form.values.role.toUpperCase(),
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
        title: "Sign Up Error!",
        message: `Please Try Signing Up Again!`,
        color: "red",
        icon: <IconX size={16} />,
        autoClose: 5000,
      });
    }
  }, [newUser, form.values]);
  const caps = (n: string) => {
    return n.charAt(0).toUpperCase() + n.slice(1);
  };
  let name = `${caps(form.values.firstName)[0]}${caps(form.values.lastName)}`;

  useEffect(() => {
    let subscribe = true;
    if (subscribe) {
      form.setFieldValue(
        "username",
        `${name !== "undefined" ? name : "DCredit"}${usercode}`
      );

      if (form.values.password.length > 7 && form.values.confirm.length > 7) {
        if (form.values.password !== form.values.confirm) {
          form.setFieldError("confirm", "Passwords don't match!");
        }
      }
      if (
        +form.values.password / 0 === 0 ||
        (+form.values.password / 1 === +form.values.password &&
          form.values.confirm.length > 0)
      ) {
        form.setFieldError("password", "Please include letters | symbols");
      }
      let counter = 0;
      let nums = 0;
      while (counter < form.values.password.length) {
        let f = form.values.password[counter];
        if (f) {
          if (!isNaN(+f)) {
            nums += 1;
          }
        }
        counter++;
      }
      if (nums < 1 && form.values.confirm.length > 0)
        form.setFieldError("password", "Please Include Numbers");

      if (form.values.password.length < 8 && form.values.confirm.length > 0) {
        form.setFieldError(
          "password",
          "Password length should be greater than 7"
        );
      }
    }
    return () => {
      subscribe = false;
    };
  }, [
    form.values.username,
    form.values.password,
    form.values.confirm,
    users,
    usercode,
    name,
  ]);

  return (
    <>
      <Card
        sx={{ maxWidth: 360 }}
        mx="auto"
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        style={{ marginTop: "50px", position: "relative" }}
      >
        <LoadingOverlay overlayBlur={2} visible={users_status === "loading"} />
        <Card.Section>
          <Box p="lg">
            <form>
              <TextInput
                label="User Name"
                placeholder="User Name ..."
                {...form.getInputProps("username")}
                disabled
                required
              />
              <TextInput
                label="First Name"
                placeholder="First Name ..."
                {...form.getInputProps("firstName")}
                required
              />
              <TextInput
                label="Last Name"
                placeholder="Last Name ..."
                {...form.getInputProps("lastName")}
                required
              />
              <TextInput
                label="Email Address"
                type="email"
                placeholder="Email Address ..."
                {...form.getInputProps("email")}
                required
              />
              <PasswordInput
                label="New Password"
                placeholder="********"
                mt="sm"
                {...form.getInputProps("password")}
                required
              />
              <PasswordInput
                label="Confirm Password"
                placeholder="********"
                mt="sm"
                {...form.getInputProps("confirm")}
                required
              />
              <Select
                mt="md"
                label="Assign Role"
                placeholder="Select Role"
                data={[
                  { value: "CO", label: "Credit Officer" },
                  { value: "CA", label: "Credit Admin" },
                  { value: "MD", label: "Managing Director" },
                  { value: "AU", label: "Auditor" },
                ]}
                {...form.getInputProps("role")}
                required
              />

              <Group mt="md">
                <Text color="gray">Already have an account?</Text>
                <Text
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push("/auth/sign-in")}
                  color="blue"
                >
                  Sign In
                </Text>
              </Group>
              <Group mt="xl">
                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                  onClick={() => {
                    form.validate();
                    showNotification({
                      id: "submit",
                      color: "teal",
                      title: "Signing Up",
                      message: `Registering New User ${form.values.username} ...`,
                      loading: true,
                      autoClose: 50000,
                    });
                    createUser();
                  }}
                >
                  Sign Up
                </Button>
              </Group>
            </form>
          </Box>
        </Card.Section>
      </Card>
    </>
  );
};

export default Page;
