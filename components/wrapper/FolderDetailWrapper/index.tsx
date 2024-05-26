import React from 'react';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import ActionButton from '@components/ActionButton';
import Text from '@components/Text';

import styles from './folderdetailwrapper.module.scss';

interface FolderDetailWrapperModalProps {
  totalClicks?: string;
  isEditable?: boolean;
  date?: string;
  children: React.ReactNode;
  isLoading: boolean;
  create: boolean;
  onUpdateCardHandler?: () => void;
  handleSubmit?: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
}

const FolderDetailWrapper: React.FC<FolderDetailWrapperModalProps> = ({
  totalClicks = '',
  isEditable = true,
  date = '',
  children,
  isLoading = false,
  create = false,
  onUpdateCardHandler = () => {},
  handleSubmit,
}) => (
  <Box className={styles.container}>
    <Box className={styles.headerContainer}>
      <Text text={'Description'} className={styles.headerLabel} variant={'h2'} />
      <Box className={styles.headerSecondaryContainer}>
        <LeaderboardIcon />
        <Text text={`${totalClicks}`} className={styles.totalClicksValue} variant={'subtitle1'} />
        <Text text={` total clicks`} className={styles.totalClicksLabel} variant={'subtitle1'} />
      </Box>
      <Box className={styles.headerSecondaryContainer}>
        <CalendarTodayIcon />
        <Text text={date} className={styles.dateValue} variant={'subtitle1'} />
      </Box>
    </Box>
    <form onSubmit={handleSubmit}>
      {children}

      {create && !isEditable && (
        <Box className={styles.buttonContainer}>
          <ActionButton
            isFull={false}
            variant={'text'}
            onClick={onUpdateCardHandler}
            className={styles.actionButton}
            startIcon={<CloseIcon />}
            buttonLabel='Cancle'
          />
          <ActionButton isFull={false} loading={isLoading} className={styles.actionButton} buttonLabel='Create' />
        </Box>
      )}
    </form>
  </Box>
);

export default FolderDetailWrapper;
