import React from 'react';
import { Box, Modal, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import ActionButton from '@components/ActionButton';

import styles from './DeleteModal.module.scss';

interface IDeleteModal {
  open: boolean;
  loading: boolean;
  removeText: string;
  deleteLink: () => void;
  handleClose?: () => void;
}

const DeleteModal: React.FC<IDeleteModal> = ({ open, handleClose, deleteLink, loading, removeText }) => (
  <Modal open={open} onClose={handleClose}>
    <Box className={styles.modalWraper}>
      <div className={styles.buttonContainer}>
        <IconButton aria-label='delete' onClick={handleClose}>
          <CloseIcon color='primary' />
        </IconButton>
      </div>
      <Box className={styles.headingText}>{`Are you sure you want to remove this ${removeText}?`}</Box>
      <Box className={styles.secondaryText}>This action is not reversible</Box>

      <Box className={styles.buttonGroup}>
        <ActionButton type='button' onClick={handleClose} buttonLabel={'Cancel'} variant={'text'} startIcon={<CloseIcon />} />
        <ActionButton type='button' onClick={deleteLink} buttonLabel={`Remove ${removeText}`} loading={loading} />
      </Box>
    </Box>
  </Modal>
);

export default DeleteModal;
