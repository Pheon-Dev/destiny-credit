import React, { useEffect, useState } from "react";
import { Group, Stepper, Button, LoadingOverlay, Text } from "@mantine/core";
import { Collaterals, Guarantors, Maintenance } from "../../components";
import { NextPage } from "next";
import Router, { useRouter } from "next/router";
import { showNotification, updateNotification } from "@mantine/notifications";

const Page: NextPage = () => {
  const [active, setActive] = useState(0);

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  /* const handleSubmit = async () => { */
  /*   try { */
  /*     setTimeout(() => { */
  /*       updateNotification({ */
  /*         id: "sing-in-status", */
  /*         color: "teal", */
  /*         title: "Successful Sign In!", */
  /*         message: `Welcome to Destiny Credit LTD, ${form.values.member}`, */
  /*         icon: <IconCheck size={16} />, */
  /*         autoClose: 8000, */
  /*       }); */
  /*     }); */
  /*     router.push("/"); */
  /*     const res = await axios.get("/api/"); */
  /*     const data = res.data; */
  /*     return Router.replace(Router.asPath); */
  /*   } catch (error) { */
  /*     setTimeout(() => { */
  /*       updateNotification({ */
  /*         id: "sing-in-status", */
  /*         title: "Sign In Error!", */
  /*         message: `Please Try Signing In Again!`, */
  /*         icon: <IconX size={16} />, */
  /*         color: "red", */
  /*         autoClose: 4000, */
  /*       }); */
  /*     }); */
  /*   } */
  /* }; */

  return (
    <>
      <Stepper mt="lg" active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step
          label="Loan Maintenance"
          description="Select a Member & a Product."
        >
          <Maintenance />
        </Stepper.Step>
        <Stepper.Step
          label="Add a Guarantor"
          description="Add a Guarantor to Guarantee this Loan"
        >
          <Guarantors />
        </Stepper.Step>
        <Stepper.Step
          label="Add Collaterals"
          description="Lastly, Add Collaterals to Proceed."
        >
          <Collaterals />
        </Stepper.Step>
        <Stepper.Completed>
          <Text>Loan Maintained Successfully</Text>
        </Stepper.Completed>
      </Stepper>

      <Group position="center" mt="xl">
      <Button variant="default" onClick={prevStep}>Back</Button>
      <Button onClick={nextStep}>Next</Button>
      </Group>
    </>
  );
};

export default Page;
