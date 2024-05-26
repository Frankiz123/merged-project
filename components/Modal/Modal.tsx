import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Box, Modal } from '@mui/material';
import { FormikValues } from 'formik';

import Text from '@components/Text';

import styles from './ModalScreen.module.scss';

interface ModalProps {
  open?: boolean;
  headingText?: string;
  height: string;
  headerClassName?: string;
  handleClose?: () => void;
  onSubmitForm?: (e?: React.FormEvent<HTMLFormElement> | FormikValues | undefined) => void;
  children: React.ReactNode;
}

const ModalScreen: React.FC<ModalProps> = ({
  open = false,
  height = '300px',
  headingText,
  headerClassName = '',
  handleClose = () => {},
  onSubmitForm = () => {},
  children,
}) => (
  <Modal open={open} onClose={handleClose}>
    <Box className={styles.container} sx={{ height }}>
      <div className={styles.header}>
        <div className={styles.buttonContainer}>
          <IconButton aria-label='delete' onClick={handleClose}>
            <CloseIcon color='primary' />
          </IconButton>
        </div>
        {headingText && <Text variant={'h2'} text={headingText} className={[styles.headingText, headerClassName].join(' ')} />}
      </div>
      <form className={styles.form} onSubmit={onSubmitForm}>
        {children}
      </form>
    </Box>
  </Modal>
);

export default ModalScreen;
