import Head from 'next/head'
import { Dashboard } from "../components";

export default function Home() {
  console.log('Home')
    return (
        <div>
            <Head>
                <title>Destiny Credit LTD</title>
                {/* <link rel="manifest" href="/manifest.json" /> */}
                {/* <link rel="apple-touch-icon" href="/logo.png" /> */}
                <meta
                    name="keywords"
                    content="Destiny, Destiny Credit, Credit"
                />
            </Head>
            <Dashboard />
        </div>
    )
}
