import React from "react";
import { signIn } from "next-auth/react";
import { NextPage } from "next";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import {
  TextInput,
  Card,
  Badge,
  PasswordInput,
  Button,
  Box,
  Group,
  Text,
} from "@mantine/core";
import { useRouter } from "next/router";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import { trpc } from "../../utils/trpc";

const schema = z.object({
  username: z.string().min(2, { message: "User Name Missing" }),
  password: z.string().min(2, { message: "Password Missing" }),
});

const Page: NextPage = (props): JSX.Element => {
  const router = useRouter();
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      username: "",
      password: "",
    },
  });

  const logs = trpc.useQuery(["transactions.logs"]);

  const handleSubmit = async () => {
    try {
      const res = await signIn("credentials", {
        username: form.values.username,
        password: form.values.password,
        redirect: false,
      });

      if (res?.ok) {
        setTimeout(() => {
          updateNotification({
            id: "sing-in-status",
            color: "teal",
            title: "Successful Sign In!",
            message: `Welcome to Destiny Credit LTD, ${form.values.username}`,
            icon: <IconCheck size={16} />,
            autoClose: 8000,
          });
        });
        router.replace(router.asPath);
        if (logs.status === "loading" || logs.status === "success")
          return router.push("/");
      }

      if (res?.error) {
        return setTimeout(() => {
          updateNotification({
            id: "sing-in-status",
            color: "red",
            title: "Unsuccessful Sign In!",
            message: `${res?.error}`,
            icon: <IconX size={16} />,
            autoClose: 8000,
          });
        });
      }
    } catch (error) {
      setTimeout(() => {
        updateNotification({
          id: "sing-in-status",
          title: "Sign In Error!",
          message: `Please Try Signing In Again!`,
          icon: <IconX size={16} />,
          color: "red",
          autoClose: 4000,
        });
      });
    }
  };

  return (
    <Card
      sx={{ maxWidth: 360 }}
      mx="auto"
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{ marginTop: "200px" }}
    >
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
              type="password"
              /* description="password" */
              placeholder="*******"
              mt="sm"
              {...form.getInputProps("password")}
              required
            />

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
  );
};

export default Page;
