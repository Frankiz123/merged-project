import React, { useEffect } from 'react';

import { useRouter } from 'next/router';
import { Divider, Grid } from '@mui/material';

import { settingData } from '@utils/settings';

import {
  PlansSettings,
  AccountSettings,
  SettingsSideBar,
  SecuritySettings,
  PaymentsSettings,
  SettingPageWrapper,
  NotificationSettings,
  ReferandEarnSettings,
  settingDetailStyles as styles,
} from '@components/Settings';
import Text from '@components/Text';
import { useAuth } from '@context/AuthContext';
import { useProtected } from '@context/ProtectedContext';

interface SettingDetailPageProps {
  foo?: string;
}

const SettingDetailPage: React.FC<SettingDetailPageProps> = () => {
  const router = useRouter();
  const { tab } = router.query;
  const { isMobile } = useAuth();
  const { handleCurrentTab, currentTab } = useProtected();

  const selectedIndex = settingData.findIndex(obj => obj.name === String(currentTab));

  const components = {
    Plans: PlansSettings,
    Account: AccountSettings,
    Payments: PaymentsSettings,
    Security: SecuritySettings,
    ReferAndEarn: ReferandEarnSettings,
    Notifications: NotificationSettings,
  };

  useEffect(() => {
    if (tab) {
      handleCurrentTab(String(tab));
    }
  }, [tab]);

  const Component = components[currentTab];

  return (
    <>
      {!isMobile && (
        <>
          <Text text='Settings' className={styles.heading} />
          <Divider className={styles.divider} />
        </>
      )}
      <Grid container className={styles.settingDetailStyles}>
        {!isMobile && (
          <Grid item xs={4} sm={6} md={4}>
            <SettingsSideBar currentTab={handleCurrentTab} selectedTab={selectedIndex} />
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={8} className={styles.gridComponentBorder}>
          <SettingPageWrapper>
            <Component />
          </SettingPageWrapper>
        </Grid>
      </Grid>
    </>
  );
};

export default SettingDetailPage;
