import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { NextPage } from "next";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import {
  TextInput,
  Card,
  PasswordInput,
  Button,
  Box,
  Group,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import { useRouter } from "next/router";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";

const schema = z.object({
  username: z.string().min(2, { message: "User Name Missing" }),
  password: z.string().min(2, { message: "Password Missing" }),
});

const Page: NextPage = (props): JSX.Element => {
  const { status, data } = useSession();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async () => {
    try {
      if (form.values.username && form.values.password) {
        setLoading(true);
        const res = await signIn("credentials", {
          username: form.values.username,
          password: form.values.password,
          redirect: false,
        });

        if (res?.ok) {
          router.replace(router.asPath);
          updateNotification({
            id: "sing-in-status",
            color: "teal",
            title: "Successful Sign In!",
            message: `Welcome to Destiny Credit LTD, ${form.values.username}`,
            icon: <IconCheck size={16} />,
            autoClose: 8000,
          });
          return router.push("/");
        }

        if (res?.error) {
          updateNotification({
            id: "sing-in-status",
            color: "red",
            title: "Unsuccessful Sign In!",
            message: `Please Make Sure You Are Connected to the Internet or Input Valid Credentials`,
            icon: <IconX size={16} />,
            autoClose: 8000,
          });
        }
      }
      setLoading(false);
      return updateNotification({
        id: "sing-in-status",
        color: "red",
        title: "Missing Fields!",
        message: `Please Fill in The Credentials to Continue!`,
        icon: <IconX size={16} />,
        autoClose: 8000,
      });
    } catch (error) {
      setLoading(false);
      updateNotification({
        id: "sing-in-status",
        title: "Sign In Error!",
        message: `Please Try Signing In Again!`,
        icon: <IconX size={16} />,
        color: "red",
        autoClose: 4000,
      });
    }
  };

  useEffect(() => {
    let sub = true;
    if (sub) {
      if (status === "authenticated") router.push("/");
      if (router.pathname === "/auth/sign-in") setVisible(false);
      if (status === "unauthenticated") setVisible(false);
      if (loading) setVisible(true);
    }
    return () => {
      sub = false;
    };
  }, [status, router, visible, loading]);

  return (
    <>
      <Card
        sx={{ maxWidth: 360 }}
        mx="auto"
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        style={{ marginTop: "200px", position: "relative" }}
      >
        <LoadingOverlay overlayBlur={2} visible={visible} />
        <Card.Section>
          <Box p="lg">
            <form>
              <TextInput
                label="User Name"
                placeholder="User Name ..."
                {...form.getInputProps("username")}
                required
              />
              <PasswordInput
                label="Password"
                placeholder="*******"
                mt="sm"
                {...form.getInputProps("password")}
                required
              />

              <Group mt="md">
                <Text color="gray">Create an account?</Text>
                <Text
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push("/auth/sign-up")}
                  color="blue"
                >
                  Sign Up
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
                      id: "sing-in-status",
                      color: "teal",
                      title: "Signing In",
                      message: `Validating User ${form.values.username} ...`,
                      loading: true,
                      autoClose: 50000,
                    });
                    setLoading(true);
                    handleSubmit();
                  }}
                >
                  Sign In
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
