import React, { useEffect, useState } from "react";
import axios from "axios";
import { Group, LoadingOverlay, Text } from "@mantine/core";

const MembersList = () => {
  const [members, setMembers] = useState([]);

  async function fetchMembers() {
    let subscription = true;

    if (subscription) {
      const res = await axios.request({
        method: "GET",
        url: "/api/members",
      });

      const data = res.data.members;
      setMembers(data);
    }

    return () => {
      subscription = false;
    };
  }

  useEffect(() => {
    fetchMembers();
  }, [members]);

  return (
    <>
      <Group position="center">
        <Text>Members List</Text>
        <pre>{JSON.stringify(members, undefined, 2)}</pre>
      </Group>
    </>
  );
};

const ProductsList = () => {
  const [products, setProducts] = useState([]);

  async function fetchProducts() {
    let subscription = true;

    if (subscription) {
      const res = await axios.request({
        method: "GET",
        url: "/api/products",
      });

      const data = res.data.products;
      setProducts(data);
    }

    return () => {
      subscription = false;
    };
  }

  useEffect(() => {
    fetchProducts();
  }, [products]);

  return (
    <>
      <Group position="center">
        <Text>Products List</Text>
        <pre>{JSON.stringify(products, undefined, 2)}</pre>
      </Group>
    </>
  );
};

const Page = () => {
  return (
    <>
      <MembersList />
      {/* <ProductsList /> */}
    </>
  );
};

export default Page;
