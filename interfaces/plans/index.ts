import { MergeUser } from '@utils/firebase-interfaces';
import { Timestamp } from 'firebase/firestore';

export interface IPlansData {
  id: string;
  planName: string;
  recommended: boolean;
  planPeriod: string;
  facilities: string;
  description: string;
  feature: IFeatures[];
  subscriptionID: string;
  freePlans: boolean;
  price: number;
  priceId: string;
  unlimitedLinks: boolean;
  unlimitedClicks: boolean;
  numberOfClicks: number;
  numberOfUsers: number;
  numberOfLinks: number;
}

export interface UserPlan {
  createdAt: Timestamp;
  endedAt: Timestamp;
  cycleCreatedAt: Timestamp;
  cycleEndedAt: Timestamp;
  id: string;
  planId: string;
  userId: string;
  subscription_id: string;
  paddle_user_id: string;
  trial_ended: Timestamp;
  trial_starts?: Timestamp;
  currentBillingStarts?: Timestamp;
  currentBillingEnds?: Timestamp;
  firstBilledAt?: Timestamp;
  previousBilledAt?: Timestamp;
  nextBilledAt?: Timestamp;
}

export interface IFeatures {
  key: string;
  text: string;
  value: boolean;
}

export interface CardsDetailProps extends IPlansData {
  user: MergeUser | undefined;
  userPlan: UserPlan | undefined;
  userActivePlan: IPlansData | undefined;
}
