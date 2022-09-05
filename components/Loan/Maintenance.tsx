import React, { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { TextInput, Center, Button, Box, Group, Text,
  LoadingOverlay,
  Grid,
  Divider,
  Select,
} from "@mantine/core";
import Router, { useRouter } from "next/router";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconAlertCircle, IconCheck, IconX } from "@tabler/icons";
import { DateRangePicker, DateRangePickerValue } from "@mantine/dates";

const schema = z.object({
  member: z.string().min(2, { message: "User Name Missing" }),
  product: z.string().min(2, { message: "Product is Missing" }),
  amount: z.string().min(2, { message: "Amount is Missing" }),
  tenure: z.string().min(2, { message: "Tenure is Missing" }),
  start: z.string().min(2, { message: "Start Date is Missing" }),
  end: z.string().min(2, { message: "End Date is Missing" }),
});

export const Maintenance = () => {
  const date = new Date();
  const [value, setValue] = useState<DateRangePickerValue>([
      new Date(),
      new Date()
    ])
  const router = useRouter();
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      member: "",
      product: "",
      amount: "",
      tenure: "",
      start: "",
      end: "",
    },
  });

  const handleSubmit = async () => {
    try {
      setTimeout(() => {
        updateNotification({
          id: "sing-in-status",
          color: "teal",
          title: "Successful Sign In!",
          message: `Welcome to Destiny Credit LTD, ${form.values.member}`,
          icon: <IconCheck size={16} />,
          autoClose: 8000,
        });
      });
      /* router.push("/"); */
      /* const res = await axios.get("/api/"); */
      /* const data = res.data; */
      /* return Router.replace(Router.asPath); */
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

console.log(form.values)
  return (
    <Box>
    <form>
      <Grid grow>
        <Grid.Col span={4}>
        <TextInput
            mt="md"
          label="Select Member"
          placeholder="Select Member ..."
          {...form.getInputProps("member")}
          required
        />
        </Grid.Col>
        <Grid.Col span={4}>
        <TextInput
            mt="md"
          label="Select Product"
          placeholder="Select Product ..."
          {...form.getInputProps("product")}
          required
        />
        </Grid.Col>
      </Grid>

      <Grid grow>
        <Grid.Col span={4}>
        <TextInput
            mt="md"
            type="number"
          label="Enter Amount"
          placeholder="Enter Amount ..."
          {...form.getInputProps("amount")}
          required
        />
        </Grid.Col>
        <Grid.Col span={4}>
        {/* <TextInput */}
        {/*     mt="md" */}
        {/*     type="number" */}
        {/*   label="Enter Tenure" */}
        {/*   placeholder="Enter Tenure ..." */}
        {/*   {...form.getInputProps("tenure")} */}
        {/*   required */}
        {/* /> */}
        <DateRangePicker
            mt="md"
        label="Enter Tenure"
        placeholder="Enter Tenure ..."
        /* inputFormat="DD-MM-YYYY" */
        value={value}
        onChange={setValue}
        />
        </Grid.Col>
      </Grid>

      <Group position="right" mt="xl">
        <Button
          onClick={() => {
            form.validate();
          form.setFieldValue("start", `${value[0]}`);
          form.setFieldValue("end", `${value[1]}`);
            showNotification({
              id: "sing-in-status",
              color: "teal",
              title: "Signing In",
              message: `Validating User ${form.values.member} ...`,
              loading: true,
              autoClose: 50000,
            });
            handleSubmit();
          }}
        >
          Submit
        </Button>
      </Group>
      </form>
    </Box>
  );
};
