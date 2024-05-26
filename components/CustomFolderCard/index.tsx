/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import moment from 'moment';
import { Box } from '@mui/system';
import { FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';

import Text from '@components/Text';

import styles from './customfoldercard.module.scss';
import { FirebaseDate } from '@utils/firebase-interfaces/campaign';

interface CustomFolderCardProps {
  radioValue: string | null;
  data?: any[];
  updateSelection: (value: string) => void;
}

const CustomFolderCard: React.FC<CustomFolderCardProps> = ({ radioValue = null, data, updateSelection }) => {
  const updateSectionHandler = (_e: React.ChangeEvent<HTMLInputElement>, value: string): void => {
    updateSelection(value);
  };

  return (
    <>
      {data?.map((value: any) => {
        const dateCreate = new Date((value?.createdAt as FirebaseDate)?.seconds * 1000);
        return (
          <Box key={value.id} className={styles.container}>
            <FormControl className={styles.formControl}>
              <RadioGroup
                row
                aria-labelledby='demo-row-radio-buttons-group-label'
                onChange={(_e: React.ChangeEvent<HTMLInputElement>, _) => {
                  updateSectionHandler(_e, value.id);
                }}
                value={radioValue}
                name='row-radio-buttons-group'>
                <FormControlLabel value={value.id} className={styles.radioText} control={<Radio />} label={undefined} />
              </RadioGroup>
            </FormControl>
            <Box className={styles.formLabelContainer}>
              <Box className={styles.titleContainer}>
                <Text text={value.folderName} className={styles.titleLabel} variant={'h1'} />
                <Text text={moment(dateCreate).format('l')} className={styles.dateLabel} variant={'h1'} />
              </Box>
              <Box className={styles.linksContainer}>
                <Text text={`3 links`} className={styles.linksLabel} variant={'subtitle1'} />
                <Box className={styles.clickCountContainer}>
                  <BarChartIcon />
                  <Text variant={'subtitle1'} text={`0.00`} className={styles.clickCountLabel} />
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}
    </>
  );
};

export default CustomFolderCard;
