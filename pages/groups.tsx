import React, { useState } from 'react';

import dynamic from 'next/dynamic';

import { MainWrapper } from '@components/wrapper';
import Loading from '@components/Loading';
import { DefaultCampaignScreen } from '@components/Campaign';
import { useProtected } from '@context/ProtectedContext';

const CreateCampaignModal = dynamic(async () => await import('../components/Campaign/CreateCampaignForm/CreateCampaignForm'));
const CampaignMain = dynamic(async () => await import('../components/Campaign/CampaignMain/CampaignMain'));

const Groups: React.FC = () => {
  const { loading, campaigns } = useProtected();

  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const getActiveView = (): React.ReactNode => {
    if (loading) {
      return <Loading primaryText='Loading groups' secondaryText='Please wait...' />;
    }
    if (campaigns.length === 0) {
      return <DefaultCampaignScreen handleOpen={handleOpen} />;
    }
    return <CampaignMain campagins={campaigns} handleOpen={handleOpen} />;
  };

  return (
    <MainWrapper>
      {getActiveView()}
      <CreateCampaignModal open={open} handleClose={handleClose} />
    </MainWrapper>
  );
};

export default Groups;
