import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { Box, Grid } from '@mui/material';
import dynamic from 'next/dynamic';

import { toast } from 'react-toastify';

import { MergeLink } from '@utils/firebase-interfaces';
import Text from '@components/Text';
import DeviceStats from '@components/DeviceStats';
import LinkItem from '../../ListItem';
import Loading from '@components/Loading';
import { useProtected } from '@context/ProtectedContext';
import { axiosDelete } from 'services/axios_get';
import { useAuth } from '@context/AuthContext';
import IconButton from '@components/IconButton';

import styles from './links.module.scss';
import DeleteModal from '@components/DeleteModal';

const ListItemDetail = dynamic(async () => await import('../../ListItemDetail'));

interface LinksMainProps {
  links: MergeLink[];
}

const LinksMain: React.FC<LinksMainProps> = ({ links }) => {
  const router = useRouter();

  const linkId = router?.query?.linkId || '';

  const { user, isMobile } = useAuth();
  const { reloadLinks, reloadCampaigns, allLinksStats } = useProtected();
  const [opneModal, setOpneModal] = useState(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [currentLink, setCurrentLink] = useState<MergeLink | null>(null);
  const [currentLinks, setCurrentLinks] = useState<string[]>([]);
  const [isEdit, setisEdit] = useState<boolean>(false);
  const [isPerforming, setIsPerforming] = useState<boolean>(false);
  const [userLinks, setUserLinks] = useState<MergeLink[]>([]);

  useEffect(() => {
    if (links && links.length > 0) {
      if (isPerforming) {
        setUserLinks([...links].sort((a, b) => b.totalClicks - a.totalClicks));
      } else {
        setUserLinks([...links]);
      }
    }
  }, [links, isPerforming]);

  useEffect(() => {
    if (userLinks && userLinks.length > 0) {
      updateLink(userLinks[0]);
      setisEdit(false);
      if (linkId) {
        const link = links.find((l: MergeLink) => l.id === linkId);
        if (link) {
          setCurrentLink(link);
        }
      }
    }
  }, [userLinks, linkId]);

  const updateLink = (link: MergeLink): void => {
    const links: string[] = [];
    if (link.webUrl) {
      links.push(link.webUrl);
    } else {
      if (link.iOSMobile) {
        links.push(link.iOSMobile);
      }
      if (link.iOSTablet) {
        links.push(link.iOSTablet);
      }
      if (link.androidMobile) {
        links.push(link.androidMobile);
      }
      if (link.androidTablet) {
        links.push(link.androidTablet);
      }
      if (link.huaweiMobile) {
        links.push(link.huaweiMobile);
      }
      if (link.huaweiTablet) {
        links.push(link.huaweiTablet);
      }
    }
    setCurrentLink(link);
    setCurrentLinks(links);
    setisEdit(false);
  };

  const handleLinkChange = (id: string): void => {
    setCurrentLink(null);
    setCurrentLinks([]);
    setTimeout(() => {
      const link = links.find((l: MergeLink) => l.id === id);
      if (link) {
        updateLink(link);
        setisEdit(false);
      }
    }, 100);
  };

  const handleClose = (): void => {
    setOpneModal(false);
  };
  const onDeleteClick = (): void => {
    setOpneModal(true);
  };

  const deleteLink = (): void => {
    const linkId = currentLink?.id || '';
    const userId = user?.id || '';
    void confirmDelete(linkId, userId);
  };

  const confirmDelete = async (linkId: string, userId: string): Promise<void> => {
    setDataLoading(true);
    const toastId = toast.loading('Deleting link');
    const result = await axiosDelete(`/user/links/${linkId}/${userId}`, {});

    if (result) {
      toast.update(toastId, {
        render: 'Link deleted successfully',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      void reloadLinks();
      void reloadCampaigns();
      setOpneModal(false);
      setDataLoading(false);
    } else {
      setOpneModal(false);
      setDataLoading(false);
      toast.update(toastId, {
        render: 'An error occured during link deletion',
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
      setisEdit(currentLink?.id !== id || !isEdit);
    }
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

  const setPerforming = (): void => {
    setIsPerforming(p => !p);
  };

  return (
    <>
      <Box className={styles.wrapper}>
        {!isMobile && <Text text='Links' className={styles.heading} />}
        <DeviceStats
          isoFlagCode={allLinksStats?.flagCode}
          topLocation={allLinksStats?.topCountry}
          totalClicks={allLinksStats?.totalClicks}
          iosDevices={allLinksStats?.iosPercentage}
          androidDevices={allLinksStats?.androidPercentage}
        />
        <Grid container className={[styles.row, styles.marginTop].join(' ')}>
          <Grid item xs={12} sm={12} md={4} className={styles.userLinkWrapper}>
            <Box className={styles.countWrapper}>
              <Text text='Your links' variant='subtitle1' />
              <Text text={`${userLinks.length}`} className={styles.linksCount} />
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
              {userLinks.map((link: MergeLink) => {
                const { webUrl, iOSMobile, iOSTablet, huaweiMobile, huaweiTablet, androidMobile, androidTablet } = link;
                const linksUrl = [webUrl, iOSMobile, iOSTablet, huaweiMobile, huaweiTablet, androidMobile, androidTablet].filter(
                  value => value.length > 0
                );
                return (
                  <LinkItem
                    shortUrl={link.shortUrl}
                    descriptionName={link.title}
                    key={link.id}
                    id={link.id}
                    createdAt={link.createdAt}
                    primaryText={`${link.domain}/`}
                    secondaryText={link.shortHandle}
                    totalClicks={link.totalClicks}
                    currentLinkId={currentLink?.id || ''}
                    onLinkChange={handleLinkChange}
                    currentLink={currentLink}
                    links={linksUrl}
                    isEdit={isEdit}
                    onEditClick={onEditClick}
                    onDeleteClick={onDeleteClick}
                  />
                );
              })}
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={8} className={styles.detailContainer}>
            {!isMobile && <Box className={styles.editRow}>{showEditButton()}</Box>}
            {!isMobile && (
              <Box className={[styles.list, styles.itemDetail].join(' ')}>
                {currentLink ? (
                  <ListItemDetail
                    cardDescriptionName={currentLink.title}
                    id={currentLink.id}
                    name={'links'}
                    totalClicks={currentLink.totalClicks}
                    createdAt={currentLink.createdAt}
                    primaryText={`${currentLink.domain}/`}
                    secondaryText={currentLink.shortHandle}
                    shorlUrl={currentLink.shortUrl}
                    links={currentLinks}
                    isEdit={isEdit}
                    onEditClick={onEditClick}
                    link={currentLink}
                  />
                ) : (
                  <Loading />
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
      <DeleteModal open={opneModal} handleClose={handleClose} deleteLink={deleteLink} loading={dataLoading} removeText='link' />
    </>
  );
};

export default LinksMain;
