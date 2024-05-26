import React from 'react';
import dynamic from 'next/dynamic';

import { MainWrapper } from '@components/wrapper';
import Loading from '@components/Loading';
import { useProtected } from '@context/ProtectedContext';

const DefaultLinkScreen = dynamic(async () => await import('../components/Links/DefaultLink/DefaultLinkScreen'));
const LinksMain = dynamic(async () => await import('../components/Links/LinksMain/LinksMain'));

const Links: React.FC = () => {
  const { loading, links } = useProtected();

  const getActiveView = (): React.ReactNode => {
    if (loading) {
      return <Loading primaryText='Loading links' secondaryText='Please wait...' />;
    }
    if (links.length === 0) {
      return (
        <DefaultLinkScreen
          heading='Links'
          descriptionHeading='Description'
          description='Feedback widgets let you collect customer thoughts right in the moment. Create one now and see what people have to say.'
        />
      );
    }
    return <LinksMain links={links} />;
  };

  return <MainWrapper>{getActiveView()}</MainWrapper>;
};

export default Links;
