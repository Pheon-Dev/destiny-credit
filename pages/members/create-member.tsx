import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { TextInput, Button, Group } from "@mantine/core";
import { randomId } from "@mantine/hooks";

const CreateMember = () => {
  const form = useForm({
      initialValues: {
          surName: '',
          otherNames: '',
        }
    })
  return (
    <div style={{maxWidth: 320, margin: 'auto'}}>
      <TextInput label="Sur Name" placeholder="Sur Name" {...form.getInputProps("surName")} />
    </div>
  );
};

export default CreateMember;
