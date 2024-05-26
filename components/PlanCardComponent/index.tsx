/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';

import { Grid } from '@mui/material';
// import { Id, toast } from 'react-toastify';

import PlanCard from '@components/PlanCard';
import { useAuth } from '@context/AuthContext';
import { valuesFilter } from 'services/plans';
import styles from './planCardComponent.module.scss';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@config/firebase';
import Carousel from '@components/Carousel';
import { saveRecord, updateRecord } from '@utils/firebase-methods/database';
import { COLLECTION_NAME } from '@utils/FirebaseConstants';
import { CardDetails } from '@utils/firebase-interfaces';

interface PaddleWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Paddle: any;
  dataLayer: any;
}

export type { PaddleWindow };

declare const window: PaddleWindow;

interface IPlanCardComponent {
  choosePlan?: string;
}

const PlanCardComponent: React.FC<IPlanCardComponent> = ({ choosePlan }) => {
  const { user, userPlan, userActivePlan, plans, isMobile } = useAuth();
  // const { isMobile } = useProtected();

  // const [toastId, setToastId] = useState<Id | null>(null);
  const [fromPaddle, setFromPaddle] = useState<boolean>(false);
  const [fromBackend, setFromBackend] = useState<boolean>(false);

  useEffect(() => {
    if (fromBackend && fromPaddle) {
      // if (toastId) {
      //   toast.update(toastId, {
      //     render: 'Your payment was successfull',
      //     type: 'success',
      //     isLoading: false,
      //   });
      // }
      setTimeout(() => {
        window.location.replace('/');
      }, 700);
    }
  }, [fromPaddle, fromBackend]);

  const createCustomer = (data: any): void => {
    if (data.name === 'checkout.customer.created' && user) {
      void updateRecord(db, COLLECTION_NAME.user, user.id, {
        customer: data.data.customer,
      });
    }
  };

  const checkoutCompleted = (data: any): void => {
    try {
      if (data.name === 'checkout.completed' && user) {
        const { data: paymentData } = data;
        const { customer, payment } = paymentData;
        if (payment.method_details && payment.method_details.type === 'card') {
          const { card } = payment.method_details;
          const cardDetails: CardDetails = {
            card_type: card.type,
            expiry_date: `${card.expiry_month}/${card.expiry_year}`,
            id: '',
            last_four_digits: card.last4,
            payment_method: 'card',
            subscription_id: '',
            paddle_user_id: customer.id,
          };
          void saveRecord(db, COLLECTION_NAME.cardDetails, cardDetails);
          setFromPaddle(true);
        } else if (payment.method_details && payment.method_details.type === 'paypal') {
          const { type } = payment.method_details;
          const cardDetails: CardDetails = {
            card_type: type,
            expiry_date: '',
            id: '',
            last_four_digits: '',
            payment_method: type,
            subscription_id: '',
            paddle_user_id: customer.id,
          };
          void saveRecord(db, COLLECTION_NAME.cardDetails, cardDetails);
          setFromPaddle(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const paddleScript = document.createElement('script');
    paddleScript.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    paddleScript.async = true;
    if (user) {
      paddleScript.onload = () => {
        if (process.env.NEXT_PUBLIC_WEB_ENV !== 'prod') {
          window.Paddle.Environment.set('sandbox');
        }
        const paddleCustomer = {
          email: user.email,
          id: user.customer?.id || '',
        };
        window.Paddle.Setup({
          seller: Number(
            process.env.NEXT_PUBLIC_WEB_ENV === 'prod' ? process.env.NEXT_PUBLIC_PROD_VENDOR_ID : process.env.NEXT_PUBLIC_DEV_VENDOR_ID
          ),

          pwAuth: Number(
            process.env.NEXT_PUBLIC_WEB_ENV === 'prod' ? process.env.NEXT_PUBLIC_PROD_AUTH_CODE : process.env.NEXT_PUBLIC_DEV_AUTH_CODE
          ),
          pwCustomer: paddleCustomer,
          eventCallback: (data: any) => {
            if (data.name === 'checkout.customer.created') {
              createCustomer(data);
            } else if (data.name === 'checkout.completed') {
              checkoutCompleted(data);
            }
            if (data.name === 'checkout.loaded' || data.name === 'checkout.customer.created' || data.name === 'checkout.completed') {
              const dataLayerInfo = {
                event: data.name,
                ecommerce: {
                  transaction_id: data.data?.transaction_id,
                  affiliation: data.name,
                  value: data.data?.recurring_totals?.total,
                  currency: data.data?.currency_code,
                  items: data.data?.items,
                  customer_id: data.data?.customer?.id,
                  customer_email: data.data?.customer?.email,
                },
              };
              window.dataLayer = window.dataLayer || [];
              if (window.dataLayer) {
                window.dataLayer?.push(dataLayerInfo);
              }
            }
          },
        });
      };
      document.body.appendChild(paddleScript);
    }

    const userPlansCollection = collection(db, 'userPlans');
    const userPlanQuery = query(userPlansCollection, where('userId', '==', user?.id || ''));

    const unsubsribe = onSnapshot(userPlanQuery, querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data) {
          setFromBackend(true);
        }
      });
    });

    return () => {
      paddleScript.onload = null;
      unsubsribe();
    };
  }, [user]);

  const slides = valuesFilter(
    plans?.filter(v => (choosePlan === 'monthly' ? v.planPeriod === 'monthly' : v.planPeriod === 'yearly' || v.price === 0))
  ).map((value, index) => (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      key={1 + index}
      sx={{
        padding: '10px !important',
        height: '100%',
      }}>
      <PlanCard key={1 + index} {...value} user={user} userPlan={userPlan} userActivePlan={userActivePlan} />
    </Grid>
  ));

  return (
    <Grid container spacing={3} className={styles.container}>
      {isMobile ? (
        <Carousel Component={slides} count={slides.length} />
      ) : (
        <>
          {valuesFilter(
            plans?.filter(v => (choosePlan === 'monthly' ? v.planPeriod === 'monthly' : v.planPeriod === 'yearly' || v.price === 0))
          ).map((value, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={1 + index}
              sx={{
                padding: '10px !important',
                height: 'none',
              }}>
              <PlanCard key={1 + index} {...value} user={user} userPlan={userPlan} userActivePlan={userActivePlan} />
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
};

export default PlanCardComponent;
