import React, { useCallback, useEffect, useState } from "react";
import { Selection } from "../../../../types";
import { Protected, TitleText } from "../../../components";
import { NextPage } from "next";
import { z } from "zod";
import { v4 as uuidV4 } from "uuid";
import { useForm, zodResolver } from "@mantine/form";
import {
  Group,
  Stepper,
  Button,
  Text,
  TextInput,
  Card,
  Box,
  Grid,
  Select,
  Menu,
  ActionIcon,
  Switch,
  Autocomplete,
  Tooltip,
  Modal,
  LoadingOverlay,
} from "@mantine/core";
import { useRouter } from "next/router";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
  IconCalendar,
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
import { trpc } from "../../../utils/trpc";
import type { Collateral, Guarantor, Member } from "@prisma/client";
import { useSession } from "next-auth/react";
import { DatePicker } from "@mantine/dates";
import dayjs from "dayjs";

const loan_schema = z.object({
  startDate: z.date({ required_error: "Select First Installment Date" }),
  member: z.string().min(2, { message: "User Name Missing" }),
  product: z.string().min(2, { message: "Product is Missing" }),
  principal: z.string().min(2, { message: "Principal Amount is Missing" }),
  tenure: z.string().min(1, { message: "Tenure is Missing" }),
});

const guarantor_schema = z.object({
  guarantorName: z.string().min(2, { message: "Guarantor Name is Missing" }),
  guarantorPhone: z
    .string()
    .min(2, { message: "Guarantor Phone Number is Missing" }),
  guarantorID: z.string().min(2, { message: "Guarantor ID is Missing" }),
  guarantorRelationship: z
    .string()
    .min(2, { message: "Guarantor Relationship is Missing" }),
});

const collateral_schema = z.object({
  item: z.string().min(2, { message: "Item is Missing" }),
  value: z.string().min(2, { message: "Item Value is Missing" }),
});

