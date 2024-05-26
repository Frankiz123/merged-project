import { UserCredential } from 'firebase/auth';

import { MergeUser } from '@utils/firebase-interfaces';
import { IPlansData, UserPlan } from '@interfaces/plans';

export interface AuthContextInterface {
  isLoading: boolean;
  isMobile: boolean;
  open: boolean;
  user: MergeUser | undefined;
  userPlan: UserPlan | undefined;
  userActivePlan: IPlansData | undefined;
  plans: IPlansData[];
  trialDays: number;
  reloadPlans: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    userInvitationToken?: string
  ) => Promise<UserCredential | undefined | string | boolean | Error>;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
  updateUser: (user: MergeUser) => void;
  googleSignIn: (invitationToken?: string) => Promise<UserCredential>;
  passwordReset: (email: string) => Promise<void>;
  // sendConfirmationEmail: () => Promise<void>;
  reloadUser: (uid: string) => Promise<void>;
  handleAppBar: (val: boolean) => void;
  handleTrialDays: (val: number) => void;
}
