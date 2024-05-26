import React from 'react';

import ActionButton from '@components/ActionButton';
import { Box, IconButton } from '@mui/material';

import Text from '@components/Text';

import styles from './NotificationBar.module.scss';

interface NotificationProps {
  text: string;
  handleUpgrade?: () => void;
  handleCloseNotification?: () => void;
}

const NotificationBar: React.FC<NotificationProps> = ({ text = '', handleUpgrade, handleCloseNotification }) => (
  <Box className={styles.snackBar}>
    <Box className={styles.textBtnContainer}>
      <Text variant={'h3'} className={styles.snackBarText} text={text} />
      <ActionButton type='button' onClick={handleUpgrade} buttonLabel={' See Plans'} variant={'text'} showLoader={false} />
    </Box>
    <Box className={styles.closeIcon}>
      <IconButton aria-label='delete' onClick={handleCloseNotification}>
        <img src='images/x.svg' />
      </IconButton>
    </Box>
  </Box>
);

export default NotificationBar;
