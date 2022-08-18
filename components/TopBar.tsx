import React, { useState, useEffect } from "react";
import { Burger, Drawer, Tabs, TabsProps, Button, Group } from "@mantine/core";
import { ColorSchemeToggle } from "./ColorSchemeToggle";
import { IconSettings } from "@tabler/icons";

export function TopBar() {
  const [opened, setOpened] = useState(false);
  const title = opened ? "Close" : "Open";
  return (
    <>
      <ColorSchemeToggle />
    </>
  );
}
