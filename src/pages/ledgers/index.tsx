import { Tabs } from '@mantine/core';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons';
import { NextPage } from 'next';

const Page: NextPage = () => {
  return (
    <Tabs variant="outline" defaultValue="payments">
      <Tabs.List position="center">
        <Tabs.Tab value="payments" icon={<IconPhoto size={14} />}>Payments</Tabs.Tab>
        <Tabs.Tab value="transactions" icon={<IconMessageCircle size={14} />}>Transactions</Tabs.Tab>
        <Tabs.Tab value="pnl" icon={<IconSettings size={14} />}>P&L</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="payments" pt="xs">
        payments ledger
      </Tabs.Panel>

      <Tabs.Panel value="transactions" pt="xs">
        Transactions
      </Tabs.Panel>

      <Tabs.Panel value="pnl" pt="xs">
        Profit & Loss
      </Tabs.Panel>
    </Tabs>
  );
}

export default Page
