import { Client, Entity, Schema, Repository } from "redis-om";

const REDIS_URL = process.env.NEXT_PUBLIC_REDIS_URL;
const client = new Client();

async function connect() {
  if (!client.isOpen()) {
    await client.open(REDIS_URL);
  }
}

class Transaction extends Entity {}
class Test extends Entity {}

let test_schema = new Schema(
  Test,
  {
    transactionTest: { type: "string" },
  },
  {
    dataStructure: "JSON",
  }
);

let schema = new Schema(
  Transaction,
  {
    transactionType: { type: "string" },
    transID: { type: "string" },
    transTime: { type: "string" },
    transAmount: { type: "string" },
    businessShortCode: { type: "string" },
    billRefNumber: { type: "string" },
    invoiceNumber: { type: "string" },
    orgAccountBalance: { type: "string" },
    thirdPartyTransID: { type: "string" },
    msisdn: { type: "string" },
    firstName: { type: "string" },
    middleName: { type: "string" },
    lastName: { type: "string" },
  },
  {
    dataStructure: "JSON",
  }
);

export async function createTest(data: any) {
  await connect();

  const repository = client.fetchRepository(test_schema);

  const transaction = repository.createEntity(data);

  const id = await repository.save(transaction);
  return id;
}

export async function createTransaction(data: any) {
  await connect();

  const repository = client.fetchRepository(schema);

  const transaction = repository.createEntity(data);

  const id = await repository.save(transaction);
  return id;
}

export async function createIndex() {
  await connect();

  const repository = client.fetchRepository(schema);

  await repository.createIndex();
}

export async function searchTransaction(q: any) {
  await connect();

  const repository = client.fetchRepository(schema);

  const transaction = await repository
    .search()
    .where('transTime')
    .equals(q)
    .return.all();

  return transaction;
}

export async function listTransactions() {
  await connect();

  const repository = client.fetchRepository(schema);

  const list = await repository.search().return.all();

  return list;
}
