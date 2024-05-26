import React from 'react';

import styles from './loading.module.scss';
import { CircularProgress } from '@mui/material';
import Text from '@components/Text';
import { useAuth } from '@context/AuthContext';

interface LoadingProps {
  size?: number;
  primaryText?: string;
  secondaryText?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 50, primaryText = '', secondaryText = '' }) => {
  const { isMobile } = useAuth();
  return (
    <div className={styles.wrapper}>
      <CircularProgress size={isMobile ? 30 : size} color='primary' />
      {primaryText && <Text text={primaryText} variant='h3' />}
      {secondaryText && <Text text={secondaryText} variant='subtitle1' />}
    </div>
  );
};

export default Loading;
