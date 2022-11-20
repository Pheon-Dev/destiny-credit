import { Tabs } from '@mantine/core';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons';
import { NextPage } from 'next';

const Page: NextPage = () => {
  return (
    <Tabs variant="outline" defaultValue="payments">
      <Tabs.List position="center">
        <Tabs.Tab value="payments" icon={<IconPhoto size={14} />}>Gallery</Tabs.Tab>
        <Tabs.Tab value="messages" icon={<IconMessageCircle size={14} />}>Messages</Tabs.Tab>
        <Tabs.Tab value="settings" icon={<IconSettings size={14} />}>Settings</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="payments" pt="xs">
        payments ledger
      </Tabs.Panel>

      <Tabs.Panel value="messages" pt="xs">
        Messages tab content
      </Tabs.Panel>

      <Tabs.Panel value="settings" pt="xs">
        Settings tab content
      </Tabs.Panel>
    </Tabs>
  );
}

export default Page
