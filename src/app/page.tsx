
const Page = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Bill-X",
    operatingSystem: "Web-based",
    applicationCategory: "BusinessApplication",
    description:
      "Full-stack invoicing, customer management, and payment tracking application.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2>hello world!!</h2>
    </>
  );
};

export default Page;
