import React, { useEffect, useState } from 'react';

import { FormikValues, useFormik } from 'formik';
import { Grid, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Select, { MultiValue } from 'react-select';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';
import { serverTimestamp } from 'firebase/firestore';
import { Id, toast } from 'react-toastify';

import AccordianComponent from '@components/Accordian/Accordian';
import ActionButton from '@components/ActionButton';
import Text from '@components/Text';
import FieldInputAdornment from '@components/TextFieldBox/fieldInputAdornment';
import TextFieldBox from '@components/TextFieldBox';
import { ADD_CAMPAIGN } from '@utils/formik/InitialValues';
import { ADD_CAMPAIGN_SCHEMA } from '@utils/yup-validations/validations';
import { saveRecord, getUserLinks } from '@utils/firebase-methods/database';
import { db } from '@config/firebase';
import { COLLECTION_NAME } from '@utils/FirebaseConstants';
import ModalScreen from '@components/Modal/Modal';
import { useProtected } from '@context/ProtectedContext';
import { useAuth } from '@context/AuthContext';
import Loading from '@components/Loading';
import { MergeLink } from '@utils/firebase-interfaces';
import { getTitleFromLink } from '@utils/links';
import styles from './createcampaignmodal.module.scss';

interface LinkSelect extends MergeLink {
  value: string;
  label: string;
}

interface CreateCampaignModalProps {
  open: boolean;
  handleClose: () => void;
}

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ open, handleClose = () => {} }) => {
  const { user, isMobile } = useAuth();
  const { links, loading, campaigns, setLoading, setMergeLinks, reloadCampaigns } = useProtected();

  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [loadingCount, setLoadingCount] = useState<number>(0);
  const [selectLinks, setSelectLinks] = useState<LinkSelect[]>([]);

  useEffect(() => {
    if (user && user?.id && loadingCount === 0 && (!links || links.length === 0)) {
      void loadLinks();
    } else {
      setSelectLinks(
        links.map((link: MergeLink) => {
          const selectLink: LinkSelect = link as LinkSelect;
          selectLink.value = link.id;
          selectLink.label = getTitle(link);
          return selectLink;
        })
      );
    }
  }, [links, user, loadingCount]);

  const loadLinks = async (): Promise<void> => {
    // setLoading(true);
    if (user && user.id) {
      const data = await getUserLinks(db, user.id);
      setMergeLinks(data);
      // setLoading(false);
      setLoadingCount(1);
    }
  };

  const showError = (toastId: Id): void => {
    toast.update(toastId, {
      render: 'Something went wrong. Please try again later',
      type: 'error',
      isLoading: false,
    });
  };

  const onSubmit = async (values: FormikValues): Promise<void> => {
    const toastId = toast.loading('Creating group');
    setDataLoading(true);
    try {
      values.userId = user?.id || '';
      values.createdAt = serverTimestamp();
      const response = await saveRecord(db, COLLECTION_NAME.campaign, values);

      if (response) {
        toast.update(toastId, {
          render: 'Group created successfully',
          type: 'success',
          isLoading: false,
        });

        handleClose();
        resetForm();
        if (campaigns.length < 1) {
          setLoading(true);
          void reloadCampaigns().then(() => {
            setLoading(false);
          });
        } else {
          void reloadCampaigns();
        }
      } else {
        showError(toastId);
      }
    } catch (error) {
      showError(toastId);
    } finally {
      setDataLoading(false);
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 2000);
    }
  };

  const { handleSubmit, handleChange, errors, values, setFieldValue, resetForm } = useFormik({
    initialValues: ADD_CAMPAIGN,
    validationSchema: ADD_CAMPAIGN_SCHEMA,
    onSubmit,
  });

  const loadingIndicator = (): React.ReactElement => (
    <div className={styles.loadingWrapper}>
      <Loading size={20} />
    </div>
  );

  const linkFilter = (option: FilterOptionOption<unknown>, inputValue: string): boolean => {
    const data: MergeLink = option?.data as MergeLink;
    const value = inputValue.toLowerCase().trim();
    if (
      data?.title?.toString().trim().toLowerCase().includes(value) ||
      data?.iOSMobile?.toString().trim().toLowerCase().includes(value) ||
      data?.iOSTablet?.toString().trim().toLowerCase().includes(value) ||
      data?.androidMobile?.toString().trim().toLowerCase().includes(value) ||
      data?.androidTablet?.toString().trim().toLowerCase().includes(value) ||
      data?.huaweiMobile?.toString().trim().toLowerCase().includes(value) ||
      data?.huaweiTablet?.toString().trim().toLowerCase().includes(value) ||
      data?.shortHandle?.toString().trim().toLowerCase().includes(value)
    ) {
      return true;
    }
    return false;
  };

  const getTitle = (data: MergeLink): string => {
    if (data.title) {
      return data.title;
    }
    const { iOSMobile, iOSTablet, androidMobile, androidTablet } = data;
    let title = getTitleFromLink(iOSMobile, iOSTablet, androidMobile, androidTablet);
    if (!title) {
      title = 'N/A';
    }
    return title;
  };

  const customOptions = ({ innerRef, innerProps, data, label }): React.ReactElement => (
    <div ref={innerRef} {...innerProps} className={styles.optionWrapper}>
      <h6>{label}</h6>
      <p>{`mrg.to/${data.shortHandle}`}</p>
    </div>
  );

  const onSelectChange = (newValue: MultiValue<unknown>): void => {
    const values = newValue.map((link: MergeLink) => link.id);
    void setFieldValue('links', values);
  };

  return (
    <ModalScreen open={open} height={'800px'} headingText={'Folder / Group'} onSubmitForm={handleSubmit} handleClose={handleClose}>
      <Grid container className={styles.formContainer}>
        <Text
          text={'Manage your links in custom folders to track the effort of your groups.'}
          className={styles.label}
          variant={'subtitle1'}
        />
        <Grid className={styles.inputWrapper}>
          <AccordianComponent ariaControls='panel1bh-content' id='panel1bh-header' labelText={'Step 1:  Name your first folder'}>
            <TextFieldBox
              name='folderName'
              placeholder='Folder Name'
              labelCheck={true}
              fullWidth={false}
              className={styles.inputTextStyle}
              label='Folder Name'
              autoComplete='off'
              value={values.folderName}
              onChange={handleChange}
              error={errors.folderName !== undefined}
              helperText={errors.folderName}
              disabled={dataLoading}
            />
          </AccordianComponent>
          {!isMobile && (
            <Grid className={styles.fieldAdorment}>
              <FieldInputAdornment error={errors.folderName} />
            </Grid>
          )}
        </Grid>
        <Grid className={styles.inputWrapper}>
          <AccordianComponent ariaControls='panel1bh-content' id='panel1bh-header' labelText={'Step 2:  Add links to your folder'}>
            <Select
              isMulti
              isSearchable
              name='links'
              isDisabled={dataLoading}
              options={selectLinks}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: base => ({ ...base, zIndex: 9999 }),
                control: baseStyles => ({
                  ...baseStyles,
                  borderRadius: '8px',
                  zIndex: 9999,
                  borderColor: errors?.links ? '#ec321f' : '#c7c7c7',
                  borderWidth: 2,
                }),
              }}
              placeholder='Select Links'
              isLoading={loading}
              filterOption={linkFilter}
              onChange={onSelectChange}
              components={{
                LoadingIndicator: loadingIndicator,
                Option: customOptions,
              }}
            />
            {errors.links && <p className={styles.error}>{errors.links}</p>}
          </AccordianComponent>
          {!isMobile && (
            <Grid className={styles.fieldAdorment}>
              <FieldInputAdornment error={errors.links} />
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} sm={12} className={styles.footerCotainer}>
          <Box className={styles.footerWrapper}>
            <Text text={'Ready to crate the folder and track your (first) group?'} className={styles.footerLabel} variant={'subtitle1'} />
            <Box className={styles.footerButtonWrapper}>
              <ActionButton type='button' onClick={handleClose} buttonLabel={'Cancel'} variant={'text'} startIcon={<CloseIcon />} />
              <ActionButton loading={dataLoading} type='submit' buttonLabel={'Create'} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ModalScreen>
  );
};

export default CreateCampaignModal;
