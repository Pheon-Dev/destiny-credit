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

  let cachedClient: any = null;
  let cachedDb: any = null;

export async function connect() {
  if (cachedClient && cachedDb) {
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
