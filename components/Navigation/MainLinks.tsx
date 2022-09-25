import React from "react";
import {
  IconHome,
  IconUsers,
  IconReport,
  IconCash,
  IconTag,
  IconBrandAsana,
} from "@tabler/icons";
import { Box, NavLink, Text } from "@mantine/core";
import { Protected } from "../Protected/Protected";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import Link from "next/link";

interface Data {
  id: number;
  name: string;
  url: string;
}

export const MainLinks = () => {
  const router = useRouter();

  const { data } = useSession();

  const { data: user } = trpc.users.user.useQuery({
    email: `${data?.user?.email}` || "",
  });

  const LinkRouter = ({
    data,
    title,
    icon,
    open,
  }: {
    data: Data[];
    title: string;
    icon: any;
    open: boolean;
  }) => {
    return (
      <NavLink
        defaultOpened={open}
        styles={{
          root: {
            borderRadius: 6,
            margin: 2,
          },
        }}
        label={
          <Text weight={700} size="md">
            {title}
          </Text>
        }
        icon={icon}
        childrenOffset={24}
      >
        {data?.map((item: Data) => (
          <Link href={item.url} key={item.url}>
            <NavLink
              styles={{
                root: {
                  borderRadius: 6,
                  margin: 2,
                },
              }}
              label={<Text weight={500}>{item.name}</Text>}
              active={router.pathname === item.url}
            />
          </Link>
        ))}
      </NavLink>
    );
  };

  return (
    <Protected>
      <Box style={{ padding: 2 }}>
        <LinkRouter
          icon={<IconHome size={16} stroke={1.5} />}
          data={dashboard_data}
          title="Home"
          open={true}
        />
        <LinkRouter
          icon={<IconUsers size={16} stroke={1.5} />}
          data={members_data}
          title="Members"
          open={true}
        />
        <LinkRouter
          icon={<IconCash size={16} stroke={1.5} />}
          data={loans_data}
          title="Loans"
          open={true}
        />
        <LinkRouter
          icon={<IconBrandAsana size={16} stroke={1.5} />}
          data={groups_data}
          title="Groups"
          open={false}
        />
        <LinkRouter
          icon={<IconTag size={16} stroke={1.5} />}
          data={products_data}
          title="Products"
          open={false}
        />
        {/* <LinkRouter */}
        {/*   icon={<IconApps size={16} stroke={1.5} />} */}
        {/*   data={apps_data} */}
        {/*   title="Apps" */}
        {/* /> */}
        {user?.role !== "CO" && (
          <LinkRouter
            icon={<IconReport size={16} stroke={1.5} />}
            data={reports_data}
            title="Reports"
            open={false}
          />
        )}
      </Box>
    </Protected>
  );
};

const dashboard_data = [
  {
    id: 0,
    name: "Dashboard",
    url: "/",
  },
];
const members_data = [
  {
    id: 0,
    name: "New Member",
    url: "/members/create-member",
  },
  {
    id: 1,
    name: "All Members",
    url: "/members",
  },
];
const groups_data = [
  {
    id: 0,
    name: "New Group",
    url: "/groups/create-group",
  },
  {
    id: 1,
    name: "All Groups",
    url: "/groups",
  },
];
const products_data = [
  {
    id: 0,
    name: "New Product",
    url: "/products/create-product",
  },
  {
    id: 1,
    name: "All Products",
    url: "/products",
  },
];
const loans_data = [
  {
    id: 0,
    name: "New Loan",
    url: "/loans/create-loan",
  },
  {
    id: 1,
    name: "Approvals",
    url: "/loans/approvals",
  },
  {
    id: 2,
    name: "Disbursments",
    url: "/loans/disbursements",
  },
  {
    id: 3,
    name: "Payments",
    url: "/loans/payments",
  },
  {
    id: 4,
    name: "All Loans",
    url: "/loans",
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
    url: "/reports/par-report",
  },
  {
    id: 1,
    name: "Schedules",
    url: "/reports/schedule-report",
  },
];
