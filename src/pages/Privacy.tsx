import Layout from "../components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <section className="px-4 md:px-8 py-20 bg-navy-900">
        <div className="container mx-auto max-w-3xl">
          <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-teal-500 mb-4">
            Privacy Policy
          </p>
          <h1 className="headline text-5xl md:text-7xl text-bone-100 mb-8">
            Privacy basics
          </h1>
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>
              BowlerProShop.com collects information visitors choose to submit, such as email
              addresses, bowler profile inputs, and lead form details. This data is used to provide
              gear recommendations, send requested resources, and improve the site.
            </p>
            <p>
              The site may use analytics, affiliate tracking, and advertising tags after they are
              configured for production. Those tools can set cookies or collect device and usage data.
            </p>
            <p>
              Do not submit sensitive personal information through selector or lead forms. Production
              checkout, payment, and order data should be handled through the approved commerce
              platform and payment processor.
            </p>
            <p>
              To request a data update or deletion after production launch, contact the site operator
              through the official support channel published on BowlerProShop.com.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
