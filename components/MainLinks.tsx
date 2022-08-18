import React, { useState } from "react";
import {
  IconHome,
  IconAffiliate,
  IconUsers,
  IconBrandProducthunt,
  IconReport,
  IconCash,
  IconChevronRight,
  IconTag,
} from "@tabler/icons";
import {
  ThemeIcon,
  Button,
  Collapse,
  Box,
  NavLink,
  UnstyledButton,
  Group,
  Text,
} from "@mantine/core";
import { MainLinkProps } from "../models/interfaces";
import Link from "next/link";
import {
  BrowserRouter as Router,
  // NavLink,
  useNavigate,
} from "react-router-dom";

function MainLink({ icon, color, label, data, right }: MainLinkProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const sx: any = (theme: any) => ({
    display: "block",
    width: "100%",
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  });
  return (
    <>
      <NavLink
        label={label}
        icon={
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>
        }
        childrenOffset={30}
      >
        {data?.map((item: any, index: number) => (
          <>
            <Link
              // component={Link}
              // active={index === item.id}
              key={item.id}
              href={item.url}
              // label={item.name}
              // onClick={() => setActive(index)}
            >
              <NavLink
                // component={Link}
                active={index === item.id}
                // href={`${item.url}`}
                label={item.name}
                onClick={() => setActive(index)}
              />
            </Link>
          </>
        ))}
      </NavLink>
    </>
  );
}

const data = [
  {
    icon: <IconHome size={24} />,
    color: "blue",
    label: "Dashboard",
    data: [
      {
        id: 0,
        name: "Dashboard",
        url: "/",
      },
    ],
  },
  {
    icon: <IconUsers size={24} />,
    color: "orange",
    label: "Members",
    data: [
      {
        id: 1,
        name: "New Member",
        url: "/members/create-member/",
      },
      {
        id: 2,
        name: "All Members",
        url: "/members/",
      },
    ],
  },
  {
    icon: <IconAffiliate size={24} />,
    color: "green",
    label: "Groups",
    data: [
      {
        id: 3,
        name: "New Group",
        url: "/groups/create-group/",
      },
      {
        id: 4,
        name: "All Groups",
        url: "/groups/",
      },
    ],
  },
  {
    icon: <IconTag size={24} />,
    color: "violet",
    label: "Products",
    data: [
      {
        id: 5,
        name: "New Product",
        url: "/products/create-product/",
      },
      {
        id: 6,
        name: "All Products",
        url: "/products/",
      },
    ],
  },
  {
    icon: <IconCash size={24} />,
    color: "teal",
    label: "Loans",
    data: [
      {
        id: 7,
        name: "New Loan",
        url: "/loans/create-loan/",
      },
      {
        id: 8,
        name: "Approvals",
        url: "/loans/approvals/",
      },
      {
        id: 9,
        name: "Disbursments",
        url: "/loans/disbursements/",
      },
      {
        id: 10,
        name: "Payments",
        url: "/loans/payments/",
      },
      {
        id: 11,
        name: "All Loans",
        url: "/loans/",
      },
    ],
  },
  {
    icon: <IconReport size={24} />,
    color: "yellow",
    label: "Reports",
    right: <IconChevronRight size={16} stroke={1.5} />,
    data: [
      {
        id: 12,
        name: "PAR Report",
        url: "/reports/par-report/",
      },
      {
        id: 13,
        name: "Schedules",
        url: "/reports/schedule-report/",
      },
    ],
  },
];

export function MainLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}
