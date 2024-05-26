import React from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import Text from '@components/Text';
import ActionButton from '@components/ActionButton';

import styles from './DefaultCampaignScreen.module.scss';

interface IDefaultCampaignScreen {
  handleOpen: () => void;
}

const DefaultCampaignScreen: React.FC<IDefaultCampaignScreen> = ({ handleOpen }) => (
  <div className={styles.wrapper}>
    <div className={styles.conatiner}>
      <Text variant={'h2'} className={styles.headingText} text='Groups' />
      <Text
        variant={'subtitle1'}
        className={styles.subtitleText}
        text='Manage your groups in custom folders to track the effort of your campaigns.'
      />
      <Text variant={'subtitle1'} className={styles.subtitleText} text='Create your first group.' />
      <ActionButton
        buttonLabel='Add Group'
        onClick={handleOpen}
        className={styles.addCampaignButton}
        startIcon={<AddCircleOutlineIcon />}
      />
    </div>
  </div>
);

export default DefaultCampaignScreen;
