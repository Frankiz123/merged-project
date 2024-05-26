import React, { createContext, useContext, useEffect, useState } from 'react';

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  User as FirebaseUser,
  updateProfile,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { useMediaQuery } from '@mui/material';
import moment from 'moment';

import { auth, db, googleProvider } from '@config/firebase';
import { AuthContextInterface } from '@interfaces/authContextInterface';
import { MergeUser } from '@utils/firebase-interfaces';
import { saveRecordWithId, updateRecord, getuniqueId, saveInvitation } from '@utils/firebase-methods/database';
import { COLLECTION_NAME } from '@utils/FirebaseConstants';
import { fetchAllCollections, fetchSingleCollection } from '@utils/firebase-methods/fetchData';
import { IPlansData, UserPlan } from '@interfaces/plans';
import LoaderComponent from '@components/Loader';

interface AuthContextProviderInterface {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextInterface>({
  isLoading: false,
  isMobile: false,
  user: undefined,
  open: false,
  plans: [],
  userPlan: undefined,
  userActivePlan: undefined,
  trialDays: 0,
  reloadPlans: async () => {},
  signUp: async () => {
    return await Promise.reject(new Error('function implementation not found'));
  },
  logIn: async () => {
    return await Promise.reject(new Error('function implementation not found'));
  },
  logOut: async () => {
    await Promise.reject(new Error('function implementation not found'));
  },
  updateUser: _value => {},
  googleSignIn: async () => {
    return await Promise.reject(new Error('function implementation not found'));
  },
  passwordReset: async () => {
    await Promise.reject(new Error('function implementation not found'));
  },
  // sendConfirmationEmail: async () => {
  //   await Promise.reject(new Error('function implementation not found'));
  // },
  reloadUser: async () => {},
  handleAppBar: (_val: boolean): void => {},
  handleTrialDays: (_val: number): void => {},
});

export const useAuth = (): AuthContextInterface => useContext<AuthContextInterface>(AuthContext);

export const AuthContextProvider: React.FC<AuthContextProviderInterface> = ({ children }) => {
  const isMobile = useMediaQuery('(max-width:899px)');

  const [user, setUser] = useState<MergeUser | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(!isMobile);

  const [isSignUp, setIsSignup] = useState<boolean>(false);
  const [plans, setPlans] = useState<IPlansData[]>([]);
  const [userPlan, setUserPlan] = useState<UserPlan | undefined>();
  const [userActivePlan, setUserActivePlan] = useState<IPlansData | undefined>(undefined);
  const [trialDays, setTrialDays] = useState<number>(0);

  useEffect(() => {
    if (isMobile) {
      setOpen(!isMobile);
    } else {
      const storedState = localStorage.getItem('drawerState');
      setOpen(storedState === 'open');
    }
  }, [isMobile]);

  useEffect(() => {
    void loadPlans();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser) => {
      if (!isSignUp) {
        if (auth.currentUser && firebaseUser) {
          void getUserFirebaseData(firebaseUser.uid);
        } else {
          resetUser();
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, [isSignUp]);

  useEffect(() => {
    if (user && plans) {
      if (user.userPlanId) {
        const setPlan = async (): Promise<void> => {
          const userPlanResponse: UserPlan = (await fetchSingleCollection(db, COLLECTION_NAME.userPlan, user.userPlanId)) as UserPlan;
          if (userPlanResponse) {
            setUserPlan(userPlanResponse);
            const cycleEnds = moment(userPlanResponse?.cycleEndedAt.seconds * 1000);
            const currentTime = moment();
            if (currentTime.isAfter(cycleEnds)) {
              userPlanResponse.cycleCreatedAt = userPlanResponse.cycleEndedAt;
              const nextCycleDate = new Date(cycleEnds.valueOf());
              nextCycleDate.setMonth(nextCycleDate.getMonth() + 1);
              userPlanResponse.cycleEndedAt = Timestamp.fromDate(nextCycleDate);
              await updateRecord(db, COLLECTION_NAME.userPlan, userPlanResponse.id, userPlanResponse);
              setUserPlan(userPlanResponse);
            }
            const p = plans.find((plan: IPlansData) => plan.id === userPlanResponse.planId);
            if (p) {
              setUserActivePlan(p);
            }
            setLoading(false);
          } else {
            setLoading(false);
          }
        };
        void setPlan();
      } else {
        setLoading(false);
      }
    }
  }, [user, plans]);

  // const sendConfirmationEmail = async (): Promise<void> => {
  //   if (auth && auth.currentUser && !auth.currentUser.emailVerified) {
  //     sendEmailVerification(auth.currentUser)
  //       .then(_result => {
  //         void Swal.fire({
  //           icon: 'success',
  //           title: 'VERIFICATION',
  //           html: `A verification email has been sent to your email address, <b>${auth.currentUser?.email}</b>, please verify your email to use the features.`,
  //         });
  //       })
  //       .catch(_err => {
  //         void Swal.fire({
  //           icon: 'error',
  //           title: 'VERIFICATION',
  //           html: `Something went wrong. Please try again later.`,
  //         });
  //       });
  //   }
  // };

  const updateUser = (value: MergeUser): void => {
    value.emailVerified = auth?.currentUser?.emailVerified || false;
    setUser(value);
  };

  const getUserFirebaseData = async (uid: string): Promise<void> => {
    const userResponse = await fetchSingleCollection(db, COLLECTION_NAME.user, uid);
    if (userResponse) {
      if (!userResponse?.invitationLink) {
        userResponse.invitationLink = await getuniqueId(db, 'invitation');
        void updateRecord(db, COLLECTION_NAME.user, uid, userResponse);
      }
      userResponse.emailVerified = auth?.currentUser?.emailVerified || false;
      setUser(userResponse);
    } else {
      resetUser();
    }
  };

  const resetUser = (): void => {
    setLoading(false);
    void auth?.signOut();
    setUser(undefined);
    setUserPlan(undefined);
    setUserActivePlan(undefined);
  };

  const loadPlans = async (): Promise<void> => {
    fetchAllCollections(db, COLLECTION_NAME.plans)
      .then(res => {
        setPlans(res.sort((a: IPlansData, b: IPlansData) => a.price - b.price));
      })
      .catch(e => e);
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    userInvitationToken?: string
  ): Promise<UserCredential | undefined | string | boolean | Error> => {
    setIsSignup(true);
    return await createUserWithEmailAndPassword(auth, email, password)
      .then(async result => {
        if (result && result.user) {
          const data: MergeUser = {
            id: result?.user.uid.toString(),
            createdAt: Timestamp.fromDate(new Date(result?.user.metadata.creationTime ?? '')),
            email,
            fullName: name,
            emailVerified: result.user.emailVerified,
            photo: '',
            zip: '',
            vat: '',
            city: '',
            adress: '',
            country: '',
            accountLanguage: '',
            additionalAdress: '',
            organizationName: '',
            twoFactorEmail: false,
            userPlanId: '',
            invitationLink: '',
            paymentTries: 0,
            weeklyReport: true,
            monthlyReport: false,
          };

          data.invitationLink = await getuniqueId(db, 'invitation');

          await updateProfile(result?.user, {
            displayName: name,
          });

          const response = await saveRecordWithId(db, COLLECTION_NAME.user, data);

          if (response) {
            if (userInvitationToken) {
              await saveInvitation(result?.user.uid.toString(), userInvitationToken, data.id, COLLECTION_NAME.invitations);
            }
            setUser(data);
            // void sendConfirmationEmail();
            return true;
          }

          void auth.currentUser?.delete();
          return 'Something went wrong. Please try again later.';
        } else {
          return 'Something went wrong. Please try again later.';
        }
      })
      .catch(error => error)
      .finally(() => {
        setIsSignup(false);
      });
  };

  const logIn = async (email: string, password: string): Promise<UserCredential> => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const googleSignIn = async (invitationToken: string): Promise<UserCredential> => {
    setIsSignup(true);
    return await signInWithPopup(auth, googleProvider)
      .then(async result => {
        if (result && result.user) {
          const uid = result.user.uid.toString();
          const userResponse: MergeUser = await fetchSingleCollection(db, COLLECTION_NAME.user, uid);
          if (userResponse) {
            userResponse.createdAt = Timestamp.fromDate(new Date(result?.user.metadata.creationTime ?? ''));
            userResponse.email = result.user.email || '';
            userResponse.fullName = result.user.displayName || '';
            userResponse.emailVerified = result.user.emailVerified;
            void updateRecord(db, COLLECTION_NAME.user, uid, userResponse);
            return true;
          }
          const data: MergeUser = {
            id: result.user.uid.toString(),
            createdAt: Timestamp.fromDate(new Date(result?.user.metadata.creationTime ?? '')),
            email: result.user.email || '',
            fullName: result.user.displayName || '',
            emailVerified: result.user.emailVerified,
            photo: result.user.photoURL || '',
            zip: '',
            vat: '',
            city: '',
            adress: '',
            country: '',
            twoFactorEmail: false,
            accountLanguage: '',
            additionalAdress: '',
            organizationName: '',
            userPlanId: '',
            invitationLink: '',
            paymentTries: 0,
            weeklyReport: true,
            monthlyReport: false,
          };

          if (!data.invitationLink) {
            data.invitationLink = await getuniqueId(db, 'invitation');
          }

          if (invitationToken) {
            await saveInvitation(result?.user.uid.toString(), invitationToken, data.id, COLLECTION_NAME.invitations);
          }

          const response = await saveRecordWithId(db, COLLECTION_NAME.user, data);

          if (response) {
            return true;
          }
          void auth.currentUser?.delete();
          return 'Something went wrong. Please try again later.';
        } else {
          return Error('Something went wrong. Please try again later.');
        }
      })
      .catch(error => error)
      .finally(() => {
        setIsSignup(false);
      });
  };

  const logOut = async (): Promise<void> => {
    resetUser();
    void signOut(auth);
    void auth?.signOut();
  };

  const passwordReset = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  };

  const handleAppBar = (val: boolean): void => {
    setOpen(val);
  };

  const handleTrialDays = (val: number): void => {
    setTrialDays(val);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading: loading,
        isMobile,
        userPlan,
        open,
        userActivePlan,
        user,
        plans,
        trialDays,
        reloadPlans: loadPlans,
        updateUser,
        signUp,
        logIn,
        googleSignIn,
        logOut,
        passwordReset,
        reloadUser: getUserFirebaseData,
        handleAppBar,
        handleTrialDays,
      }}>
      {loading ? <LoaderComponent loading={loading} /> : children}
    </AuthContext.Provider>
  );
};
