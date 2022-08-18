import React, { useState } from "react";
import { IconDashboard } from "@tabler/icons";
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";
import { MainLinkProps } from "../models/interfaces";

function MainLink({ icon, color, label }: MainLinkProps) {
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          }
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">{icon}</ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

const data = [
{icon: <IconDashboard size={16} />, color: 'blue', label: 'Dashboard'}
]

export function MainLinks() {
    const links = data.map((link) => <MainLink {...link} key={link.label} />);
    return <div>{links}</div>
  }
