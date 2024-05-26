import React from 'react';

import { Box } from '@mui/system';

import Text from '@components/Text';

import styles from './devicestats.module.scss';
import { useAuth } from '@context/AuthContext';

interface DeviceStatsProps {
  totalClicks?: number;
  isoDeviceStats?: string;
  topLocation?: string;
  isoFlagCode?: string;
  iosDevices?: string;
  androidDevices?: string;
  className?: string;
}

const DeviceStats: React.FC<DeviceStatsProps> = ({
  totalClicks = 0,
  isoDeviceStats = '\u{1F525}',
  topLocation = '-',
  isoFlagCode = '-',
  iosDevices = '0',
  androidDevices = '0',
}) => {
  const { isMobile } = useAuth();

  return (
    <Box className={styles.container}>
      <Box className={styles.itemContainer}>
        <Text text={`Total clicks: `} variant={'subtitle1'} className={styles.labelText} />
        <Text text={` ${totalClicks} ${isoDeviceStats}`} variant={'subtitle1'} className={styles.valueText} />
      </Box>
      <Box className={styles.itemContainer}>
        <Text text={`Top location:`} variant={'subtitle1'} className={styles.labelText} />
        <Text text={` ${topLocation} ${isoFlagCode}`} variant={'subtitle1'} className={styles.valueText} />
      </Box>
      {!isMobile && (
        <Box className={styles.itemContainer}>
          <Text text={`Device:`} variant={'subtitle1'} className={styles.labelText} />
          <Text text={` ${iosDevices} % iOS  / ${androidDevices} % Android `} variant={'subtitle1'} className={styles.valueText} />
        </Box>
      )}
    </Box>
  );
};

export default DeviceStats;
