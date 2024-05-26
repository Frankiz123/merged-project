import React, { useEffect, useState } from 'react';

import { FormikValues, useFormik } from 'formik';
import { Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Select, { MultiValue } from 'react-select';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';
import { serverTimestamp } from 'firebase/firestore';
import { Id, toast } from 'react-toastify';

import ActionButton from '@components/ActionButton';
import TextFieldBox from '@components/TextFieldBox';
import { ADD_CAMPAIGN_SCHEMA } from '@utils/yup-validations/validations';
import { getUserLinks, updateRecord } from '@utils/firebase-methods/database';
import { db } from '@config/firebase';
import { COLLECTION_NAME } from '@utils/FirebaseConstants';
import { useProtected } from '@context/ProtectedContext';
import { useAuth } from '@context/AuthContext';
import { MergeLink, MergedCampaign } from '@utils/firebase-interfaces';
import { getTitleFromLink } from '@utils/links';
import Loading from '@components/Loading';

import styles from './editcampaignform.module.scss';

interface LinkSelect extends MergeLink {
  value: string;
  label: string;
}

interface EditCampaignProps {
  campaign: MergedCampaign | undefined;
  onEditClick: () => void;
}

const EditCampaign: React.FC<EditCampaignProps> = ({ onEditClick = (_id = '') => {}, campaign }) => {
  const { user } = useAuth();
  const { links, loading, setMergeLinks, reloadCampaigns } = useProtected();
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [loadingCount, setLoadingCount] = useState<number>(0);
  const [selectLinks, setSelectLinks] = useState<LinkSelect[]>([]);

  const EDIT_CAMPAIGN = {
    folderName: campaign?.folderName,
    links: campaign?.links.map(link => link.id),
    userId: campaign?.userId,
    createdAt: campaign?.createdAt,
  };

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
      autoClose: 3000,
    });
  };

  const onSubmit = async (values: FormikValues): Promise<void> => {
    const toastId = toast.loading('Updating group');
    try {
      setDataLoading(true);
      values.createdAt = serverTimestamp();
      if (campaign) {
        const response = await updateRecord(db, COLLECTION_NAME.campaign, campaign?.id, values);
        if (response) {
          resetForm();
          onEditClick();
          void reloadCampaigns();
          toast.update(toastId, {
            render: 'Group updated successfully',
            type: 'success',
            isLoading: false,
            autoClose: 3000,
          });
        } else {
          showError(toastId);
        }
      }
    } catch (error) {
      showError(toastId);
    } finally {
      setDataLoading(false);
    }
  };

  const { handleSubmit, handleChange, errors, values, setFieldValue, resetForm } = useFormik({
    initialValues: EDIT_CAMPAIGN,
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

  const handleClose = (): void => {
    onEditClick('cancel');
  };

  const filteredLinks =
    campaign &&
    links.filter(link => {
      const linkIdsInCampaign = campaign.links.map(campaignLink => campaignLink.id);
      return linkIdsInCampaign.includes(link.id);
    });

  filteredLinks &&
    filteredLinks.forEach(link => {
      const selectLink = link as LinkSelect;
      selectLink.value = link.id;
      selectLink.label = getTitle(link);
    });

  return (
    <Grid container className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <Grid className={styles.inputWrapper}>
          <TextFieldBox
            name='folderName'
            placeholder='Folder Name'
            labelCheck={true}
            fullWidth={false}
            className={styles.inputTextStyle}
            label=''
            autoComplete='off'
            value={values.folderName}
            onChange={handleChange}
            error={errors.folderName !== undefined}
            helperText={errors.folderName}
            disabled={dataLoading}
          />
        </Grid>
        <Grid className={styles.inputWrapper}>
          <Select
            isMulti
            isSearchable
            name='links'
            isDisabled={dataLoading}
            options={selectLinks}
            defaultValue={filteredLinks}
            styles={{
              control: baseStyles => ({
                ...baseStyles,
                borderRadius: '8px',
                borderColor: errors?.links ? '#ec321f' : '#c7c7c7',
                borderWidth: 2,
                width: '340px',
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
        </Grid>
        <Grid item xs={12} sm={12} className={styles.footerCotainer}>
          <ActionButton type='button' onClick={handleClose} buttonLabel={'Cancel'} variant={'text'} startIcon={<CloseIcon />} />
          <ActionButton loading={loading} type='submit' buttonLabel={'Save'} />
        </Grid>
      </form>
    </Grid>
  );
};

export default EditCampaign;
