import React, { useEffect, useState } from "react";
import {
  IconHome,
  IconUsers,
  IconReport,
  IconCash,
  IconTag,
  IconBrandAsana,
} from "@tabler/icons";
import { Box, NavLink, Text } from "@mantine/core";
import Link from "next/link";

export function MainLinks() {
  const [membersActive, setMembersActive] = useState(9);
  const [groupsActive, setGroupsActive] = useState(9);
  const [productsActive, setProductsActive] = useState(9);
  const [loansActive, setLoansActive] = useState(9);
  const [reportsActive, setReportsActive] = useState(9);
  const [dashboardActive, setDashboardActive] = useState(true);

  return (
    <Box>
      <NavLink
        styles={{
          root: {
            borderRadius: 6,
            margin: 2,
          },
        }}
        label={
          <Text weight={700} size="md">
            Home
          </Text>
        }
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
            label={<Text weight={500}>Dashboard</Text>}
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
        label={
          <Text weight={700} size="md">
            Members
          </Text>
        }
        icon={<IconUsers size={16} stroke={1.5} />}
        childrenOffset={24}
      >
        {members_data.map((item: any, index: number) => (
          <Link key={item.url} href={item.url}>
            <NavLink
              styles={{
                root: {
                  borderRadius: 6,
                  margin: 2,
                },
              }}
              label={<Text weight={500}>{item.name}</Text>}
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
        label={
          <Text weight={700} size="md">
            Loans
          </Text>
        }
        icon={<IconCash size={16} stroke={1.5} />}
        childrenOffset={24}
      >
        {loans_data.map((item: any, index: number) => (
          <Link key={item.url} href={item.url}>
            <NavLink
              styles={{
                root: {
                  borderRadius: 6,
                  margin: 2,
                },
              }}
              label={<Text weight={500}>{item.name}</Text>}
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
        label={
          <Text weight={700} size="md">
            Groups
          </Text>
        }
        icon={<IconBrandAsana size={16} stroke={1.5} />}
        childrenOffset={24}
      >
        {groups_data.map((item: any, index: number) => (
          <Link key={item.url} href={item.url}>
            <NavLink
              styles={{
                root: {
                  borderRadius: 6,
                  margin: 2,
                },
              }}
              label={<Text weight={500}>{item.name}</Text>}
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
        label={
          <Text weight={700} size="md">
            Products
          </Text>
        }
        icon={<IconTag size={16} stroke={1.5} />}
        childrenOffset={24}
      >
        {products_data.map((item: any, index: number) => (
          <Link key={item.url} href={item.url}>
            <NavLink
              styles={{
                root: {
                  borderRadius: 6,
                  margin: 2,
                },
              }}
              label={<Text weight={500}>{item.name}</Text>}
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
      {/* <NavLink */}
      {/*   styles={{ */}
      {/*     root: { */}
      {/*       borderRadius: 6, */}
      {/*       margin: 2, */}
      {/*     }, */}
      {/*   }} */}
        {/* label={ */}
        {/*   <Text weight={700} size="md"> */}
        {/*     Apps */}
        {/*   </Text> */}
        {/* } */}
      {/*   icon={<IconApps size={16} stroke={1.5} />} */}
      {/*   childrenOffset={24} */}
      {/* > */}
      {/*   {apps_data.map((item: any, index: number) => ( */}
      {/*     <Link key={item.url} href={item.url}> */}
      {/*       <NavLink */}
      {/*         styles={{ */}
      {/*           root: { */}
      {/*             borderRadius: 6, */}
      {/*             margin: 2, */}
      {/*           }, */}
      {/*         }} */}
      {/* label={<Text weight={500}>{item.name}</Text>} */}
      {/*         active={reportsActive === index} */}
      {/*         onClick={() => { */}
      {/*           setMembersActive(8); */}
      {/*           setLoansActive(8); */}
      {/*           setProductsActive(8); */}
      {/*           setGroupsActive(8); */}
      {/*           setReportsActive(index); */}
      {/*           setDashboardActive(false); */}
      {/*         }} */}
      {/*       /> */}
      {/*     </Link> */}
      {/*   ))} */}
      {/* </NavLink> */}
      <NavLink
        styles={{
          root: {
            borderRadius: 6,
            margin: 2,
          },
        }}
        label={
          <Text weight={700} size="md">
            Reports
          </Text>
        }
        icon={<IconReport size={16} stroke={1.5} />}
        childrenOffset={24}
      >
        {reports_data.map((item: any, index: number) => (
          <Link key={item.url} href={item.url}>
            <NavLink
              styles={{
                root: {
                  borderRadius: 6,
                  margin: 2,
                },
              }}
              label={<Text weight={500}>{item.name}</Text>}
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
    url: "/loans/maintenance/",
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
// const apps_data = [
//   {
//     id: 0,
//     name: "Profit & Loss",
//     url: "/apps/expenses/",
//   },
//   {
//     id: 1,
//     name: "Schedules",
//     url: "/reports/schedule-report/",
//   },
// ];
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