const CreateLoan = ({
  email,
  status,
  member_id,
  mid,
}: {
  email: string;
  member_id: string;
  status: string;
  mid: string;
}) => {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [collateralId, setCollateralId] = useState("");
  const [startsOn, setStartsOn] = useState("");
  const [id, setId] = useState("");
  const [loanRef, setLoanRef] = useState("");
  const [sundays, setSundays] = useState(0);
  const [changeGuarantor, setChangeGuarantor] = useState(false);

  const [payoffAmount, setPayoffAmount] = useState(0);

  const [checked, setChecked] = useState(false);
  const [payoff, setPayoff] = useState(false);

  const [memberCode, setMemberCode] = useState("");
  const [intRate, setIntRate] = useState(0);
  const [penRate, setPenRate] = useState(0);
  const [cycle, setCycle] = useState("");
  const [proRate, setProRate] = useState(0);
  const [proName, setProName] = useState("");
  const [grace, setGrace] = useState(0);
  const [maxTenure, setMaxTenure] = useState(0);
  const [maxRange, setMaxRange] = useState(0);
  const [minRange, setMinRange] = useState(0);

  const router = useRouter();
  const [user, setUser] = useState({
    id: "",
    role: "",
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    state: "",
  });

  const user_data = trpc.users.user.useQuery({
    email: `${email}`,
  }) ?? [];

  useEffect(() => {
    let subscribe = true;

    if (subscribe) {
      setUser({
        id: `${user_data?.data?.id}`,
        role: `${user_data?.data?.role}`,
        username: `${user_data?.data?.username}`,
        firstname: `${user_data?.data?.firstName}`,
        lastname: `${user_data?.data?.lastName}`,
        email: `${user_data?.data?.email}`,
        state: `${user_data?.data?.state}`,
      });
    }
    return () => {
      subscribe = false;
    };
  }, [
    user_data?.data?.id,
    user_data?.data?.role,
    user_data?.data?.username,
    user_data?.data?.firstName,
    user_data?.data?.lastName,
    user_data?.data?.email,
    user_data?.data?.state,
  ]);

  const form = useForm({
    validate: zodResolver(loan_schema),
    initialValues: {
      member: "",
      memberId: `${id}`,
      product: "",
      productId: "",
      productName: "",
      principal: "",
      cycle: "",
      startDate: `${startsOn}`,
      loanRef: "",
      tenure: "",
      interest: "",
      installment: "",
      penalty: "",
      processingFee: "",
      payoff: "",
      sundays: "",
      grace: "",
      guarantorId: "",
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
      guarantorID: "",
    },
  });

  const collateral_form = useForm({
    validate: zodResolver(collateral_schema),
    initialValues: {
      item: "",
      value: "",
    },
  });

  /* FIXME: Returning undefined */
  const mem = trpc.members.member.useQuery({ id }) ?? [];

  const member = mem?.data

  const utils = trpc.useContext();

  const loanLen = member && member?.loans?.length + 1 || 0;

  const { data: members } = trpc.members.members.useQuery();

  const { data: products, status: products_status } =
    trpc.products.products.useQuery();

  const product = trpc.products.product.useQuery({
    id: form.values.product,
  }) ?? [];

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
    try {
      active === 0 &&
        setTimeout(() => {
          updateNotification({
            id: "maintainance-status",
            color: "teal",
            title: "Step One Completed",
            message: `Next Step is Adding a Loan Guarantor ...`,
            icon: <IconCheck size={16} />,
            autoClose: 8000,
          });
        });
      active === 1 &&
        setTimeout(() => {
          updateNotification({
            id: "maintainance-status",
            color: "teal",
            title: "Step Two Completed",
            message: `Next Step is Adding Collaterals ...`,
            icon: <IconCheck size={16} />,
            autoClose: 8000,
          });
        });
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
    form.setFieldValue("principal", `${form.values.principal}`);
    form.setFieldValue("memberId", `${id}`);
    form.validate();
    if (
      form.values.tenure &&
      form.values.principal &&
      form.values.member &&
      form.values.grace &&
      form.values.installment &&
      form.values.memberId &&
      form.values.productId &&
      form.values.payoff &&
      form.values.penalty &&
      form.values.processingFee &&
      form.values.product &&
      form.values.sundays &&
      form.values.interest &&
      form.values.maintained
    ) {
      if (active === 1) guarantor_form.validate();
      if (
        guarantor_form.values.guarantorPhone &&
        guarantor_form.values.guarantorRelationship &&
        guarantor_form.values.guarantorName &&
        guarantor_form.values.guarantorID
      ) {
        return setActive((current) => (current < 3 ? current + 1 : current));
      }
      if (active === 1)
        return setTimeout(() => {
          updateNotification({
            id: "maintainance-status",
            color: "red",
            title: "Step Two Missing Fields!",
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
        title: "Step One Missing Fields!",
        message: `Please Fill in All the Missing Fields`,
        icon: <IconX size={16} />,
        autoClose: 5000,
      });
    });
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const calcuDates = (cycle: string, tenure: number) => {
    let counter = 0;
    let term = tenure;
    const sundate = new Date();
    let total_sundays = 0;

    while (counter < term + 0) {
      sundate.setDate(sundate.getDate() + 1);
      let day = sundate.getDay();
      if (day === 0) {
        total_sundays += 1;
      }
      counter++;
    }

    if (!checked) setSundays(total_sundays);
    if (checked) setSundays(0);

    setLoanRef(
      loanLen > 9
        ? loanLen > 99
          ? memberCode + `-${loanLen}`
          : memberCode + `-0${loanLen}`
        : memberCode + `-00${loanLen}`
    );

  };

  const fillForm = () => {
    form.setFieldValue("memberId", `${id}`);
    form.setFieldValue("member", `${member?.firstName} ${member?.lastName}`);
    form.setFieldValue("productId", `${product?.data?.id}`);
    form.setFieldValue("productName", `${proName}`);
    form.setFieldValue("guarantorId", uuidV4().toString());
    form.setFieldValue("payoff", `${payoffAmount}`);
    form.setFieldValue("sundays", `${sundays}`);
    form.setFieldValue("grace", `${grace}`);
    form.setFieldValue("loanRef", `${loanRef}`);
    form.setFieldValue("cycle", `${cycle}`);
    form.setFieldValue("maintained", true);
    form.setFieldValue("approved", false);
    form.setFieldValue("disbursed", false);
    form.setFieldValue(
      "interest",
      `${cycle.toLowerCase() === "daily"
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
      `${cycle.toLowerCase() === "daily"
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

    if (form.values.tenure.length > 0 && +form.values.tenure > maxTenure) {
      form.setFieldValue("tenure", "");
      form.setFieldError(
        "tenure",
        `Principal Exceeds Maximum Tenure Range of ${maxTenure} ${cycle.toLowerCase() === "daily"
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
        message: `Principal Exceeds Maximum Tenure Range of ${maxTenure} ${cycle.toLowerCase() === "daily"
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
  };

  useEffect(() => {
    let subscribe = true;

    if (subscribe) {
      if (mid.length > 10) setId(mid);
      if (mid.length < 11) setId(`${member_id}`);
      form.setFieldValue("memberId", `${id}`);

      if (member) {
        setMemberCode(`${member?.memberId}`);
      }
      if (product?.data) {
        setIntRate(+product?.data?.interestRate);
        setPenRate(+product?.data?.penaltyRate);
        setCycle(`${product?.data?.repaymentCycle}`);
        setProRate(+product?.data?.processingFee);
        setProName(`${product?.data?.productName}`);
        setGrace(+product?.data?.gracePeriod);
        setMaxTenure(+product?.data?.maximumTenure);
        setMaxRange(+product?.data?.maximumRange);
        setMinRange(+product?.data?.minimumRange);
      }
      fillForm();
      calcuDates(cycle.toLowerCase(), +form.values.tenure);

      const date = new Date();
      date.setDate(
        cycle === "MONTHLY"
          ? date.getDate() + 30
          : cycle === "WEEKLY"
            ? date.getDate() + 7
            : date.getDate() + 2
      );
      date.setDate(date.getDay() === 0 ? date.getDate() + 1 : date.getDate() + 0);

      const change = !form.values.startDate && date || new Date(form.values.startDate)

      const local_date = change.toLocaleDateString()

      const dash_date =
        local_date.split("/")[0] + "-" +
        local_date.split("/")[1] + "-" +
        local_date.split("/")[2]

      setStartsOn(dash_date)
    }
    return () => {
      subscribe = false;
    };
  }, [
    member_id,
    member?.firstName,
    member?.lastName,
    product?.data?.interestRate,
    product?.data?.penaltyRate,
    product?.data?.repaymentCycle,
    product?.data?.processingFee,
    product?.data?.productName,
    product?.data?.gracePeriod,
    product?.data?.maximumTenure,
    product?.data?.minimumRange,
    product?.data?.maximumRange,
    router,
    mid,
    id,
    checked,
    startsOn,
    cycle,
    loanLen,
    memberCode,
    sundays,
    payoffAmount,
    loanRef,
    form.values.startDate,
    form.values.tenure,
    form.values.product,
  ]);

  const maintain_member = trpc.members.maintain_member.useMutation();

  const maintain_guarantor = trpc.members.maintain_guarantor.useMutation();

  const maintain_loan = trpc.members.maintain_loan.useMutation({
    onSuccess: async () => {
      showNotification({
        id: "maintained-status",
        color: "teal",
        title: `Maintained Successfully`,
        message: `Loan was Successfully Maintained.`,
        icon: <IconCheck size={16} />,
        autoClose: 8000,
      });
    },
  });

  const createLoan = useCallback(() => {
    try {
      setOpen(false);
      if (
        (user?.id &&
          form.values.memberId &&
          form.values.tenure &&
          form.values.principal &&
          form.values.grace &&
          form.values.member &&
          form.values.installment &&
          form.values.productId &&
          form.values.payoff &&
          form.values.penalty &&
          form.values.processingFee &&
          form.values.sundays &&
          form.values.interest &&
          form.values.guarantorId &&
          form.values.productName &&
          form.values.cycle &&
          startsOn &&
          form.values.loanRef &&
          guarantor_form.values.guarantorPhone &&
          guarantor_form.values.guarantorRelationship &&
          guarantor_form.values.guarantorName &&
          guarantor_form.values.guarantorID &&
          form.values.maintained) ||
        form.values.approved ||
        form.values.disbursed
      ) {
        maintain_member.mutate({
          id: id,
          maintained: form.values.maintained,
          updaterId: `${user?.id}`,
        });

        maintain_guarantor.mutate({
          id: form.values.guarantorId,
          guarantorName: guarantor_form.values.guarantorName,
          guarantorPhone: guarantor_form.values.guarantorPhone,
          guarantorRelationship: guarantor_form.values.guarantorRelationship,
          guarantorID: guarantor_form.values.guarantorID,
          memberId: form.values.memberId,
          updaterId: `${user?.id}`,
        });

        maintain_loan.mutate({
          guarantorId: form.values.guarantorId,
          memberId: form.values.memberId,
          tenure: form.values.tenure,
          principal: form.values.principal,
          maintained: form.values.maintained,
          approved: form.values.approved,
          disbursed: form.values.disbursed,
          grace: form.values.grace,
          installment: form.values.installment,
          productId: form.values.product,
          payoff: form.values.payoff,
          penalty: form.values.penalty,
          processingFee: form.values.processingFee,
          sundays: form.values.sundays,
          memberName: form.values.member,
          productName: form.values.productName,
          interest: form.values.interest,
          cycle: form.values.cycle,
          startDate: startsOn,
          loanRef: form.values.loanRef,
          maintainerId: `${user?.id}`,
        });

        form.setFieldValue("item", "");
        form.setFieldValue("value", "");
        form.setFieldValue("guarantorId", "");
        form.setFieldValue("memberId", "");
        form.setFieldValue("tenure", "");
        form.setFieldValue("principal", "");
        form.setFieldValue("maintained", false);
        form.setFieldValue("approved", false);
        form.setFieldValue("disbursed", false);
        form.setFieldValue("grace", "");
        form.setFieldValue("installment", "");
        form.setFieldValue("productId", "");
        form.setFieldValue("payoff", "");
        form.setFieldValue("penalty", "");
        form.setFieldValue("processingFee", "");
        form.setFieldValue("sundays", "");
        form.setFieldValue("member", "");
        form.setFieldValue("productName", "");
        form.setFieldValue("interest", "");
        form.setFieldValue("loanRef", "");
        form.setFieldValue("startDate", "");
        form.setFieldValue("cycle", "");

        guarantor_form.setFieldValue("guarantorName", "");
        guarantor_form.setFieldValue("guarantorPhone", "");
        guarantor_form.setFieldValue("guarantorRelationship", "");
        guarantor_form.setFieldValue("guarantorID", "");

        setActive(0);
        setOpen(false);
        setDeleteModal(false);
        setCollateralId("");
        setStartsOn("");
        setLoanRef("");
        setSundays(0);
        setChangeGuarantor(false);
        setPayoffAmount(0);

        if (maintain_loan.status === "error") {
          return updateNotification({
            id: "submit-status",
            color: "orange",
            title: `Error Maintaining Loan`,
            message: `Loan Maintenance Error : ${maintain_loan.error}.`,
            icon: <IconX size={16} />,
            autoClose: 8000,
          });
        }
        if (maintain_member.status === "error") {
          return updateNotification({
            id: "submit-status",
            color: "orange",
            title: `Error Updating Member`,
            message: `Member Updating Error : ${maintain_member.error}.`,
            icon: <IconX size={16} />,
            autoClose: 8000,
          });
        }
        if (maintain_guarantor.status === "error") {
          return updateNotification({
            id: "submit-status",
            color: "orange",
            title: `Error Maintaining Guarantor`,
            message: `Guarantor Maintenance Error : ${maintain_guarantor.error}.`,
            icon: <IconX size={16} />,
            autoClose: 8000,
          });
        }
        updateNotification({
          id: "submit-status",
          color: "teal",
          title: `${maintain_loan.data?.memberName}`,
          message: `Loan Was Successfully Maintained and is Guaranteed by ${maintain_guarantor.data?.guarantorName}.`,
          icon: <IconCheck size={16} />,
          autoClose: 8000,
        });

        return router.push("/loans/approvals");
      }
      console.table({
        id: id,
        maintained: form.values.maintained,
      });
      console.table({
        id: form.values.guarantorId,
        guarantorName: guarantor_form.values.guarantorName,
        guarantorPhone: guarantor_form.values.guarantorPhone,
        guarantorRelationship: guarantor_form.values.guarantorRelationship,
        guarantorID: guarantor_form.values.guarantorID,
        memberId: form.values.memberId,
      });

      console.table({
        guarantorId: form.values.guarantorId,
        memberId: form.values.memberId,
        tenure: form.values.tenure,
        principal: form.values.principal,
        maintained: form.values.maintained,
        approved: form.values.approved,
        disbursed: form.values.disbursed,
        grace: form.values.grace,
        installment: form.values.installment,
        productId: form.values.product,
        payoff: form.values.payoff,
        penalty: form.values.penalty,
        processingFee: form.values.processingFee,
        sundays: form.values.sundays,
        memberName: form.values.member,
        productName: form.values.productName,
        interest: form.values.interest,
        cycle: form.values.cycle,
        startDate: startsOn,
        loanRef: form.values.loanRef,
      });
      return updateNotification({
        id: "submit-status",
        title: "Something Went Wrong",
        message: `Please Make Sure all Fields are Filled Before Submission Then Try Adding Again!`,
        icon: <IconX size={16} />,
        color: "red",
        autoClose: 4000,
      });
    } catch (error) {
      return updateNotification({
        id: "submit-status",
        title: "Maintenance Error!",
        message: `Please Try Maintaining Again!`,
        icon: <IconX size={16} />,
        color: "red",
        autoClose: 4000,
      });
    }
  }, [
    form,
    user,
    guarantor_form,
    id,
    maintain_guarantor,
    maintain_loan,
    maintain_member,
    router,
  ]);

  const maintain_collateral = trpc.members.maintain_collateral.useMutation({
    onSuccess: async (input) => {
      collateral_form.setFieldValue("item", "");
      collateral_form.setFieldValue("value", "");
      return input?.id && await utils.members.collateral.invalidate({ id: input?.id });
    },
  });

  const collaterals = member?.collaterals
  const guarantor = member?.guarantor


  const delete_collateral = trpc.members.collateral_delete.useMutation({
    onSuccess: async () => {
      updateNotification({
        id: "collateral-delete-status",
        color: "red",
        title: "Collateral Deletion",
        message: "Collateral Successfully Deleted",
        icon: <IconCheck size={16} />,
        autoClose: 5000,
      });
    },
  });

  const createCollateral = useCallback(() => {
    try {
      if (
        user &&
        form.values.memberId &&
        collateral_form.values.item &&
        collateral_form.values.value
      ) {
        maintain_collateral.mutate({
          memberId: form.values.memberId,
          item: collateral_form.values.item.toUpperCase(),
          value: collateral_form.values.value,
          updaterId: `${user?.id}`,
        });

        if (maintain_collateral.status === "error") {
          collateral_form.setFieldValue("item", "");
          collateral_form.setFieldValue("value", "");
          return updateNotification({
            id: "collateral-status",
            title: "Collateral Error!",
            message: `Please Try Adding Again!`,
            icon: <IconX size={16} />,
            color: "red",
            autoClose: 4000,
          });
        }
        updateNotification({
          id: "collateral-status",
          color: "teal",
          title: "Collaterals",
          message: `${collateral_form.values.item} @ ${collateral_form.values.value} Added Successfully as Collateral!`,
          icon: <IconCheck size={16} />,
          autoClose: 8000,
        });
      }
      if (
        !form.values.memberId.length ||
        !collateral_form.values.item ||
        !collateral_form.values.value
      ) {
        collateral_form.setFieldValue("item", "");
        collateral_form.setFieldValue("value", "");
        return updateNotification({
          id: "collateral-status",
          title: "Missing Fields",
          message: `Please Make Sure all Fields are Filled Before Submission Then Try Adding Again!`,
          icon: <IconX size={16} />,
          color: "red",
          autoClose: 4000,
        });
      }
    } catch (error) {
      return updateNotification({
        id: "collateral-status",
        title: "Collateral Error!",
        message: `${error}. Please Check Your Internet & Try Adding Again!`,
        icon: <IconX size={16} />,
        color: "red",
        autoClose: 4000,
      });
    }
  }, [collateral_form, form.values.memberId, maintain_collateral, user?.id]);

  const deleteCollateral = useCallback(() => {
    try {
      if (collateralId) {
        delete_collateral.mutate({
          id: collateralId,
        });
        updateNotification({
          id: "collateral-delete-status",
          color: "red",
          title: "Collateral Deletion",
          message: `${delete_collateral.data?.count} Collateral Successfully Deleted!`,
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
      }
    } catch (error) {
      updateNotification({
        id: "collateral-delete-status",
        color: "red",
        title: "Collateral Deletion Error",
        message: "Collateral Unsuccessfully Deleted. Please Try Again.",
        icon: <IconX size={16} />,
        autoClose: 5000,
      });
    }
  }, [collateralId, delete_collateral]);

  const roundOff = (value: number) => {
    const a = Number(value.toString().split(".")[0])
    const b = Number(value.toString().split(".")[1])
    return b > 0 && a + 1 || a
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

    return roundOff((principalAmount + principal) / (tenure - sundays));
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

  let select_product: Array<Selection> = []
  let select_guarantor: Array<Selection> = []

  products?.map((_) => [
    select_product.push({
      key: _.id, value: `${_.id}`, label: `${_.productName}`
    })
  ]);

  members?.map((_) => [
    select_guarantor.push({
      key: _.id, value: `${_.id}`, label: `${_.firstName} ${_.lastName}`
    })
  ]);
  const findGuarantor = (name: string) => {
    return members?.find((e) => {
      if (e.firstName + " " + e.lastName === name) {
        guarantor_form.setFieldValue("guarantorPhone", `${e.phoneNumber}`);
        guarantor_form.setFieldValue("guarantorID", `${e.idPass}`);
      }
    });
  };


  const handleGuarantor = () => {
    if (
      guarantor_form.values.guarantorName !== "" &&
      guarantor_form.values.guarantorName === form.values.member
    ) {
      guarantor_form.setFieldError(
        "guarantorName",
        `${form.values.member} Cannot Self-Guarantee`
      );
      guarantor_form.setFieldValue("guarantorPhone", ``);
      guarantor_form.setFieldValue("guarantorID", ``);
      showNotification({
        id: "guarantor-status",
        color: "red",
        title: "Guarantor Info",
        message: `${guarantor_form.values.guarantorName} Cannot Self-Guarantee a Loan ...`,
        icon: <IconInfoCircle size={24} />,
        autoClose: 5000,
      });
      guarantor_form.setFieldValue("guarantorName", ``);
      return guarantor_form.setFieldError(
        "guarantorName",
        `${guarantor_form.values.guarantorName} Cannot Self-Guarantee a Loan ...`
      );
    }

    if (
      guarantor_form.values.guarantorName !== "" &&
      guarantor_form.values.guarantorName !== form.values.member
    ) {
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

    if (guarantor && !changeGuarantor) {
      guarantor?.map((_: Guarantor) => {
        findGuarantor(_.guarantorName);
        guarantor_form.setFieldValue(
          "guarantorPhone",
          `${_.guarantorPhone}`
        );
        guarantor_form.setFieldValue("guarantorID", `${_.guarantorID}`);
        guarantor_form.setFieldValue(
          "guarantorRelationship",
          `${_.guarantorRelationship}`
        );
        guarantor_form.setFieldValue(
          "guarantorName",
          `${_.guarantorName}`
        );
      });
    }
  };

  useEffect(() => {
    let subscribe = true;
    if (subscribe) {
      handleGuarantor();
    }
    return () => {
      subscribe = false;
    };
  }, [
    guarantor_form.values.guarantorName,
    guarantor_form.values.guarantorID,
    guarantor_form.values.guarantorPhone,
    form.values.principal,
    form.values.tenure,
    form.values.member,
    changeGuarantor,
  ]);

  const Review = () => {
    return (
      <>
        <Card
          style={{
            position: "relative",
          }}
          shadow="sm"
          p="lg"
          radius="md"
          m="xl"
          withBorder
        >
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <TitleText title="Review" />
              <Text weight={500}>
                {loanRef.startsWith("-") ? null : loanRef}
              </Text>
            </Group>
          </Card.Section>
          <LoadingOverlay
            visible={product?.status === "loading"}
            overlayBlur={2}
          />
          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>
              Skipped Sundays. (
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
          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>First Installment</Text>
            <Text weight={500}>{startsOn}</Text>
          </Group>
        </Card>
      </>
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
                <TitleText title={`${form.values.member}`} />
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
                  <Text>{product.data?.productName}</Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Skipped Sundays</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>
                    {form.values.sundays} {sundays === 1 ? "Sunday" : "Sundays"}
                  </Text>
                </Grid.Col>
              </Grid>
              {payoff && (
                <Grid grow>
                  <Grid.Col mt="xs" span={4}>
                    <Text weight={500}>Payoff Amount</Text>
                  </Grid.Col>
                  <Grid.Col mt="xs" span={4}>
                    <Text>
                      {`KSHs. ${form.values.payoff}.00`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      )}
                    </Text>
                  </Grid.Col>
                </Grid>
              )}
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Loan Tenure</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>
                    {form.values.tenure}{" "}
                    {cycle.toLowerCase() === "daily"
                      ? "Days"
                      : cycle.toLowerCase() === "weeks"
                        ? "Weeks"
                        : "Months"}
                  </Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Principal Amount</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>
                    {`KSHs. ${form.values.principal}.00`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Installment Amount</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>
                    {`KSHs. ${form.values.installment}.00`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Interest Amount</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>
                    {`KSHs. ${form.values.interest}.00`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Penalty Amount</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>
                    {`KSHs. ${form.values.penalty}.00`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Processing Fee</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>
                    {`KSHs. ${form.values.processingFee}.00`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </Text>
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
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>First Installment</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>{startsOn}</Text>
                </Grid.Col>
              </Grid>
              <Card.Section withBorder inheritPadding mt="md" py="xs">
                <Group position="apart">
                  <TitleText title={`Guarantor`} />
                </Group>
              </Card.Section>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Name</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{guarantor_form.values.guarantorName}</Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Phone</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{guarantor_form.values.guarantorPhone}</Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>ID Number</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{guarantor_form.values.guarantorID}</Text>
                </Grid.Col>
              </Grid>
              <Grid grow>
                <Grid.Col mt="xs" span={4}>
                  <Text weight={500}>Relationship</Text>
                </Grid.Col>
                <Grid.Col mt="xs" span={4}>
                  <Text>{guarantor_form.values.guarantorRelationship}</Text>
                </Grid.Col>
              </Grid>
              <Card.Section withBorder inheritPadding mt="md" py="xs">
                <Group position="apart">
                  <TitleText title={`Collaterals`} />
                </Group>
              </Card.Section>
              {collaterals &&
                collaterals?.map((collateral: Collateral) => (
                  <Grid key={collateral.id} grow>
                    <Grid.Col mt="md" span={4}>
                      <Text>{collateral.item}</Text>
                    </Grid.Col>
                    <Grid.Col mt="md" span={4}>
                      <Text>
                        {`KSHs. ${collateral.value}.00`.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ","
                        )}
                      </Text>
                    </Grid.Col>
                  </Grid>
                ))}
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
                      id: "submit-status",
                      color: "teal",
                      title: `${form.values.member}`,
                      message: `Maintaining Loan For ${form.values.member} ...`,
                      loading: true,
                      autoClose: 50000,
                    });
                    createLoan();
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

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <LoadingOverlay overlayBlur={2} visible={mem.status === "loading"} />
      <Protected>
        <Stepper
          mt="lg"
          active={active}
          onStepClick={setActive}
          breakpoint="sm"
        >
          <Stepper.Step
            label="Loan Maintenance"
            description="Select a Member & a Product."
            loading={products_status === "loading"}
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
                      disabled={mem.status === "success" ? false : true}
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Select
                      mt="md"
                      label="Select Product"
                      placeholder="Select Product ..."
                      data={select_product}
                      {...form.getInputProps("product")}
                      disabled={products_status === "success" ? false : true}
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
                      disabled={product?.status === "success" ? false : true}
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      mt="md"
                      type="number"
                      label={`Enter Tenure : ${form.values.tenure} ${cycle.toLowerCase() === "daily"
                        ? +form.values.tenure === 1
                          ? "Day"
                          : "Days"
                        : cycle.toLowerCase() === "weekly"
                          ? +form.values.tenure === 1
                            ? "Week"
                            : "Weeks"
                          : +form.values.tenure === 1
                            ? "Month"
                            : "Months"
                        }`}
                      placeholder="Enter Tenure ..."
                      {...form.getInputProps("tenure")}
                      disabled={product?.status === "success" ? false : true}
                      required
                    />
                  </Grid.Col>
                  {form.values.tenure && (
                    <Grid.Col span={4}>
                      <DatePicker
                        mt="md"
                        label="First Installment Date"
                        placeholder={startsOn}
                        defaultValue={startsOn}
                        icon={<IconCalendar size={16} />}
                        dropdownType="modal"
                        firstDayOfWeek="sunday"
                        /* minDate={dayjs(new Date()).toDate()} */
                        inputFormat="DD-MM-YYYY"
                        {...form.getInputProps("startDate")}
                        required
                      />
                    </Grid.Col>
                  )}
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
                      data={select_guarantor.map((m) => m.label)}
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
                      {...guarantor_form.getInputProps("guarantorID")}
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
                    <TitleText title={`Add Collaterals`} />
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
                {collaterals &&
                  collaterals?.map(
                    (collateral: Collateral, index: number) => (
                      <div key={collateral.id}>
                        <Card.Section withBorder inheritPadding py="xs">
                          <Grid grow columns={12}>
                            <Grid.Col mt="md" span={1}>
                              <Text>{index + 1}</Text>
                            </Grid.Col>
                            <Grid.Col mt="md" span={5}>
                              <Text>{collateral.item}</Text>
                            </Grid.Col>
                            <Grid.Col mt="md" span={5}>
                              <Text>
                                {`KSHs. ${collateral.value}.00`.replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ","
                                )}
                              </Text>
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
                                      disallowClose: true,
                                      autoClose: false,
                                      loading: true,
                                    });
                                    setDeleteModal(true);
                                    setCollateralId(`${collateral.id}`);
                                  }}
                                >
                                  <IconTrash size={24} color="red" />
                                </ActionIcon>
                              </Tooltip>
                            </Grid.Col>
                          </Grid>
                        </Card.Section>
                        <Modal
                          opened={deleteModal}
                          onClose={() => {
                            setDeleteModal(false);
                            deleteModal &&
                              setTimeout(() => {
                                updateNotification({
                                  id: "collateral-delete-status",
                                  color: "teal",
                                  title: "Collateral Deletion",
                                  message: `${collateral.item} Was not Deleted From Collaterals.`,
                                  icon: <IconCheck size={16} />,
                                  autoClose: 8000,
                                });
                              });
                          }}
                          title={`Delete Collateral`}
                        >
                          <Card
                            shadow="sm"
                            p="lg"
                            radius="md"
                            m="xl"
                            withBorder
                          >
                            <Card.Section withBorder inheritPadding py="xs">
                              <Group position="apart">
                                <TitleText title={`${collateral.item}`} />
                                <Text>
                                  {`KSHs. ${collateral.value}.00`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )}
                                </Text>
                              </Group>
                            </Card.Section>
                            <Card.Section withBorder inheritPadding py="xs">
                              <Text>
                                Would You Wish to Proceed and delete{" "}
                                {collateral.item} worth{" "}
                                {`KSHs. ${collateral.value}.00`.replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ","
                                )}{" "}
                                from Collaterals
                              </Text>
                            </Card.Section>
                            <Card.Section withBorder inheritPadding py="xs">
                              <Group mt="xl">
                                <Button
                                  variant="light"
                                  color="red"
                                  fullWidth
                                  mt="md"
                                  radius="md"
                                  onClick={() => {
                                    setDeleteModal(false);
                                    deleteCollateral();
                                  }}
                                >
                                  Proceed
                                </Button>
                              </Group>
                            </Card.Section>
                          </Card>
                        </Modal>
                      </div>
                    )
                  )}
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
                                    createCollateral();
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
          {active === 1 && (
            <Button
              variant="light"
              color="teal"
              onClick={() => {
                setChangeGuarantor(true);
                guarantor_form.setFieldValue("guarantorPhone", ``);
                guarantor_form.setFieldValue("guarantorID", ``);
                guarantor_form.setFieldValue("guarantorRelationship", ``);
                guarantor_form.setFieldValue("guarantorName", ``);
              }}
            >
              Change Guarantor
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
      </Protected>
    </div>
  );
};

const Page: NextPage = () => {
  const [firstname, setFirstname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [lastname, setLastname] = useState("");
  const [phonenumber, setPhonenumber] = useState("");

  const { status, data } = useSession();
  const router = useRouter();
  const mid = router.query.create as string;

  const member_search = trpc.transactions.transaction.useQuery({
    id: mid.length === 10 ? mid : "",
  }) ?? [];

  if (member_search?.data) {
    setFirstname(member_search?.data?.firstName);
    setMiddlename(member_search?.data?.middleName);
    setLastname(member_search?.data?.lastName);
    setPhonenumber(member_search?.data?.msisdn);
  }

  const member_info = trpc.members.search.useQuery({
    firstName: firstname,
    lastName: lastname,
    phoneNumber: phonenumber,
  }) ?? [];

  let member_id = ""

  if (member_info?.data) {
    member_id = member_info?.data?.id
  }


  const email = `${data?.user?.email}`;
  const check = email.split("@")[1];

  return (
    <Protected>
      {check && (
        <CreateLoan
          email={email}
          status={status}
          member_id={member_id}
          mid={mid}
        />
      )}
    </Protected>
  );
};

export default Page;
