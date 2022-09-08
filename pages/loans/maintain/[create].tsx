import React, { useEffect, useRef, forwardRef, useState } from "react";
import { Protected } from "../../../components";
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
  NumberInput,
  Tooltip,
  Modal,
} from "@mantine/core";
import Router, { useRouter } from "next/router";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconCheck,
  IconDots,
  IconEye,
  IconFileZip,
  IconInfoCircle,
  IconMinus,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons";
import {
  DatePicker,
  DateRangePicker,
  DateRangePickerValue,
} from "@mantine/dates";
import { Collaterals, Members, Products } from "../../../types";

const loan_schema = z.object({
  member: z.string().min(2, { message: "User Name Missing" }),
  product: z.string().min(2, { message: "Product is Missing" }),
  principal: z.string().min(2, { message: "Principal Amount is Missing" }),
  tenure: z.string().min(1, { message: "Tenure is Missing" }),
  /* guarantorName: z.string().min(2, { message: "Guarantor Name is Missing" }), */
  /* guarantorPhone: z */
  /*   .string() */
  /*   .min(2, { message: "Guarantor Phone Number is Missing" }), */
  /* guarantorId: z.string().min(2, { message: "Guarantor ID is Missing" }), */
  /* guarantorRelationship: z */
  /*   .string() */
  /*   .min(2, { message: "Guarantor Relationship is Missing" }), */
});

const guarantor_schema = z.object({
  guarantorName: z.string().min(2, { message: "Guarantor Name is Missing" }),
  guarantorPhone: z
    .string()
    .min(2, { message: "Guarantor Phone Number is Missing" }),
  guarantorId: z.string().min(2, { message: "Guarantor ID is Missing" }),
  guarantorRelationship: z
    .string()
    .min(2, { message: "Guarantor Relationship is Missing" }),
});

const collateral_schema = z.object({
  item: z.string().min(2, { message: "Item is Missing" }),
  value: z.string().min(2, { message: "Item Value is Missing" }),
});

