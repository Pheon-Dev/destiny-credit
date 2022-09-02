import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Text,
} from "@mantine/core";
import { TitleText } from "../../components";
import { Products } from "../../types";
import { useRouter } from "next/router";
import { showNotification, updateNotification } from "@mantine/notifications";
import { GetStaticProps } from "next";
import { PrismaClient } from "@prisma/client";

const schema = z.object({
  productId: z.string().min(2, { message: "Enter Product ID" }),
  productName: z.string().min(2, { message: "Enter Product Name" }),
  minimumRange: z.string().min(2, { message: "Enter Minimum Range" }),
  maximumRange: z.string().min(2, { message: "Enter Maximum Range" }),
  interestRate: z.string().min(2, { message: "Enter Interest Rate (%)" }),
  frequency: z.string().min(2, { message: "Enter Frequency (PM | PA)" }),
  maximumTenure: z.string().min(2, { message: "Enter Maximum Tenure" }),
  repaymentCycle: z.string().min(2, { message: "Select Repayment Cycle" }),
  processingFee: z.string().min(1, { message: "Enter Processing Fee (%)" }),
  gracePeriod: z.string().min(1, { message: "Select Grace Period" }),
  penaltyRate: z.string().min(2, { message: "Enter Penalty Rate (%)" }),
  penaltyCharge: z.string().min(2, { message: "Select Penalty Charge Method" }),
  penaltyPayment: z
    .string()
    .min(2, { message: "Select Penalty Payment Structure" }),
});

