import React from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import styled from '@emotion/styled';

import Text from '@components/Text';

import styles from './Accordian.module.scss';

const MuiAccordian = styled(Accordion)(() => ({
  '&.Mui-expanded': {
    margin: '0px 0px',
  },
  '& .MuiAccordionSummary-root': {
    minHeight: '64px',
  },
}));

interface AccordianComponentProps {
  children: React.ReactNode;
  labelText: string;
  ariaControls: string;
  id?: string;
  defaultExpanded?: boolean;
  className?: string;
}

const AccordianComponent: React.FC<AccordianComponentProps> = ({
  children,
  defaultExpanded = true,
  labelText = '',
  ariaControls = '',
  id = '',
  className = '',
}) => (
  <MuiAccordian key={id} defaultExpanded={defaultExpanded} className={[styles.accordian, className].join(' ')}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={ariaControls} id={id}>
      <Text variant={'h2'} className={styles.LabelText} text={labelText} />
    </AccordionSummary>
    <AccordionDetails>{children}</AccordionDetails>
  </MuiAccordian>
);

export default AccordianComponent;
