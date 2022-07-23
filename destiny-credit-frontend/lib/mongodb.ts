import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;
const MONGODB_DB = process.env.NEXT_PUBLIC_DB_NAME;

try {
  if (!MONGODB_URI) {
    console.log(`Found ${MONGODB_URI} environment variable!`);
  }
  if (!MONGODB_DB) {
    console.log(`Found ${MONGODB_DB} environment variable!`);
  }
} catch (error) {
  console.log(error);
}

type CacheProps = {
  cachedClient: any;
  cachedDb: any;
};

export async function connect({ cachedClient, cachedDb }: CacheProps) {
  if (cachedDb && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  const opts: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  let client = new MongoClient(`${MONGODB_URI}`, opts);
  await client.connect();
  let db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
}
