import React from "react";
import { TitleText } from "../../components";
import { Table, Group, Badge } from "@mantine/core";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";

export function ProductsTable({ products }: { products: Product[] }) {
  const Header = () => (
    <tr>
      <th>Code</th>
      <th>Name</th>
      <th>Cycle</th>
      <th>Rate</th>
      <th>Status</th>
    </tr>
  );

  return (
    <>
      <Group position="center" m="lg">
       <TitleText title="Products List" />
      </Group>
      <Table striped highlightOnHover horizontalSpacing="md">
        <thead>
          <Header />
        </thead>
        <tbody>
          {products?.map((product) => (
            <ProductRow key={product.productId} product={product} />
          ))}
        </tbody>
        <tfoot>
          <Header />
        </tfoot>
      </Table>
    </>
  );
}

function ProductRow({ product }: { product: Product }) {
  const router = useRouter();
  return (
    <tr
      style={{ cursor: "pointer" }}
      onClick={() => router.push(`/products/details/${product.id}`)}
    >
      <td>{product.productId}</td>
      <td>{product.productName}</td>
      <td>{product.repaymentCycle}</td>
      <td>{product.interestRate} %</td>
      <td>
        {product.approved ? (
          <Badge
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/products/details/${product.id}`)}
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
            onClick={() => router.push(`/products/details/${product.id}`)}
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

