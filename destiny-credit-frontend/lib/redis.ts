import { Client, Entity, Schema, Repository } from "redis-om";

const REDIS_URL = process.env.NEXT_PUBLIC_REDIS_URL;
const client = new Client();

async function connect() {
  if (!client.isOpen()) {
    await client.open(REDIS_URL)
  }
}

class Transaction extends Entity {};

let schema = new Schema(
  Transaction,
  {
  transactionType: { type: 'string' },
  transID: { type: 'string' },
  transTime: { type: 'string' },
  transAmount: { type: 'string' },
  businessShortCode: { type: 'string' },
  billRefNumber: { type: 'string' },
  invoiceNumber: { type: 'string' },
  orgAccountBalance: { type: 'string' },
  thirdPartyTransID: { type: 'string' },
  mSISDN: { type: 'string' },
  firstName: { type: 'string' },
  middleName: { type: 'string' },
  lastName: { type: 'string' },
  },
  {
    dataStructure: 'JSON',
  }
);

export async function createTransaction(data: any) {
  await connect();

  const repository = client.fetchRepository(schema);

  const transaction = repository.createEntity(data);

  const id = await repository.save(transaction);
  return id;
}
