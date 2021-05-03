import Head from 'next/head'
import Background from "../components/Background"
import Logo from "../components/Logo"

export default function Home() {

  const endpoint = "https://life-pipeline.coronasafe.network/api";

  const examples = [
    { type: "oxygen", state: "maharashtra", district: "latur" },
    { type: "helpline", state: "tamil_nadu", district: "kanyakumari" },
    { type: "medicine", state: "kerala", district: "ernakulam" },
  ]

  return (
    <div>
      <Head>
        <title>Life Data API - Documentation</title>
        <meta name="description" content="Life Data API - Documentation" />
        <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet" />
        <link rel="icon" href="https://cdn.coronasafe.network/life/favicon-32x32.png" />
      </Head>
      <div className="relative py-8 pb-10 bg-white overflow-hidden">
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
          <div className="relative h-full text-lg max-w-prose mx-auto" aria-hidden="true">
            <Background />
          </div>
        </div>
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="text-lg max-w-prose mx-auto">
            <div className="flex justify-center">
              <Logo />
            </div>
            <h1>
              <span className="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">Introducing</span>
              <span className="mt-2 block text-3xl text-center leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">Life Data API v2</span>
            </h1>
            <section className="my-10 text-center flex flex-col">
              <h2 className="font-medium">Primary Endpoint</h2>
              <div className="mx-auto bg-gray-50 my-2 cursor-pointer text-yellow-600 text-sm sm:text-base md:text-lg font-semibold p-2 rounded-md">{endpoint}</div>
            </section>
            <section className="mt-5">
              <h2 className="font-medium">Available Objects:</h2>
              <div className="bg-gray-50 mt-2 text-indigo-600 text-base md:text-lg font-semibold p-2 rounded-md">
                <span><span className="text-gray-900">GET</span> /resources?resource=<span className="text-red-600 font-semibold text-lg">{'{'}type{'}'}</span>&amp;state=<span className="text-red-600 font-semibold text-lg">{'{'}state{'}'}</span> &amp;district=<span className="text-red-600 font-semibold text-lg">{'{'}district{'}'}</span></span>
              </div>
              <span className="text-xs"><span className="font-medium">Note:</span> this object has three required paramaters</span>
            </section>
            <section className="mt-5">
              <h2 className="font-medium my-1">Parameters:</h2>
              <div className="text-base">All parameters must be lowercased and space replaced with underscore ( _ ).</div>
              <div className="text-sm mt-2">Eg: <span className="font-medium">Andhra Pradesh</span> should be <span className="font-medium">andhra_pradesh</span></div>
              <a target="_blank" className="text-indigo-600 hover:text-indigo-900 font-medium text-sm" href="https://github.com/coronasafe/life/wiki/Life-Data-Structure">Learn More</a>
            </section>
            <section className="mt-5">
              <h2 className="font-medium">Examples:</h2>
              {
                examples.map((e, id) =>
                  <a key={id}
                    target="_blank"
                    href={`${endpoint}/resources?resource=${e.type}&state=${e.state}&district=${e.district}`}>
                    <div className="bg-gray-50 mt-2 break-words underline text-indigo-600 text-base md:text-lg font-semibold p-2 rounded-md">/resources?resource=<span className="text-red-600 font-semibold text-lg">{e.type}</span>&amp;state=<span className="text-red-600 font-semibold text-lg">{e.state}</span>&amp;district=<span className="text-red-600 font-semibold text-lg">{e.district}</span></div>
                  </a>
                )
              }
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
