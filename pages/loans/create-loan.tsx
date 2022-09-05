import React, { useEffect, useState } from "react";
import { Collaterals, Guarantors, Protected } from "../../components";
import { NextPage } from "next";
import axios from "axios";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import {
  Group,
  Stepper,
  Button,
  LoadingOverlay,
  Text,
  TextInput,
  Center,
  Box,
  Grid,
  Divider,
  Select,
} from "@mantine/core";
import Router, { useRouter } from "next/router";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconAlertCircle, IconCheck, IconX } from "@tabler/icons";
import {
  DatePicker,
  DateRangePicker,
  DateRangePickerValue,
} from "@mantine/dates";

const schema = z.object({
  member: z.string().min(2, { message: "User Name Missing" }),
  product: z.string().min(2, { message: "Product is Missing" }),
  amount: z.string().min(2, { message: "Amount is Missing" }),
  tenure: z.string().min(1, { message: "Tenure is Missing" }),
  start: z.string().min(2, { message: "Start Date is Missing" }),
});

const Page: NextPage = () => {
  const [active, setActive] = useState(0);

  const nextStep = () => {
    form.validate();
    form.setFieldValue("start", `${value}`);
    showNotification({
      id: "maintainance-status",
      color: "teal",
      title: "Saving Data",
      message: `Saving Loan Information ...`,
      loading: true,
      autoClose: 50000,
    });
    handleSubmit();
    if (form.values.tenure && form.values.amount && form.values.member && form.values.start) {
      return setActive((current) => (current < 3 ? current + 1 : current));
    }
      setTimeout(() => {
        updateNotification({
          id: "maintainance-status",
          color: "red",
          title: "Missing Fields!",
          message: `Please Fill All the Missing Fields`,
          icon: <IconX size={16} />,
          autoClose: 5000,
        });
      });
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  /* const [value, setValue] = useState(); */
  const [products, setProducts] = useState([]);
  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState(false);

  async function fetchMembersProducts() {
    let subscription = true;

    if (subscription) {
      const mem = await axios.request({
        method: "GET",
        url: "/api/members",
      });

      const pro = await axios.request({
        method: "GET",
        url: "/api/products",
      });

      const pros = pro.data.products;
      const mems = mem.data.members;

      setProducts(pros);
      setMembers(mems);
    }

    return () => {
      subscription = false;
    };
  }

  useEffect(() => {
    fetchMembersProducts();
    !members && setStatus(true);
    members && setStatus(false);
  }, [members, products]);

  const router = useRouter();
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      member: "",
      product: "",
      amount: "",
      tenure: "",
      start: "",
    },
  });

  const date = new Date();
  date.setDate(date.getDate() + Number(form.values.tenure));
  const [value, setValue] = useState<DateRangePickerValue>([
    new Date(),
    new Date(date),
  ]);
  useEffect(() => {
    let s = true;

    if (s) {
      console.log(form.values);
    }

    return () => {
      s = false;
    };
  }, [value, form.values.tenure, date]);

  const handleSubmit = async () => {
    try {
      setTimeout(() => {
        updateNotification({
          id: "maintainance-status",
          color: "teal",
          title: "Successful Loan Maintenance!",
          message: `Next Step is Adding a Loan Guarantor ...`,
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
          id: "maintainance-status",
          title: "Maintenance Error!",
          message: `Please Try Maintaining Again!`,
          icon: <IconX size={16} />,
          color: "red",
          autoClose: 4000,
        });
      });
    }
  };

  return (
    <Protected>
      <Stepper mt="lg" active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step
          label="Loan Maintenance"
          description="Select a Member & a Product."
        >
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
                  <TextInput
                    mt="md"
                    type="number"
                    label="Enter Tenure"
                    placeholder="Enter Tenure ..."
                    {...form.getInputProps("tenure")}
                    required
                  />
                </Grid.Col>
              </Grid>

              {/* <Grid grow> */}
              {/*   <Grid.Col span={6}> */}
              {/*     <DatePicker */}
              {/*       mt="md" */}
              {/*       label="Enter Start Date" */}
              {/*       placeholder="Enter Start Date ..." */}
              {/*       inputFormat="DD-MM-YYYY" */}
              {/*       {...form.getInputProps("start")} */}
              {/*       value={value} */}
              {/*       onChange={setValue} */}
              {/*     /> */}
              {/*     <DateRangePicker */}
              {/*       mt="md" */}
              {/*       label="Enter Tenure" */}
              {/*       placeholder="Enter Tenure ..." */}
              {/*       value={value} */}
              {/*       onChange={setValue} */}
              {/*     /> */}
              {/*   </Grid.Col> */}
              {/* </Grid> */}
            </form>
          </Box>
        </Stepper.Step>
        <Stepper.Step
          label="Add a Guarantor"
          description="Add a Guarantor to Guarantee this Loan"
        >
          <Guarantors />
        </Stepper.Step>
        <Stepper.Step
          label="Add Collaterals"
          description="Lastly, Add Collaterals to Proceed."
        >
          <Collaterals />
        </Stepper.Step>
        <Stepper.Completed>
          <Text>Loan Maintained Successfully</Text>
        </Stepper.Completed>
      </Stepper>

      <Group position="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>Next</Button>
        {/* <Button onClick={nextStep}>Next</Button> */}
      </Group>
            <pre>{JSON.stringify(members, undefined, 2)}</pre>
            <pre>{JSON.stringify(products, undefined, 2)}</pre>
    </Protected>
  );
};

export default Page;
