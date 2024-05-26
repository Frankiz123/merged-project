import React from 'react';
import Head from 'next/head';

const CustomHeader: React.FC = () => (
  <Head>
    <title>Merged</title>
    <meta name='viewport' content='initial-scale=1, width=device-width' />

    {/* Cookiebot */}
    <script
      id='Cookiebot'
      src='https://consent.cookiebot.com/uc.js'
      data-cbid='ae1c42a5-960b-4f89-a537-45a0e34f722e'
      data-blockingmode='auto'
      type='text/javascript'></script>

    {/* Google Tag Manager */}
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-54VTB3NZ');`,
      }}
    />
    <noscript>
      <iframe
        src='https://www.googletagmanager.com/ns.html?id=GTM-54VTB3NZ'
        height='0'
        width='0'
        style={{ display: 'none', visibility: 'hidden' }}></iframe>
    </noscript>
  </Head>
);

export default CustomHeader;
