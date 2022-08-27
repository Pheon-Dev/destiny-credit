import React, { useEffect, useState } from "react";
import {
  IconHome,
  IconUsers,
  IconReport,
  IconCash,
  IconTag,
  IconBrandAsana,
  IconApps,
} from "@tabler/icons";
import { Box, NavLink } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

const members_data = [
  {
    id: 0,
    name: "New Member",
    url: "/members/create-member/",
  },
  {
    id: 1,
    name: "All Members",
    url: "/members/",
  },
];
const groups_data = [
  {
    id: 0,
    name: "New Group",
    url: "/groups/create-group/",
  },
  {
    id: 1,
    name: "All Groups",
    url: "/groups/",
  },
];
const products_data = [
  {
    id: 0,
    name: "New Product",
    url: "/products/create-product/",
  },
  {
    id: 1,
    name: "All Products",
    url: "/products/",
  },
];
const loans_data = [
  {
    id: 0,
    name: "New Loan",
    url: "/loans/create-loan/",
  },
  {
    id: 1,
    name: "Approvals",
    url: "/loans/approvals/",
  },
  {
    id: 2,
    name: "Disbursments",
    url: "/loans/disbursements/",
  },
  {
    id: 3,
    name: "Payments",
    url: "/loans/payments/",
  },
  {
    id: 4,
    name: "All Loans",
    url: "/loans/",
  },
];
const apps_data = [
  {
    id: 0,
    name: "Profit & Loss",
    url: "/apps/expenses/",
  },
  // {
  //   id: 1,
  //   name: "Schedules",
  //   url: "/reports/schedule-report/",
  // },
];
const reports_data = [
  {
    id: 0,
    name: "PAR Report",
    url: "/reports/par-report/",
  },
  {
    id: 1,
    name: "Schedules",
    url: "/reports/schedule-report/",
  },
];

export function MainLinks() {
  const [membersActive, setMembersActive] = useState(9);
  const [groupsActive, setGroupsActive] = useState(9);
  const [productsActive, setProductsActive] = useState(9);
  const [loansActive, setLoansActive] = useState(9);
  const [reportsActive, setReportsActive] = useState(9);
  const [dashboardActive, setDashboardActive] = useState(false);

  return (
    <Box>
      <NavLink
        styles={{
          root: {
            borderRadius: 6,
            margin: 2,
          },
        }}
        label="Home"
        icon={<IconHome size={16} stroke={1.5} />}
        childrenOffset={24}
      >
        <Link href="/">
          <NavLink
            styles={{
              root: {
                borderRadius: 6,
                margin: 2,
              },
            }}
            label="Dashboard"
            active={dashboardActive}
            onClick={() => {
              setMembersActive(8);
              setLoansActive(8);
              setProductsActive(8);
              setGroupsActive(8);
              setReportsActive(8);
              setDashboardActive(true);
            }}
          />
        </Link>
      </NavLink>
      <NavLink
        styles={{
          root: {
            borderRadius: 6,
            margin: 2,
          },
        }}
        label="Members"
        icon={<IconUsers size={16} stroke={1.5} />}
        childrenOffset={24}
      >
        {members_data.map((item: any, index: number) => (
          <Link href={item.url} key={item.label}>
            <NavLink
              styles={{
                root: {
                  borderRadius: 6,
                  margin: 2,
                },
              }}
              label={item.name}
              active={membersActive === index}
              onClick={() => {
                setMembersActive(index);
                setLoansActive(8);
                setProductsActive(8);
                setGroupsActive(8);
                setReportsActive(8);
                setDashboardActive(false);
              }}
            />
          </Link>
        ))}
      </NavLink>
      <NavLink
        styles={{
          root: {
            borderRadius: 6,
            margin: 2,
          },
        }}
        label="Groups"
        icon={<IconBrandAsana size={16} stroke={1.5} />}
        childrenOffset={24}
      >
        {groups_data.map((item: any, index: number) => (
          <Link href={item.url} key={item.label}>
            <NavLink
              styles={{
                root: {
                  borderRadius: 6,
                  margin: 2,
                },
              }}
              label={item.name}
              active={groupsActive === index}
              onClick={() => {
                setMembersActive(8);
                setLoansActive(8);
                setProductsActive(8);
                setGroupsActive(index);
                setReportsActive(8);
                setDashboardActive(false);
              }}
            />
          </Link>
        ))}
      </NavLink>
      <NavLink
        styles={{
          root: {
            borderRadius: 6,
            margin: 2,
          },
        }}
        label="Products"
        icon={<IconTag size={16} stroke={1.5} />}
        childrenOffset={24}
      >
        {products_data.map((item: any, index: number) => (
          <Link href={item.url} key={item.label}>
            <NavLink
              styles={{
                root: {
                  borderRadius: 6,
                  margin: 2,
                },
              }}
              label={item.name}
              active={productsActive === index}
              onClick={() => {
                setMembersActive(8);
                setLoansActive(8);
                setProductsActive(index);
                setGroupsActive(8);
                setReportsActive(8);
                setDashboardActive(false);
              }}
            />
          </Link>
        ))}
      </NavLink>
      <NavLink
        styles={{
          root: {
            borderRadius: 6,
            margin: 2,
          },
        }}
        label="Loans"
        icon={<IconCash size={16} stroke={1.5} />}
        childrenOffset={24}
      >
        {loans_data.map((item: any, index: number) => (
          <Link href={item.url} key={item.label}>
            <NavLink
              styles={{
                root: {
                  borderRadius: 6,
                  margin: 2,
                },
              }}
              label={item.name}
              active={loansActive === index}
              onClick={() => {
                setMembersActive(8);
                setLoansActive(index);
                setProductsActive(8);
                setGroupsActive(8);
                setReportsActive(8);
                setDashboardActive(false);
              }}
            />
          </Link>
        ))}
      </NavLink>
      <NavLink
        styles={{
          root: {
            borderRadius: 6,
            margin: 2,
          },
        }}
        label="Apps"
        icon={<IconApps size={16} stroke={1.5} />}
        childrenOffset={24}
      >
        {apps_data.map((item: any, index: number) => (
          <Link href={item.url} key={item.label}>
            <NavLink
              styles={{
                root: {
                  borderRadius: 6,
                  margin: 2,
                },
              }}
              label={item.name}
              active={reportsActive === index}
              onClick={() => {
                setMembersActive(8);
                setLoansActive(8);
                setProductsActive(8);
                setGroupsActive(8);
                setReportsActive(index);
                setDashboardActive(false);
              }}
            />
          </Link>
        ))}
      </NavLink>
      <NavLink
        styles={{
          root: {
            borderRadius: 6,
            margin: 2,
          },
        }}
        label="Reports"
        icon={<IconReport size={16} stroke={1.5} />}
        childrenOffset={24}
      >
        {reports_data.map((item: any, index: number) => (
          <Link href={item.url} key={item.label}>
            <NavLink
              styles={{
                root: {
                  borderRadius: 6,
                  margin: 2,
                },
              }}
              label={item.name}
              active={reportsActive === index}
              onClick={() => {
                setMembersActive(8);
                setLoansActive(8);
                setProductsActive(8);
                setGroupsActive(8);
                setReportsActive(index);
                setDashboardActive(false);
              }}
            />
          </Link>
        ))}
      </NavLink>
    </Box>
  );
}
