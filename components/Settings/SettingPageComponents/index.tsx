import React from 'react';

import { ListItemText, Box } from '@mui/material';
import Text from '@components/Text';
import { settingPageComponentStyles as styles } from '@components/Settings';

interface TitleProps {
  text: string;
  className?: string;
}

interface HeadingSectionProps {
  primary: string;
  secondary?: string;
  className?: string;
}

interface SettingPageWrapperProps {
  children: React.ReactNode;
}

export const Title: React.FC<TitleProps> = ({ text, className }) => (
  <>
    <Text text={text} className={[styles.title, className].join(' ')} />
  </>
);

// export const Title: React.FC<TitleProps> = ({ children }) => (
//   <Typography className={styles.title}>{children}</Typography>
// );

export const HeadingSection: React.FC<HeadingSectionProps> = ({ primary, secondary, className }) => (
  <ListItemText className={className ?? 'headingSection'} primary={primary} secondary={secondary}></ListItemText>
);

export const TextFieldSectionHeading: React.FC<HeadingSectionProps> = ({ primary, secondary, className }) => (
  <ListItemText className={className ?? 'TextFieldSectionHeading'} primary={primary} secondary={secondary}></ListItemText>
);

export const SettingPageWrapper: React.FC<SettingPageWrapperProps> = ({ children }) => {
  return <Box className={styles.pageWrapper}>{children}</Box>;
};
