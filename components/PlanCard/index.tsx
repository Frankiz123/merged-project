/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Box, Card, Divider, Chip } from '@mui/material';
// import { toast } from 'react-toastify';

import Text from '@components/Text';
import ActionButton from '@components/ActionButton';
import styles from './planCard.module.scss';
import { CardsDetailProps, IFeatures } from '@interfaces/plans';
import { PaddleWindow } from '@components/PlanCardComponent';
import { axiosPatch } from 'services/axios_get';
import { toast } from 'react-toastify';
import { useAuth } from '@context/AuthContext';
// import { axiosPostRequest } from 'services/axios_get';

// svgIcons
const VectorIcon = '/images/setting/vector.svg';

declare const window: PaddleWindow;

const PlanCard: React.FC<CardsDetailProps> = ({
  id,
  feature,
  price,
  planName,
  planPeriod,
  recommended,
  priceId,
  numberOfUsers,
  numberOfLinks,
  unlimitedLinks,
  numberOfClicks,
  facilities,
  unlimitedClicks,
  description,
  // subscriptionID,
  user,
  userPlan,
  userActivePlan,
}) => {
  const { reloadPlans, trialDays } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);

  const onPlanButton = (): void => {
    if (!user?.userPlanId || !userPlan || !userActivePlan) {
      const itemsList = [{ priceId }];
      const paddleData = {
        planId: id,
        userId: user?.id,
      };
      window.Paddle.Checkout.open({
        settings: {
          displayMode: 'overlay',
          theme: 'light',
          locale: 'en',
        },
        customer: {
          email: user?.email,
        },
        items: itemsList,
        customData: paddleData,
      });
    } else {
      if (trialDays > 0) {
        const toastId = toast.loading('Updating Subscription');
        toast.update(toastId, {
          render: 'You cannot upgrade your package unless your trial period has ended',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
        setLoading(false);
      } else {
        const toastId = toast.loading('Updating Subscription');
        setLoading(true);
        axiosPatch('/user/subscription', {
          subscription_id: userPlan.subscription_id,
          price_id: priceId,
          userId: userPlan.userId,
          planId: id,
        })
          .then((result: any) => {
            if (!result || !result.success) {
              toast.update(toastId, {
                render: 'Something went wrong. Please try again later',
                type: 'error',
                isLoading: false,
                autoClose: 3000,
              });
            } else {
              toast.update(toastId, {
                render: result.message,
                type: 'success',
                isLoading: false,
                autoClose: 3000,
              });
            }
            void reloadPlans();
            setLoading(false);
          })
          .catch(_err => {
            toast.update(toastId, {
              render: 'Something went wrong. Please try again later',
              type: 'error',
              isLoading: false,
              autoClose: 3000,
            });
            setLoading(false);
          });
      }
      //   const toastId = toast.loading('Updating your subscription');
      //   axiosPostRequest('/user/subscription/userUpdate', {
      //     paddle_subscription_id: Number(subscriptionID),
      //     user_subscription_id: userPlan.subscription_id,
      //     planId: id,
      //     userId: user?.id,
      //     userPlanId: userPlan?.id,
      //   })
      //     .then((result: any) => {
      //       if (result && result.success) {
      //         toast.update(toastId, {
      //           render: 'Your subscription has been updated successfully',
      //           type: 'success',
      //           isLoading: false,
      //           autoClose: 3000,
      //         });
      //       } else {
      //         toast.update(toastId, {
      //           render: 'There was an error updating your subscription',
      //           type: 'error',
      //           isLoading: false,
      //           autoClose: 3000,
      //         });
      //       }
      //       setLoading(false);
      //       // window.location.replace('/');
      //     })
      //     .catch(e => {
      //       toast.update(toastId, {
      //         render: 'There was an error updating your subscription',
      //         type: 'error',
      //         isLoading: false,
      //         autoClose: 3000,
      //       });
      //       setLoading(false);
      //     });
    }
    // if (planName === 'Basic') {
    //   axiosPostRequest('/user/subscription/userCancel', {
    //     subscription_id: userPlans.subscription_id,
    //     vendor_id: process.env.NEXT_PUBLIC_VENDOR_ID,
    //     vendor_auth_code: process.env.NEXT_PUBLIC_AUTH_CODE,
    //   })
    //     .then(() => {
    //       updateRecord(db, 'userPlans', userPlans.id, { planId: id })
    //         .then(() => {
    //           window.location.reload();
    //           setLoadPlans(!loadPlans);
    //         })
    //         .catch(e => e);
    //     })
    //     .catch(e => e);
    // } else if (isBasicPlan !== userPlans.planId) {
    //   axiosPostRequest('/user/subscription/userUpdate', {
    //     plan_id: Number(subscriptionID),
    //     subscription_id: userPlans.subscription_id,
    //     vendor_id: process.env.NEXT_PUBLIC_VENDOR_ID,
    //     vendor_auth_code: process.env.NEXT_PUBLIC_AUTH_CODE,
    //   })
    //     .then(() => {
    //       setLoadPlans(!loadPlans);
    //       window.location.reload();
    //     })
    //     .catch(e => e);
    // } else if (isBasicPlan === userPlans.planId) {
    //   window.Paddle.Checkout.open({
    //     product: Number(subscriptionID),
    //     passthrough: {
    //       user_id: user?.id,
    //       planId: id,
    //       vendor_id: process.env.NEXT_PUBLIC_VENDOR_ID,
    //       vendor_auth_code: process.env.NEXT_PUBLIC_AUTH_CODE,
    //     },
    //     email: user?.email,
    //     allowQuantity: false,
    //     disableLogout: true,
    //   });
    // }
  };

  return (
    <Card variant='outlined' className={styles.card}>
      {recommended && <Chip label='RECOMMENDED' className={styles.boxChip} />}
      <Box className={styles.container}>
        <Text text={planName} variant={'h3'} className={styles.title} />
        <Text text={description} variant={'subtitle1'} className={styles.description} />
        <div className={styles.divBoth}>
          <span className={styles.price}>€ {price}</span>
          <span className={styles.time}>/ {price <= 0 ? 'forever' : planPeriod}</span>
        </div>
        <ActionButton
          loaderColor='info'
          showLoader={id !== userPlan?.planId}
          loading={loading || id === userPlan?.planId}
          onClick={onPlanButton}
          className={id === userPlan?.planId ? styles.cardButton : styles.upgradeBtn}
          buttonLabel={!userPlan ? 'Choose plan' : id === userPlan?.planId ? 'Your Plan' : 'Upgrade'}
          variant='text'
        />
        <Text text={facilities} variant={'subtitle1'} className={styles.accessText} />
        <Divider className={styles.dash} />
        <Text text='Workspace' variant={'subtitle1'} className={styles.secondaryHeading} />
        <Text
          text={unlimitedLinks ? `Unlimited links/month` : `Up to ${numberOfLinks} links/month`}
          variant={'subtitle1'}
          className={styles.listItems}
        />
        <Text
          text={unlimitedClicks ? `Unlimited clicks/month` : `Up to ${numberOfClicks} clicks/month`}
          variant={'subtitle1'}
          className={styles.listItems}
        />
        <Text text={`${numberOfUsers} User`} variant={'subtitle1'} className={styles.listItems} />
        <Text text='Feature' variant={'subtitle1'} className={styles.secondaryHeading} />
        {feature?.length > 0 ? (
          feature?.map((item: IFeatures, index) => (
            <Text startIcon={<img src={VectorIcon} />} text={item?.text} variant={'subtitle1'} className={styles.listItems} key={index} />
          ))
        ) : (
          <Text startIcon={<img src={VectorIcon} />} text={'All Features'} variant={'subtitle1'} className={styles.listItems} />
        )}
      </Box>
    </Card>
  );
};
export default PlanCard;
