import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
}

const SEO = ({ 
  title = "Gangeshwar Agro Center | Quality Seeds, Fertilizers & Pesticides", 
  description = "Gangeshwar Agro Center provides high-quality agricultural inputs including seeds, fertilizers, and pesticides to help farmers achieve sustainable and profitable farming.",
  image = "/logo.png",
  url = window.location.href,
  type = "website",
  keywords = "agriculture, seeds, fertilizers, pesticides, farming, Gangeshwar Agro"
}: SEOProps) => {
  const siteTitle = title.includes("Gangeshwar Agro") ? title : `${title} | Gangeshwar Agro Center`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
