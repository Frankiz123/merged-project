import React, { useEffect, useState } from 'react';

import { Box, Grid } from '@mui/material';
import dynamic from 'next/dynamic';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { toast } from 'react-toastify';

import { deleteSingleRecordsFirestore } from '@utils/firebase-methods/database';
import { MergedCampaign } from '@utils/firebase-interfaces';
import { db } from '@config/firebase';
import Text from '@components/Text';
import DeviceStats from '@components/DeviceStats';
import ListItem from '../../ListItem';
import Loading from '@components/Loading';
import ActionButton from '@components/ActionButton';
import { useProtected } from '@context/ProtectedContext';
import { useAuth } from '@context/AuthContext';
import IconButton from '@components/IconButton';
import DeleteModal from '@components/DeleteModal';

import styles from './campaign.module.scss';

const ListItemDetail = dynamic(async () => await import('../../ListItemDetail/index'));

interface CampaignMainProps {
  campagins: MergedCampaign[];
  handleOpen: () => void;
}

const CampaignMain: React.FC<CampaignMainProps> = ({ campagins, handleOpen }) => {
  const { reloadCampaigns, allCampaignsStats, reloadLinks, setLoading } = useProtected();
  const { isMobile } = useAuth();
  const [opneModal, setOpneModal] = useState(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [currentCampaign, setCurrentCampaign] = useState<MergedCampaign | null>(null);
  const [isEdit, setisEdit] = useState<boolean>(false);
  const [isPerforming, setIsPerforming] = useState<boolean>(false);
  const [userCampaigns, setUserCampaigns] = useState<MergedCampaign[]>([]);

  useEffect(() => {
    if (campagins && campagins.length > 0) {
      if (isPerforming) {
        setUserCampaigns([...campagins].sort((a, b) => b.totalClicks - a.totalClicks));
      } else {
        setUserCampaigns([...campagins]);
      }
    }
  }, [campagins, isPerforming]);

  useEffect(() => {
    if (userCampaigns && userCampaigns.length > 0) {
      setCurrentCampaign(userCampaigns[0]);
      setisEdit(false);
    }
  }, [userCampaigns]);

  const updateCampaign = (compagin: MergedCampaign): void => {
    setCurrentCampaign(compagin);
  };

  const handleCampaignChange = (id: string): void => {
    setCurrentCampaign(null);
    setTimeout(() => {
      const compagin = campagins.find((l: MergedCampaign) => l.id === id);
      if (compagin) {
        updateCampaign(compagin);
      }
    }, 300);
  };

  const handleClose = (): void => {
    setOpneModal(false);
  };

  const onDeleteClick = (): void => {
    setOpneModal(true);
  };
  const deleteLink = (): void => {
    const id = currentCampaign?.id || '';
    void confirmDelete(id);
  };

  const confirmDelete = async (id: string): Promise<void> => {
    setDataLoading(true);
    const toastId = toast.loading('Deleting group');
    const del = await deleteSingleRecordsFirestore(db, 'campaigns', id);
    void reloadCampaigns();
    if (del) {
      setOpneModal(false);

      toast.update(toastId, {
        render: 'Group deleted successfully',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      if (campagins.length === 1) {
        setLoading(true);
        void reloadCampaigns().then(() => {
          setLoading(false);
        });
      } else {
        void reloadCampaigns();
      }

      void reloadLinks();
      setDataLoading(false);
    } else {
      setOpneModal(false);
      setDataLoading(false);
      toast.update(toastId, {
        render: 'An error occured during group deletion',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const onEditClick = (id = ''): void => {
    if (id === 'cancel') {
      setisEdit(false);
    } else {
      setisEdit(currentCampaign?.id !== id || !isEdit);
    }
  };

  const onAddCampaignClick = (): void => {
    handleOpen();
  };

  const setPerforming = (): void => {
    setIsPerforming(p => !p);
  };

  const showEditButton = (): React.ReactChild => (
    <IconButton
      onClick={onEditClick}
      Icon={
        <div className={styles.imageIcon}>
          <img src='images/edit1.svg' />
        </div>
      }
    />
  );

  return (
    <>
      <Box className={styles.wrapper}>
        {!isMobile && <Text text='Groups' className={styles.heading} />}
        <DeviceStats
          isoFlagCode={allCampaignsStats?.flagCode}
          topLocation={allCampaignsStats?.topCountry}
          totalClicks={allCampaignsStats?.totalClicks}
          iosDevices={allCampaignsStats?.iosPercentage}
          androidDevices={allCampaignsStats?.androidPercentage}
        />
        <Grid container className={[styles.row, styles.marginTop].join(' ')}>
          <Grid item xs={12} sm={12} md={4} className={styles.userLinkWrapper}>
            <Box className={styles.countWrapper}>
              <Text text='Your groups' variant='subtitle1' />
              <Text text={`${userCampaigns.length}`} variant='subtitle1' className={styles.linksCount} />
            </Box>
            <Box className={styles.filerWrapper}>
              <Text text='Filter' variant='subtitle1' className={styles.filter} />
              <input id={'performing'} type='checkbox' value={'performing'} checked={isPerforming} onChange={setPerforming} />
              <label className={styles.label} htmlFor={'performing'}>
                Top Performing
              </label>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={8}></Grid>
        </Grid>
        <Grid container className={styles.listWrapper}>
          <Grid item xs={12} sm={12} md={4} className={styles.listContaier}>
            <Box className={styles.row}>
              <ActionButton
                buttonLabel='Add Group'
                onClick={onAddCampaignClick}
                className={styles.addCampaignButton}
                startIcon={<AddCircleOutlineIcon />}
              />
              {!isMobile && (
                <IconButton
                  onClick={onDeleteClick}
                  Icon={
                    <div className={styles.imageIcon}>
                      <img src='images/delete.svg' />
                    </div>
                  }
                />
              )}
            </Box>
            <Box className={styles.list}>
              {userCampaigns.map((campaign: MergedCampaign) => (
                <ListItem
                  shortUrl=''
                  descriptionName={campaign.folderName}
                  key={campaign.id}
                  id={campaign.id}
                  createdAt={campaign.createdAt}
                  primaryText={`${campaign.links.length} links`}
                  secondaryText={''}
                  totalClicks={campaign.totalClicks}
                  currentLinkId={currentCampaign?.id || ''}
                  onLinkChange={handleCampaignChange}
                  links={campaign.links}
                  currentCampaign={currentCampaign}
                  isEdit={isEdit}
                  onEditClick={onEditClick}
                  onDeleteClick={onDeleteClick}
                />
              ))}
            </Box>
          </Grid>
          {!isMobile && (
            <Grid item xs={12} sm={12} md={8} className={styles.detailContainer}>
              <Box className={styles.editRow}>{showEditButton()}</Box>
              <Box className={[styles.list, styles.itemDetail].join(' ')}>
                {currentCampaign ? (
                  <ListItemDetail
                    cardDescriptionName={currentCampaign.folderName}
                    id={currentCampaign.id}
                    totalClicks={currentCampaign?.totalClicks}
                    createdAt={currentCampaign.createdAt}
                    primaryText={''}
                    secondaryText={`${currentCampaign?.links?.length ?? 0} links`}
                    links={currentCampaign.links}
                    campaign={currentCampaign}
                    isEdit={isEdit}
                    onEditClick={onEditClick}
                    shorlUrl={''}
                  />
                ) : (
                  <Loading />
                )}
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
      <DeleteModal open={opneModal} handleClose={handleClose} deleteLink={deleteLink} loading={dataLoading} removeText='group' />
    </>
  );
};

export default CampaignMain;
