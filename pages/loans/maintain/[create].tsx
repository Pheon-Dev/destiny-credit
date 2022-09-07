import React, { useEffect, useRef, forwardRef, useState } from "react";
import { Collaterals, Guarantors, Protected } from "../../../components";
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
  Card,
  Box,
  Grid,
  Badge,
  Select,
  Menu,
  ActionIcon,
  Switch,
  Autocomplete,
} from "@mantine/core";
import Router, { useRouter } from "next/router";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconCheck,
  IconDots,
  IconEye,
  IconFileZip,
  IconTrash,
  IconX,
} from "@tabler/icons";
import {
  DatePicker,
  DateRangePicker,
  DateRangePickerValue,
} from "@mantine/dates";
import { Members, Products } from "../../../types";

const schema = z.object({
  member: z.string().min(2, { message: "User Name Missing" }),
  product: z.string().min(2, { message: "Product is Missing" }),
  principal: z.string().min(2, { message: "Principal Amount is Missing" }),
  tenure: z.string().min(1, { message: "Tenure is Missing" }),
  guarantorName: z.string().min(2, { message: "Guarantor Name is Missing" }),
  guarantorPhone: z.string().min(2, { message: "Guarantor Phone Number is Missing" }),
  guarantorId: z.string().min(2, { message: "Guarantor ID is Missing" }),
  guarantorRelationship: z.string().min(2, { message: "Guarantor Relationship is Missing" }),
});

