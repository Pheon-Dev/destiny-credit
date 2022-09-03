import React from "react";
import { signIn } from "next-auth/react";
import { NextPage } from "next";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { TextInput, Center, Button, Box, Group } from "@mantine/core";
import { useRouter } from "next/router";

const schema = z.object({
  username: z.string().min(2, { message: "Invalid Username" }),
  password: z.string().min(2, { message: "Invalid Password" }),
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

  const handleSubmit = async () => {
    const res = await signIn("credentials", {
      username: form.values.username,
      password: form.values.password,
      redirect: false,
    });

    console.log(res);
    router.push("/")
  };
  return (
  <Group position="center" mt="lg" >
    <Box sx={{ maxWidth: 340 }} mx="auto">
      <form>
        <TextInput
          label="User Name"
          placeholder="DCL000"
          {...form.getInputProps("username")}
          required
        />
        <TextInput
          label="Password"
          placeholder="*******"
          mt="sm"
          {...form.getInputProps("password")}
          required
        />

        <Group position="right" mt="xl">
          <Button
            onClick={() => {
              handleSubmit();
            }}
          >
            Sign In
          </Button>
        </Group>
      </form>
    </Box>
  </Group>
  );
};

export default Page;
