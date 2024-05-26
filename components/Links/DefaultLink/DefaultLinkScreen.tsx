import React from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { useProtected } from '@context/ProtectedContext';
import Text from '@components/Text';
import ActionButton from '@components/ActionButton';

import styles from './DefaultLinkScreen.module.scss';

interface IDefaultLinkScreen {
  heading: string;
  descriptionHeading: string;
  description: string;
}

const DefaultLinkScreen: React.FC<IDefaultLinkScreen> = ({ heading, descriptionHeading, description }) => {
  const { handleModal } = useProtected();

  const handleOpen = (): void => {
    handleModal();
  };

  return (
    <div className={styles.wrapper}>
      <Text text={heading} className={styles.heading} />

      <div className={styles.conatiner}>
        <Text variant={'h2'} className={styles.headingText} text={descriptionHeading} />
        <Text variant={'subtitle1'} className={styles.subtitleText} text={description} />

        <ActionButton buttonLabel='Add Link' onClick={handleOpen} className={styles.addLinkButton} startIcon={<AddCircleOutlineIcon />} />
      </div>
    </div>
  );
};

export default DefaultLinkScreen;