const Page: NextPage = () => {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [sundays, setSundays] = useState(0);
  const [products, setProducts] = useState([]);
  const [members, setMembers] = useState([]);
  const [collaterals, setCollaterals] = useState([]);
  const [collateral, setCollateral] = useState([]);
  const [guarantors, setGuarantors] = useState([]);

  const [intRate, setIntRate] = useState("");
  const [proRate, setProRate] = useState("");
  const [penRate, setPenRate] = useState("");
  const [cycle, setCycle] = useState("");
  const [proName, setProName] = useState("");
  const [grace, setGrace] = useState("");
  const [maxTenure, setMaxTenure] = useState(0);
  const [maxRange, setMaxRange] = useState(0);
  const [minRange, setMinRange] = useState(0);

  const [status, setStatus] = useState(false);
  const [checked, setChecked] = useState(false);
  const [payoff, setPayoff] = useState(false);

  const router = useRouter();
  const id = router.query.create as string;

  const nextStep = () => {
    if (form.values.principal.length > 0 && +form.values.principal < minRange) {
      showNotification({
        id: "range-status",
        color: "red",
        title: "Minimum Principal Range",
        message: `Principal is Below Minimum Range of ${minRange} ...`,
        icon: <IconInfoCircle size={24} />,
      });
      form.setFieldValue("principal", "");
      return form.setFieldError(
        "principal",
        `Principal is Below Minimum Range of ${minRange} ...`
      );
    }
    if (
      +form.values.principal > minRange &&
      +form.values.principal > maxRange
    ) {
      form.setFieldValue("principal", "");
      return form.setFieldError(
        "principal",
        `Principal Exceeds Maximum Range of KSHs. ${maxRange} ...`
      );
    }

    showNotification({
      id: "maintainance-status",
      color: "teal",
      title: "Saving Data",
      message: `Saving Loan Information ...`,
      loading: true,
      autoClose: 50000,
    });
    form.setFieldValue("principal", `${form.values.principal}`);
    form.validate();
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
      if (active === 1) guarantor_form.validate();
      if (
        guarantor_form.values.guarantorPhone &&
        guarantor_form.values.guarantorRelationship &&
        guarantor_form.values.guarantorName &&
        guarantor_form.values.guarantorId
      ) {
        return setActive((current) => (current < 3 ? current + 1 : current));
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

  const deleteCollateral = async (id: string) => {
    try {
      const col = await axios.request({
        method: "POST",
        url: "/api/members/collateral/delete",
        data: {
          id: `${id}`,
        },
      });
      setTimeout(() => {
        updateNotification({
          id: "collateral-delete-status",
          color: "red",
          title: "Collateral Deletion",
          message: "Collateral Successfully Deleted",
          icon: <IconX size={16} />,
          autoClose: 5000,
        });
      });
    } catch (error) {
      setTimeout(() => {
        updateNotification({
          id: "collateral-delete-status",
          color: "red",
          title: "Collateral Deletion Error",
          message: "Collateral Unsuccessfully Deleted. Please Try Again.",
          icon: <IconX size={16} />,
          autoClose: 5000,
        });
      });
    }
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  async function fetchMemberNProducts() {
    let subscription = true;

    if (subscription) {
      if (products.length < 1) setStatus(true);
      const gua = await axios.request({
        method: "POST",
        url: `/api/members/guarantor/${id}`,
        data: {
          id: `${id}`,
        },
      });

      const col = await axios.request({
        method: "POST",
        url: `/api/members/collateral/${id}`,
        data: {
          id: `${id}`,
        },
      });

      const cols = await axios.request({
        method: "GET",
        url: "/api/members/collateral",
      });

      const mem = await axios.request({
        method: "POST",
        url: `/api/members/${id}`,
        data: {
          id: `${id}`,
        },
      });

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
      setCollaterals(cols.data.collaterals);
      setCollateral(col.data.collateral);
      setGuarantors(gua.data.guarantor);

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
  }, [products, members]);

  const form = useForm({
    validate: zodResolver(loan_schema),
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
    },
  });

  const guarantor_form = useForm({
    validate: zodResolver(guarantor_schema),
    initialValues: {
      guarantorName: "",
      guarantorPhone: "",
      guarantorRelationship: "",
      guarantorId: "",
    },
  });

  const collateral_form = useForm({
    validate: zodResolver(collateral_schema),
    initialValues: {
      item: "",
      value: "",
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
          setMaxTenure(+_.maximumTenure);
          setMaxRange(+_.maximumRange);
          setMinRange(+_.minimumRange);
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

    if (form.values.tenure.length > 0 && +form.values.tenure > maxTenure) {
      form.setFieldValue("tenure", "");
      form.setFieldError(
        "tenure",
        `Principal Exceeds Maximum Tenure Range of ${maxTenure} ${
          cycle.toLowerCase() === "daily"
            ? "days"
            : cycle.toLowerCase() === "weekly"
            ? "weeks"
            : "months"
        } ...`
      );
      showNotification({
        id: "range-status",
        color: "red",
        title: "Maximum Tenure Range",
        message: `Principal Exceeds Maximum Tenure Range of ${maxTenure} ${
          cycle.toLowerCase() === "daily"
            ? "days"
            : cycle.toLowerCase() === "weekly"
            ? "weeks"
            : "months"
        } ...`,
        icon: <IconInfoCircle size={24} />,
      });
    }

    if (
      +form.values.principal > minRange &&
      +form.values.principal > maxRange
    ) {
      /* form.setFieldValue("principal", ""); */
      form.setFieldError(
        "principal",
        `Principal Exceeds Maximum Range of KSHs. ${maxRange} ...`
      );
      showNotification({
        id: "range-status",
        color: "red",
        title: "Maximum Principal Range",
        message: `Principal Exceeds Maximum Range of KSHs. ${maxRange} ...`,
        icon: <IconInfoCircle size={24} />,
      });
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
          id: "submit-status",
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
          id: "submit-status",
          title: "Maintenance Error!",
          message: `Please Try Maintaining Again!`,
          icon: <IconX size={16} />,
          color: "red",
          autoClose: 4000,
        });
      });
    }
  };

  const handleCollaterals = async () => {
    try {
      if (
        form.values.memberId &&
        collateral_form.values.item &&
        collateral_form.values.value
      ) {
        const add = await axios.request({
          method: "POST",
          url: "/api/members/collateral/create",
          data: {
            memberId: form.values.memberId,
            item: collateral_form.values.item.toUpperCase(),
            value: collateral_form.values.value,
          },
        });
        collateral_form.setFieldValue("item", "");
        collateral_form.setFieldValue("value", "");
        return setTimeout(() => {
          updateNotification({
            id: "collateral-status",
            color: "teal",
            title: "Collaterals",
            message: `${add.data.item} @ ${add.data.value} Added Successfully as Collateral!`,
            icon: <IconCheck size={16} />,
            autoClose: 8000,
          });
        });
      }

      setTimeout(() => {
        updateNotification({
          id: "collateral-status",
          title: "Collateral Error!",
          message: `Please Try Adding Again!`,
          icon: <IconX size={16} />,
          color: "red",
          autoClose: 4000,
        });
      });
      /* router.push("/"); */
      /* const res = await axios.get("/api/"); */
      /* const data = res.data; */
      /* return Router.replace(Router.asPath); */
    } catch (error) {
      setTimeout(() => {
        updateNotification({
          id: "collateral-status",
          title: "Collateral Error!",
          message: `Please Try Adding Again!`,
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

  const product_data = products.map((_: Products) => [
    { key: _.id, value: `${_.id}`, label: `${_.productName}` },
  ]);

  const guarantor_data = members.map((_: Members) => [
    { key: _.id, value: `${_.id}`, label: `${_.firstName} ${_.lastName}` },
  ]);

  const findGuarantor = (name: string) => {
    return members.find((e: Members) => {
      if (e.firstName + " " + e.lastName === name) {
        guarantor_form.setFieldValue("guarantorPhone", `${e.phoneNumber}`);
        guarantor_form.setFieldValue("guarantorId", `${e.idPass}`);
      }
    });
  };

  useEffect(() => {
    if (
      guarantor_form.values.guarantorName !== "" &&
      guarantor_form.values.guarantorName === form.values.member
    ) {
      guarantor_form.setFieldError(
        "guarantorName",
        `${form.values.member} Cannot Self-Guarantee`
      );
      guarantor_form.setFieldValue("guarantorPhone", ``);
      guarantor_form.setFieldValue("guarantorId", ``);
      return showNotification({
        id: "guarantor-status",
        color: "red",
        title: "Guarantor Info",
        message: `Member Cannot Self-Guarantee ...`,
        icon: <IconInfoCircle size={24} />,
        autoClose: false,
      });
    }
    if (guarantor_form.values.guarantorName !== form.values.member) {
      setTimeout(() => {
        updateNotification({
          id: "guarantor-status",
          color: "teal",
          title: "Guarantor Info",
          message: `Guarantor Selected Successfully`,
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
      });
      findGuarantor(guarantor_form.values.guarantorName);
    }
  }, [
    guarantor_form.values.guarantorName,
    guarantor_form.values.guarantorId,
    guarantor_form.values.guarantorPhone,
  ]);

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

  const preview = () => {
    return (
      <>
        <Modal
          opened={open}
          onClose={() => setOpen(false)}
          title="Preview Loan Details"
        >
          <Card shadow="sm" p="lg" radius="md" m="xl" withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <Group position="apart">
                <Text weight={700}>{form.values.member}</Text>
                <Menu withinPortal position="bottom-end" shadow="sm">
                  <Menu.Target>
                    <ActionIcon>
                      <IconDots size={16} />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item icon={<IconFileZip size={14} />}>
                      Download zip
                    </Menu.Item>
                    <Menu.Item icon={<IconEye size={14} />}>
                      Preview all
                    </Menu.Item>
                    <Menu.Item icon={<IconTrash size={14} />} color="red">
                      Delete all
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Card.Section>
            <Card.Section withBorder inheritPadding py="xs">
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Loan Product</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{form.values.product}</Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Skipped Sundays</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{form.values.sundays} {sundays === 1 ? "Sunday" : "Sundays"}</Text>
                </Grid.Col>
              </Grid>
              {payoff && (
                  <Grid grow>
                    <Grid.Col mt="xs" span={4}>
                      <Text weight={500}>Payoff Amount</Text>
                    </Grid.Col>
                    <Grid.Col mt="xs" span={4}>
                  <Text>{`KSHs. ${form.values.payoff}.00`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                    </Grid.Col>
                  </Grid>
              )}
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Loan Tenure</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{form.values.tenure} {cycle.toLowerCase() === "daily" ? "Days" : cycle.toLowerCase() === "weeks" ? "Weeks" : "Months"}</Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Principal Amount</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{`KSHs. ${form.values.principal}.00`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Installment Amount</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{`KSHs. ${form.values.installment}.00`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Interest Amount</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{`KSHs. ${form.values.interest}.00`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Penalty Amount</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{`KSHs. ${form.values.penalty}.00`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Processing Fee</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{`KSHs. ${form.values.processingFee}.00`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                </Grid.Col>
              </Grid>
              {form.values.grace === "1" && (
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Grace Period</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{form.values.grace} Day</Text>
                </Grid.Col>
              </Grid>
              )}
            <Group mt="xl">
              <Button
              variant="light"
              color="blue"
              fullWidth mt="md" radius="md"
                onClick={() => {
                  form.validate();
                  showNotification({
                    id: "submit-status",
                    color: "teal",
                    title: `${form.values.member}`,
                    message: `Maintaining Loan For ${form.values.member} ...`,
                    loading: true,
                    autoClose: 50000,
                  });
                  handleSubmit();
                }}
              >
                Submit
              </Button>
              </Group>
            </Card.Section>
          </Card>
        </Modal>
      </>
    );
  };

  /* console.log(collaterals) */
  /* console.log(guarantors) */

  return (
    <Protected>
      <Stepper mt="lg" active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step
          label="Loan Maintenance"
          description="Select a Member & a Product."
          loading={status}
          allowStepSelect={active > 0}
        >
          <Box>
            <form>
              <Grid grow>
                <Grid.Col span={4}>
                  <TextInput
                    mt="md"
                    label="Member"
                    placeholder="Member ..."
                    {...form.getInputProps("member")}
                    disabled={form.values.memberId.length > 0 ? false : true}
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
                    disabled={form.values.memberId.length > 0 ? false : true}
                    required
                  />
                </Grid.Col>
              </Grid>

              <Grid grow>
                <Grid.Col span={4}>
                  <TextInput
                    mt="md"
                    type="number"
                    min={0}
                    label="Enter Principal Amount"
                    placeholder="Enter Principal Amount ..."
                    {...form.getInputProps("principal")}
                    disabled={maxRange > 0 ? false : true}
                    required
                  />
                  {/* <NumberInput */}
                  {/*   mt="md" */}
                  {/*   label="Enter Principal Amount" */}
                  {/*   placeholder="Enter Principal Amount ..." */}
                  {/*   defaultValue={0} */}
                  {/*   parser={(value) => value?.replace(/\KSHs.\s?|(,*)/g, '')} */}
                  {/*   formatter={(value: string) => */}
                  {/*   !Number.isNaN(parseFloat(value)) */}
                  {/*   ? `KSHs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") */}
                  {/*   : 'KSHs. '} */}
                  {/*   {...form.getInputProps("principal")} */}
                  {/*   required */}
                  {/* /> */}
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    mt="md"
                    type="number"
                    label="Enter Tenure"
                    placeholder="Enter Tenure ..."
                    {...form.getInputProps("tenure")}
                    disabled={form.values.memberId.length > 0 ? false : true}
                    required
                  />
                </Grid.Col>
              </Grid>
            </form>
          </Box>
          <Review />
        </Stepper.Step>
        <Stepper.Step
          label="Add a Guarantor"
          description="Add a Guarantor to Guarantee this Loan"
          allowStepSelect={active > 1}
        >
          <Box>
            <form>
              <Grid grow>
                <Grid.Col span={4}>
                  <Autocomplete
                    mt="md"
                    label="Enter Guarantor Names"
                    placeholder="Enter Guarantor Names ..."
                    /* limit={6} */ // Default 5
                    data={guarantor_data?.map((p) => p[0].label)}
                    {...guarantor_form.getInputProps("guarantorName")}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    mt="md"
                    label="Phone Number"
                    placeholder="Phone Number ..."
                    {...guarantor_form.getInputProps("guarantorPhone")}
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
                    {...guarantor_form.getInputProps("guarantorId")}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    mt="md"
                    label="Relationship"
                    placeholder="Relationship ..."
                    {...guarantor_form.getInputProps("guarantorRelationship")}
                    required
                  />
                </Grid.Col>
              </Grid>
            </form>
          </Box>
        </Stepper.Step>
        <Stepper.Step
          label="Add Collaterals"
          description="Lastly, Add Collaterals to Proceed."
          allowStepSelect={active > 2}
        >
          <Box>
            <Card shadow="sm" p="lg" radius="md" m="xl" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group position="apart">
                  <Text weight={700}>Add Collaterals</Text>
                  <Menu withinPortal position="bottom-end" shadow="sm">
                    <Menu.Target>
                      <ActionIcon>
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item icon={<IconFileZip size={14} />}>
                        Download zip
                      </Menu.Item>
                      <Menu.Item icon={<IconEye size={14} />}>
                        Preview all
                      </Menu.Item>
                      <Menu.Item icon={<IconTrash size={14} />} color="red">
                        Delete all
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Card.Section>
              {collaterals.length > 0 &&
                collaterals.map((collateral: Collaterals, index: number) => (
                  <Card.Section withBorder inheritPadding py="xs">
                    <Grid grow columns={12}>
                      <Grid.Col mt="md" span={1}>
                        <Text>{index + 1}</Text>
                      </Grid.Col>
                      <Grid.Col mt="md" span={5}>
                        <Text>{collateral.item}</Text>
                      </Grid.Col>
                      <Grid.Col mt="md" span={5}>
                        <Text>{collateral.value}</Text>
                      </Grid.Col>
                      <Grid.Col mt="md" span={1}>
                        <Tooltip color="red" label="Delete">
                          <ActionIcon
                            variant="light"
                            onClick={() => {
                              showNotification({
                                id: "collateral-delete-status",
                                color: "red",
                                title: "Deleting Collateral",
                                message: `Deleting ${collateral.item} worth KSHs. ${collateral.value} From Being Added to Collaterals ...`,
                                loading: true,
                                autoClose: 50000,
                              });
                              deleteCollateral(`${collateral.id}`);
                            }}
                          >
                            <IconTrash size={24} color="red" />
                          </ActionIcon>
                        </Tooltip>
                      </Grid.Col>
                    </Grid>
                  </Card.Section>
                ))}
              <Card.Section withBorder inheritPadding py="xs">
                <form>
                  <Grid grow columns={12}>
                    <Grid.Col span={5}>
                      <TextInput
                        mt="md"
                        label="Item Name"
                        placeholder="Item Name ..."
                        {...collateral_form.getInputProps("item")}
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={5}>
                      <TextInput
                        mt="md"
                        label="Item Value"
                        placeholder="Item Value ..."
                        {...collateral_form.getInputProps("value")}
                        required
                      />
                    </Grid.Col>
                    {collateral_form.values.item.length > 0 &&
                      collateral_form.values.value.length > 0 && (
                        <Grid.Col mt="md" span={2}>
                          <Group position="apart" mt="xl" m="md">
                            <Tooltip label="Add" color="teal">
                              <ActionIcon
                                variant="light"
                                onClick={() => {
                                  showNotification({
                                    id: "collateral-status",
                                    color: "teal",
                                    title: "Saving Collaterals",
                                    message: `Saving Collateral Information ...`,
                                    loading: true,
                                    autoClose: 50000,
                                  });
                                  handleCollaterals();
                                }}
                              >
                                <IconPlus color="teal" size={24} />
                              </ActionIcon>
                            </Tooltip>

                            <Tooltip color="red" label="Clear">
                              <ActionIcon
                                variant="light"
                                onClick={() => {
                                  collateral_form.setFieldValue("item", "");
                                  collateral_form.setFieldValue("value", "");
                                  showNotification({
                                    id: "collateral-status",
                                    color: "orange",
                                    title: "Removing Collateral",
                                    message: `Removed ${collateral_form.values.item} worth KSHs. ${collateral_form.values.value} From Being Added to Collaterals.`,
                                    icon: <IconCheck size={16} />,
                                    autoClose: 3000,
                                  });
                                }}
                              >
                                <IconMinus size={24} color="red" />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Grid.Col>
                      )}
                  </Grid>
                </form>
              </Card.Section>
            </Card>
          </Box>
        </Stepper.Step>
        <Stepper.Completed>
          <Text>Loan Maintained Successfully</Text>
        </Stepper.Completed>
      </Stepper>

      <Group position="center" mt="xl">
        {active === 0 ? null : (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        )}
        <Button
          onClick={() => {
            active === 2 ? setOpen(true) : nextStep();
          }}
        >
          {active === 2 ? "Preview" : "Next"}
        </Button>
      </Group>
      {preview()}
      <pre>{JSON.stringify(products, undefined, 2)}</pre>
    </Protected>
  );
};

export default Page;
