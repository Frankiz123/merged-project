import React, { useState } from 'react';

import { Close as CloseIcon } from '@mui/icons-material';
import { FormGroup, FormControlLabel, Box } from '@mui/material';

import Text from '@components/Text';
import CheckBox from '@components/CheckBox';
import ActionButton from '@components/ActionButton';
import { Title, HeadingSection, NotificationStyles as styles } from '@components/Settings';

import { useAuth } from '@context/AuthContext';
import { updateRecord } from '@utils/firebase-methods/database';
import { COLLECTION_NAME } from '@utils/FirebaseConstants';
import { db } from '@config/firebase';

interface NotificationSettingsProps {
  foo?: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = () => {
  const { user, reloadUser } = useAuth();
  const [report, setReport] = useState({
    weeklyReport: user?.weeklyReport ?? false,
    monthlyReport: user?.monthlyReport ?? false,
  });

  const handleCheckboxChange = (event): void => {
    const { name, checked } = event.target;
    setReport(prevReport => ({
      ...prevReport,
      [name]: checked,
    }));
  };
  const handleSubmit = (event): void => {
    event.preventDefault();
    if (user) {
      void updateRecord(db, COLLECTION_NAME.user, user.id, report);
      void reloadUser(user.id);
    }
  };

  return (
    <Box className={styles.container}>
      <Title text='Notifications' />
      <HeadingSection
        primary='Set your preferences'
        secondary='Choose type of notifications you want to recieve'
        className={styles.heading}
      />
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Text text='Reporting' className={styles.text4} />
          <FormControlLabel
            className={styles.label}
            control={<CheckBox isEnable={user?.weeklyReport ?? false} name='weeklyReport' onChange={handleCheckboxChange} />}
            label='send me weekly reports '
          />
          <FormControlLabel
            className={styles.label}
            control={<CheckBox isEnable={user?.monthlyReport ?? false} name='monthlyReport' onChange={handleCheckboxChange} />}
            label='send me monthly reports'
          />
          {/*   <Text text="Campaign reporting" className={styles.text4} />
        <FormControlLabel
          className={styles.label}
          control={<CheckBox />}
          label="send me weekly campaign reports"
        />
        <FormControlLabel
          className={styles.label}
          control={<CheckBox />}
          label="send me monthly campaign reports"
        />
        <Text text="General notifications" className={styles.text4} />
        <FormControlLabel
          className={styles.label}
          control={<CheckBox />}
          label="send me product updates"
        /> */}
        </FormGroup>
        <Box className={styles.buttonGroup}>
          <ActionButton className={styles.buttons} buttonClass={styles.saveChanges} buttonLabel={'Save changes'} />
          <ActionButton
            className={styles.buttons}
            buttonClass={styles.cancelChanges}
            buttonLabel={'Cancle'}
            variant={'text'}
            startIcon={<CloseIcon />}
          />
        </Box>
      </form>
    </Box>
  );
};

export default NotificationSettings;
