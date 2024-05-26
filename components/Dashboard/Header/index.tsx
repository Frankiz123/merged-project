import React from 'react';

import { Box, Link } from '@mui/material';

import Text from '@components/Text';

import DropDownComponent from '@components/DropDown/DropDown';
import styles from './dashboardheader.module.scss';

interface DateSelection {
  id: number;
  value: string;
  label: string;
  startOfMonth: string;
  endOfMonth: string;
}

interface TextProps {
  text: string;
  selectedValue: string;
  shortHandle?: string | null;
  dates: DateSelection[];
  handleSelectChange: (event: DateSelection) => void;
}

const DashBoardHeader: React.FC<TextProps> = ({ text, dates, shortHandle, selectedValue, handleSelectChange }) => (
  <div className={styles.dashboard_header}>
    <Box className={styles.subContainer}>
      <Text text={text} className={styles.heading} />
      <DropDownComponent
        selectedValue={selectedValue}
        fullWidth={true}
        data={dates}
        handleChangeValue={handleSelectChange}
        className={styles.dropDown}
      />
    </Box>
    {shortHandle && (
      <Link href='#'>
        mrg.to/ <span className={styles.linkSecondaryText}>{shortHandle}</span>
      </Link>
    )}
  </div>
);

export default DashBoardHeader;