const Page: NextPage = () => {
  const [active, setActive] = useState(0);
  const [sundays, setSundays] = useState(0);
  const [products, setProducts] = useState([]);
  const [members, setMembers] = useState([]);

  const [intRate, setIntRate] = useState("");
  const [proRate, setProRate] = useState("");
  const [penRate, setPenRate] = useState("");
  const [cycle, setCycle] = useState("");
  const [proName, setProName] = useState("");
  const [grace, setGrace] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState(false);
  const [checked, setChecked] = useState(false);
  const [payoff, setPayoff] = useState(false);

  const router = useRouter();
  const id = router.query.create as string;

  const nextStep = () => {
    form.validate();
    showNotification({
      id: "maintainance-status",
      color: "teal",
      title: "Saving Data",
      message: `Saving Loan Information ...`,
      loading: true,
      autoClose: 50000,
    });
    handleSubmit();
    if (
      form.values.tenure &&
      form.values.principal &&
      form.values.member &&
      form.values.maintained &&
      form.values.grace &&
      form.values.installment &&
      form.values.memberId &&
      form.values.productId &&
      form.values.payoff &&
      form.values.penalty &&
      form.values.processingFee &&
      form.values.product &&
      form.values.sundays &&
      form.values.tenure &&
      form.values.interest
    ) {
      if (
        form.values.guarantorPhone &&
        form.values.guarantorRelationship &&
        form.values.guarantorName &&
        form.values.guarantorId
      ) {
        return console.log("Write to DB");
      }
      if (active === 1)
        return setTimeout(() => {
          updateNotification({
            id: "maintainance-status",
            color: "red",
            title: "Guarantor Missing Fields!",
            message: `Please Fill in All the Missing Fields`,
            icon: <IconX size={16} />,
            autoClose: 5000,
          });
        });
      return setActive((current) => (current < 3 ? current + 1 : current));
    }
    setTimeout(() => {
      updateNotification({
        id: "maintainance-status",
        color: "red",
        title: "Loan Missing Fields!",
        message: `Please Fill in All the Missing Fields`,
        icon: <IconX size={16} />,
        autoClose: 5000,
      });
    });
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  async function fetchMemberNProducts() {
    let subscription = true;

    if (subscription) {
      if (products.length < 1) setStatus(true);
      const mem = await axios.request({
        method: "POST",
        url: `/api/members/${id}`,
        data: {
          id: `${id}`,
        },
      });

/* console.log(ref.current.defaultValue.split(" ")[0]) */
/* const fname = ref.current.defaultValue.split(" ")[0] */
/* const lname = ref.current.defaultValue.split(" ")[1] */

      /* const search = await axios.request({ */
      /*   method: "POST", */
      /*   url: `/api/members, search/${id}`, */
      /*   data: { */
      /*     firstName: `${fname}`, */
      /*     lastName: `${lname}`, */
      /*   }, */
      /* }); */

      const pro = await axios.request({
        method: "GET",
        url: "/api/products",
      });

      const mems = await axios.request({
        method: "GET",
        url: "/api/members",
      });

      const pros = pro.data.products;

      setProducts(pros);
      setMembers(mems.data.members);

      if (mem.data.member[0]?.firstName?.length > 0)
        form.setFieldValue("memberId", `${mem.data.member[0].id}`);
      form.setFieldValue("productId", `${id}`);
      form.setFieldValue(
        "member",
        `${mem.data.member[0].firstName} ${mem.data.member[0].lastName}`
      );
      setStatus(false);
    }

    return () => {
      subscription = false;
    };
  }

  useEffect(() => {
    fetchMemberNProducts();
  }, []);

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      member: "",
      memberId: "",
      product: "",
      productId: "",
      principal: "",
      tenure: "",
      interest: "",
      installment: "",
      penalty: "",
      processingFee: "",
      payoff: "",
      sundays: "",
      grace: "",
      maintained: false,
      approved: false,
      disbursed: false,
      guarantorName: "",
      guarantorPhone: "",
      guarantorRelationship: "",
      guarantorId: "",
    },
  });

  async function fetchProduct() {
    const pr = await axios.request({
      method: "POST",
      url: `/api/products/${form.values.product}`,
      data: {
        productName: `${form.values.product}`,
      },
    });

    pr.data?.product
      ? pr.data?.product?.map((_: Products) => {
          setIntRate(_.interestRate);
          setPenRate(_.penaltyRate);
          setCycle(_.repaymentCycle);
          setProRate(_.processingFee);
          setProName(_.productName);
          setGrace(_.gracePeriod);
        })
      : null;
  }

  useEffect(() => {
    let s = true;

    if (s) {
      let sundays = 0;
      let counter = 0;
      let term = +form.values.tenure;
      fetchProduct();

      while (counter < term + 1) {
        const date = new Date();
        date.setDate(date.getDate() + counter);
        let day = date.getDay();
        if (day === 0) {
          setSundays((sundays += 1));
        }
        counter++;
      }

      if (checked) setSundays(0);

      form.setFieldValue("payoff", `${payoff}`);
      form.setFieldValue("sundays", `${sundays}`);
      form.setFieldValue("grace", `${grace}`);
      form.setFieldValue("maintained", true);
      form.setFieldValue("approved", false);
      form.setFieldValue("disbursed", false);
      form.setFieldValue(
        "interest",
        `${
          cycle.toLowerCase() === "daily"
            ? renderDailyInterestAmount(
                +intRate,
                +form.values.principal,
                +form.values.tenure
              )
            : cycle.toLowerCase() === "weekly"
            ? renderWeeklyInterestAmount(
                +intRate,
                +form.values.principal,
                +form.values.tenure
              )
            : renderMonthlyInterestAmount(
                +intRate,
                +form.values.principal,
                +form.values.tenure
              )
        }`
      );
      form.setFieldValue(
        "installment",
        `${
          cycle.toLowerCase() === "daily"
            ? renderDailyInstallmentAmount(
                +intRate,
                +form.values.principal,
                +form.values.tenure
              )
            : cycle.toLowerCase() === "weekly"
            ? renderWeeklyInstallmentAmount(
                +intRate,
                +form.values.principal,
                +form.values.tenure
              )
            : renderMonthlyInstallmentAmount(
                +intRate,
                +form.values.principal,
                +form.values.tenure
              )
        }`
      );
      form.setFieldValue(
        "penalty",
        `${renderPenaltyAmount(
          +penRate,
          +intRate,
          cycle,
          +form.values.principal,
          +form.values.tenure
        )}`
      );
      form.setFieldValue(
        "processingFee",
        `${renderProcessingFeeAmount(+proRate, +form.values.principal)}`
      );
    }

    return () => {
      s = false;
    };
  }, [
    checked,
    sundays,
    intRate,
    proName,
    form.values.principal,
    form.values.tenure,
    form.values.product,
  ]);

  /* console.log(form.values.product); */
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
      console.log(form.values);
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

  const roundOff = (value: number) => {
    return (
      +value.toString().split(".")[1] > 0
        ? +value.toString().split(".")[0] + 1
        : +value.toString().split(".")[0] + 0
    ).toString();
  };

  const renderDailyInterestAmount = (
    rate: number,
    principal: number,
    tenure: number
  ) => {
    let multiplier = 30 / 4;
    tenure =
      tenure === 7
        ? multiplier
        : tenure === 14
        ? multiplier * 2
        : tenure === 21
        ? multiplier * 3
        : tenure;

    return roundOff(((rate * principal) / 3000) * tenure);
  };

  const renderDailyInstallmentAmount = (
    rate: number,
    principal: number,
    tenure: number
  ) => {
    let principalAmount = renderDailyInterestAmount(rate, principal, tenure);

    return roundOff((+principalAmount + principal) / (tenure - sundays));
  };

  const renderWeeklyInterestAmount = (
    rate: number,
    principal: number,
    tenure: number
  ) => {
    return roundOff(((rate * principal) / 400) * tenure);
  };

  const renderWeeklyInstallmentAmount = (
    rate: number,
    principal: number,
    tenure: number
  ) => {
    let principalAmount = renderWeeklyInterestAmount(rate, principal, tenure);

    return roundOff((+principalAmount + principal) / tenure);
  };

  const renderMonthlyInterestAmount = (
    rate: number,
    principal: number,
    tenure: number
  ) => {
    return roundOff(((rate * principal) / 100) * tenure);
  };

  const renderMonthlyInstallmentAmount = (
    rate: number,
    principal: number,
    tenure: number
  ) => {
    let principalAmount = renderMonthlyInterestAmount(rate, principal, tenure);

    return roundOff((+principalAmount + principal) / tenure);
  };

  const renderProcessingFeeAmount = (rate: number, principal: number) => {
    let proc_fee = roundOff((rate / 100) * principal);

    return +proc_fee < 301 ? 300 : proc_fee;
  };

  const renderPenaltyAmount = (
    penalty_rate: number,
    interest_rate: number,
    cycle: string,
    principal: number,
    tenure: number
  ) => {
    let installment =
      cycle.toLowerCase() === "daily"
        ? renderDailyInstallmentAmount(interest_rate, principal, tenure)
        : cycle.toLowerCase() === "weekly"
        ? renderWeeklyInstallmentAmount(interest_rate, principal, tenure)
        : renderMonthlyInstallmentAmount(interest_rate, principal, tenure);
    return roundOff((penalty_rate / 100) * +installment);
  };

  const Review = () => {
    return (
      <Card shadow="sm" p="lg" radius="md" m="xl" withBorder>
        <Card.Section withBorder inheritPadding py="xs">
          <Group position="apart">
            <Text weight={700}>Review</Text>
            {/* <Menu withinPortal position="bottom-end" shadow="sm"> */}
            {/*   <Menu.Target> */}
            {/*     <ActionIcon> */}
            {/*       <IconDots size={16} /> */}
            {/*     </ActionIcon> */}
            {/*   </Menu.Target> */}
            {/**/}
            {/*   <Menu.Dropdown> */}
            {/*     <Menu.Item icon={<IconFileZip size={14} />}>Download zip</Menu.Item> */}
            {/*     <Menu.Item icon={<IconEye size={14} />}>Preview all</Menu.Item> */}
            {/*     <Menu.Item icon={<IconTrash size={14} />} color="red"> */}
            {/*       Delete all */}
            {/*     </Menu.Item> */}
            {/*   </Menu.Dropdown> */}
            {/* </Menu> */}
          </Group>
        </Card.Section>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>
            Include Payments on Sunday. (
            {`${sundays} ${sundays === 1 ? "Sunday" : "Sundays"}`})
          </Text>
          <Switch
            aria-label="Sundays"
            size="md"
            onLabel="ON"
            offLabel="OFF"
            checked={checked}
            onChange={(event) => {
              setChecked(event.currentTarget.checked);
            }}
          />
        </Group>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>Loan Payoff</Text>
          <Switch
            aria-label="Payoff"
            size="md"
            onLabel="ON"
            offLabel="OFF"
            checked={payoff}
            onChange={(event) => {
              setPayoff(event.currentTarget.checked);
            }}
          />
        </Group>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>Product</Text>
          <Text weight={500}>{proName}</Text>
        </Group>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>Interest Amount ({intRate} %)</Text>
          {cycle.toLowerCase() === "daily" ? (
            <Text weight={500}>
              {renderDailyInterestAmount(
                +intRate,
                +form.values.principal,
                +form.values.tenure
              )}
              .00
            </Text>
          ) : cycle.toLowerCase() === "weekly" ? (
            <Text weight={500}>
              {renderWeeklyInterestAmount(
                +intRate,
                +form.values.principal,
                +form.values.tenure
              )}
              .00
            </Text>
          ) : (
            <Text weight={500}>
              {renderMonthlyInterestAmount(
                +intRate,
                +form.values.principal,
                +form.values.tenure
              )}
              .00
            </Text>
          )}
        </Group>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>Installment Amount</Text>
          {cycle.toLowerCase() === "daily" ? (
            <Text weight={500}>
              {renderDailyInstallmentAmount(
                +intRate,
                +form.values.principal,
                +form.values.tenure
              )}
              .00
            </Text>
          ) : cycle.toLowerCase() === "weekly" ? (
            <Text weight={500}>
              {renderWeeklyInstallmentAmount(
                +intRate,
                +form.values.principal,
                +form.values.tenure
              )}
              .00
            </Text>
          ) : (
            <Text weight={500}>
              {renderMonthlyInstallmentAmount(
                +intRate,
                +form.values.principal,
                +form.values.tenure
              )}
              .00
            </Text>
          )}
        </Group>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>Penalty Amount ({penRate} %)</Text>
          <Text weight={500}>
            {renderPenaltyAmount(
              +penRate,
              +intRate,
              cycle,
              +form.values.principal,
              +form.values.tenure
            )}
            .00
          </Text>
        </Group>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>Processing Fee Amount ({proRate} %)</Text>
          <Text weight={500}>
            {renderProcessingFeeAmount(+proRate, +form.values.principal)}
            .00
          </Text>
        </Group>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>Repayment Cycle</Text>
          <Text weight={500}>{cycle}</Text>
        </Group>
        {cycle.toLowerCase() === "daily" ? (
          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>Grace Period</Text>
            <Text weight={500}>{grace} Day</Text>
          </Group>
        ) : null}
      </Card>
    );
  };

  const product_data = products.map((_: Products) => [
    { key: _.id, value: `${_.id}`, label: `${_.productName}` },
  ]);

  const guarantor_data = members.map((_: Members) => [
    { key: _.id, value: `${_.id}`, label: `${_.firstName} ${_.lastName}` },
  ]);

  return (
    <Protected>
      <Stepper mt="lg" active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step
          label="Loan Maintenance"
          description="Select a Member & a Product."
          loading={status}
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
                  <Select
                    mt="md"
                    label="Select Product"
                    placeholder="Select Product ..."
                    data={product_data?.map((p) => p[0].label)}
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
                    label="Enter Principal Amount"
                    placeholder="Enter Principal Amount ..."
                    {...form.getInputProps("principal")}
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
          <Review />
        </Stepper.Step>
        <Stepper.Step
          label="Add a Guarantor"
          description="Add a Guarantor to Guarantee this Loan"
        >
          <Box>
            <form>
              <Grid grow>
                <Grid.Col span={4}>
                  <Autocomplete
                    mt="md"
                    label="Enter Guarantor Names"
                    placeholder="Enter Guarantor Names ..."
                    ref={ref}
                    /* data={[ */
                    /*   { label: "Gname One", value: "gname1" }, */
                    /*   { label: "Gname Two", value: "gname2" }, */
                    /*   { label: "Gname Three", value: "gname3" }, */
                    /* ]} */
                    data={guarantor_data?.map((p) => p[0].label)}
                    {...form.getInputProps("guarantorName")}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    mt="md"
                    label="Phone Number"
                    placeholder="Phone Number ..."
                    {...form.getInputProps("guarantorPhone")}
                    required
                  />
                </Grid.Col>
              </Grid>

              <Grid grow>
                <Grid.Col span={4}>
                  <TextInput
                    mt="md"
                    label="ID"
                    placeholder="Enter ID ..."
                    {...form.getInputProps("guarantorId")}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    mt="md"
                    label="Relationship"
                    placeholder="Relationship ..."
                    {...form.getInputProps("guarantorRelationship")}
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
      <pre>{JSON.stringify(products, undefined, 2)}</pre>
    </Protected>
  );
};

export default Page;
