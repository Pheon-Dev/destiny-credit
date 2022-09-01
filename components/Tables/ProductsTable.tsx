import React from "react";
import { Table, Badge, Text } from "@mantine/core";
import { Products } from "../../types";
import { useRouter } from "next/router";

export function ProductsTable({ products }: { products: Products[] }) {
  return (
    <>
      <Table striped highlightOnHover horizontalSpacing="md">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Rate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <ProductRow key={product.productId} product={product} />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Rate</th>
            <th>Status</th>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}

function ProductRow({ product }: { product: Products }) {
  const router = useRouter();
  return (
    <tr
      style={{ cursor: "pointer" }}
      onClick={() =>
           router.push(`/products/${product.id}`)
      }
    >
      <td>{product.productId}</td>
      <td>{product.productName}</td>
      <td>{product.interestRate}</td>
      <td>
        {product.approved ? (
          <Badge
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/products/${product.id}`)}
            variant="gradient"
            gradient={{
              from: "teal",
              to: "lime",
            }}
          >
            Approved
          </Badge>
        ) : (
          <Badge
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/products/${product.id}`)}
            variant="gradient"
            gradient={{
              from: "indigo",
              to: "cyan",
            }}
          >
            Approve
          </Badge>
        )}
      </td>
    </tr>
  );
}