const CreateProduct = ({ procode }: { procode: string }) => {
  const router = useRouter();

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      productId: `${procode}`,
      productName: "",
      minimumRange: "",
      maximumRange: "",
      interestRate: "",
      frequency: "",
      maximumTenure: "",
      repaymentCycle: "",
      processingFee: "",
      gracePeriod: "",
      penaltyRate: "",
      penaltyCharge: "",
      penaltyPayment: "",
      approved: false,
    },
  });

  const handleSave = async () => {
    console.table({
      productId: form.values.productId,
      productName: form.values.productName,
      minimumRange: form.values.minimumRange,
      maximumRange: form.values.maximumRange,
      interestRate: form.values.interestRate,
      frequency: form.values.frequency,
      maximumTenure: form.values.maximumTenure,
      repaymentCycle: form.values.repaymentCycle,
      processingFee: form.values.processingFee,
      gracePeriod: form.values.gracePeriod,
      penaltyRate: form.values.penaltyRate,
      penaltyCharge: form.values.penaltyCharge,
      penaltyPayment: form.values.penaltyPayment,
      approved: form.values.approved,
    });
    try {
      if (
        form.values.productId &&
        form.values.productName &&
        form.values.minimumRange &&
        form.values.maximumRange &&
        form.values.interestRate &&
        form.values.frequency &&
        form.values.maximumTenure &&
        form.values.repaymentCycle &&
        form.values.processingFee &&
        form.values.gracePeriod &&
        form.values.penaltyRate &&
        form.values.penaltyCharge &&
        form.values.penaltyPayment ||
        form.values.approved
      ) {
        console.log(
          form.values.productId,
          form.values.productName,
          form.values.minimumRange,
          form.values.maximumRange,
          form.values.interestRate,
          form.values.frequency,
          form.values.maximumTenure,
          form.values.repaymentCycle,
          form.values.processingFee,
          form.values.gracePeriod,
          form.values.penaltyRate,
          form.values.penaltyCharge,
          form.values.penaltyPayment,
          form.values.approved
        );
        const res = await axios.request({
          method: "POST",
          url: "/api/products/create",
          data: {
            productId: form.values.productId.toUpperCase(),
            productName: form.values.productName.toUpperCase(),
            minimumRange: form.values.minimumRange.toUpperCase(),
            maximumRange: form.values.maximumRange.toUpperCase(),
            interestRate: form.values.interestRate.toUpperCase(),
            frequency: form.values.frequency.toUpperCase(),
            maximumTenure: form.values.maximumTenure.toUpperCase(),
            repaymentCycle: form.values.repaymentCycle.toUpperCase(),
            processingFee: form.values.processingFee.toUpperCase(),
            gracePeriod: form.values.gracePeriod.toUpperCase(),
            penaltyRate: form.values.penaltyRate.toUpperCase(),
            penaltyCharge: form.values.penaltyCharge.toUpperCase(),
            penaltyPayment: form.values.penaltyPayment.toUpperCase(),
            approved: false,
          },
        });

        form.setFieldValue("productId", "");
        form.setFieldValue("productName", "");
        form.setFieldValue("minimumRange", "");
        form.setFieldValue("maximumRange", "");
        form.setFieldValue("interestRate", "");
        form.setFieldValue("frequency", "");
        form.setFieldValue("maximumTenure", "");
        form.setFieldValue("repaymentCycle", "");
        form.setFieldValue("processingFee", "");
        form.setFieldValue("gracePeriod", "");
        form.setFieldValue("penaltyRate", "");
        form.setFieldValue("penaltyCharge", "");
        form.setFieldValue("penaltyPayment", "");
        form.setFieldValue("approved", false);

        setTimeout(() => {
          updateNotification({
            id: "submit",
            color: "teal",
            title: `${res.data.productName} @ ${res.data.interestRate}%`,
            message: "Product Created Successfully!",
            icon: <IconCheck size={16} />,
            autoClose: 5000,
          });
        }, 2000);
        return router.push("/products");
      }
      setTimeout(() => {
        updateNotification({
          id: "submit",
          title: "Missing Fields",
          message: "Please Make Sure All Fields Are Filled!",
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
        <TitleText title="New Product" />
      </Group>

      <Grid grow>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Product Name"
            placeholder="Product Name"
            {...form.getInputProps("productName")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Product ID"
            placeholder="Product ID"
            {...form.getInputProps("productId")}
            disabled
            required
          />
        </Grid.Col>
      </Grid>

      <Grid grow>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Interest Rate"
            placeholder="Interest Rate"
            {...form.getInputProps("interestRate")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Select
            mt="md"
            label="Frequency (PA | PM)"
            placeholder="Frequency (PA | PM)"
            data={[
              { value: "pm", label: "Per Month" },
              { value: "pa", label: "Per Annum" },
            ]}
            {...form.getInputProps("frequency")}
            required
          />
        </Grid.Col>
      </Grid>

      <Grid grow>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Minimum Range"
            placeholder="Minimum Range"
            {...form.getInputProps("minimumRange")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Maximum Range"
            placeholder="Maximum Range"
            {...form.getInputProps("maximumRange")}
            required
          />
        </Grid.Col>
      </Grid>

      <Grid grow>
        <Grid.Col span={4}>
          <Select
            mt="md"
            label="Repayment Cycle"
            placeholder="Repayment Cycle"
            data={[
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weeekly" },
              { value: "monthly", label: "Monthly" },
            ]}
            {...form.getInputProps("repaymentCycle")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Processing Fee (%)"
            placeholder="Processing Fee (%)"
            {...form.getInputProps("processingFee")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Select
            mt="md"
            label="Grace Period"
            placeholder="Grace Period"
            data={[
              { value: "0", label: "0 Days" },
              { value: "1", label: "1 Day" },
            ]}
            {...form.getInputProps("gracePeriod")}
            required
          />
        </Grid.Col>
      </Grid>

      <Grid grow>
        <Grid.Col span={4}>
          <TextInput
            mt="md"
            label="Penalty Rate (%)"
            placeholder="Penalty Rate (%)"
            {...form.getInputProps("penaltyRate")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Select
            mt="md"
            label="Penalty Charged as"
            placeholder="Penalty Charged as"
            data={[
              { value: "installment", label: "% of Principal" },
              { value: "principal", label: "% of Installment" },
            ]}
            {...form.getInputProps("penaltyCharge")}
            required
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Select
            mt="md"
            label="Penalty Payment"
            placeholder="Penalty Payment"
            data={[
              { value: "each", label: "Each Installment" },
              { value: "last", label: "Last Installment" },
            ]}
            {...form.getInputProps("penaltyPayment")}
            required
          />
        </Grid.Col>
      </Grid>

      <Grid grow>
        <Grid.Col span={5}>
          <TextInput
            mt="md"
            label="Maximum Tenure"
            placeholder="Maximum Tenure"
            {...form.getInputProps("maximumTenure")}
            required
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <Group position="center" mt="xl" pt="md">
            <TitleText
              title={
                form.values.repaymentCycle === "daily"
                  ? "Days"
                  : form.values.repaymentCycle === "weekly"
                  ? "Weeks"
                  : "Months"
              }
            />
          </Group>
        </Grid.Col>
      </Grid>

      <Divider mt="lg" variant="dashed" my="sm" />

      <Group position="center" mt="xl">
        <Button
          // type="submit"
          variant="outline"
          onClick={() => {
            form.setFieldValue("productId", `${procode}`);
            form.setFieldValue("approved", false);
            form.validate();
            showNotification({
              id: "submit",
              title: "New Product",
              message: "Creating New Product ...",
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
  );
};

const Page = ({ products }: { products: Products[] }) => {
  let lencode: number = products.length + 1;
  let procode =
    lencode > 9
      ? lencode > 99
        ? lencode > 999
          ? lencode
          : "DC-P" + `${lencode}`
        : "DC-P0" + `${lencode}`
      : "DC-P00" + `${lencode}`;
  return (
    <>
      {(products && <CreateProduct procode={`${procode}`} />) || (
        <LoadingOverlay overlayBlur={2} visible />
      )}
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const prisma = new PrismaClient();
  let data = await prisma.products.findMany();
  data = JSON.parse(JSON.stringify(data));

  return {
    props: {
      products: data,
    },
  };
};

export default Page;
