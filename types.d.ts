import { SelectItemProps } from "@mantine/core";

export interface Video {
  caption: string;
  video: {
    asset: {
      _id: string;
      url: string;
    };
  };
  _id: string;
  postedBy: {
    _id: string;
    userName: string;
    image: string;
  };
  likes: {
    postedBy: {
      _id: string;
      userName: string;
      image: string;
    };
  }[];
  comments: {
    comment: string;
    _key: string;
    postedBy: {
      _ref: string;
    };
  }[];
  userId: string;
}

export interface IUser {
  _id: string;
  _type: string;
  userName: string;
  image: string;
}

export interface Fields {
  transactionType: string;
  transID: string;
  transTime: string;
  transAmount: string;
  businessShortCode: string;
  billRefNumber: string;
  invoiceNumber: string;
  orgAccountBalance: string;
  thirdPartyTransID: string;
  msisdn: string;
  firstName: string;
  middleName: string;
  lastName: string;
}

export type Transactions = {
  id: number;
  transactionType: string;
  transID: string;
  transTime: string;
  transAmount: string;
  businessShortCode: string;
  billRefNumber: string;
  invoiceNumber: string;
  orgAccountBalance: string;
  thirdPartyTransID: string;
  msisdn: string;
  firstName: string;
  middleName: string;
  lastName: string;
};

export interface Transaction extends Transactions {
  transction: Transactions;
}

export interface Title {
  title: string;
}

export type Data = {
  data: {};
};

type Links = {
  title: string;
  data: {};
};

type Chevs = {
  expand: boolean;
};

export interface MainLinkProps {
  icon: React.ReactNode;
  right?: React.ReactNode;
  color: string;
  label: string;
  data?: any;
}

export interface Members {
  createdAt?: Date;
  updatedAt?: Date;
  id?: string;
  date: string;
  branchName: string;
  memberId: string;
  firstName: string;
  lastName: string;
  dob: string;
  idPass: string;
  kraPin: string;
  phoneNumber: string;
  gender: string;
  age: string;
  religion: string;
  maritalStatus: string;
  spouseName: string;
  spouseNumber: string;
  postalAddress: string;
  postalCode: string;
  cityTown: string;
  residentialAddress: string;
  emailAddress: string;
  rentedOwned: string;
  landCareAgent: string;
  occupationEmployer: string;
  employerNumber: string;
  businessLocation: string;
  businessAge: string;
  refereeName: string;
  refereeNumber: string;
  communityPosition: string;
  mpesaCode: string;
  membershipAmount: string;
  nameKin: string;
  relationship: string;
  residentialAddressKin: string;
  postalAddressKin: string;
  postalCodeKin: string;
  cityTownKin: string;
  numberKin: string;
  maintained?: boolean;
  group?: boolean;
}

export interface MemberProps extends SelectItemProps {
  color: MantineColor;
  createdAt?: Date;
  updatedAt?: Date;
  id?: string;
  date: string;
  branchName: string;
  memberId: string;
  firstName: string;
  lastName: string;
  dob: string;
  idPass: string;
  kraPin: string;
  phoneNumber: string;
  gender: string;
  age: string;
  religion: string;
  maritalStatus: string;
  spouseName: string;
  spouseNumber: string;
  postalAddress: string;
  postalCode: string;
  cityTown: string;
  residentialAddress: string;
  emailAddress: string;
  rentedOwned: string;
  landCareAgent: string;
  occupationEmployer: string;
  employerNumber: string;
  businessLocation: string;
  businessAge: string;
  refereeName: string;
  refereeNumber: string;
  communityPosition: string;
  mpesaCode: string;
  membershipAmount: string;
  nameKin: string;
  relationship: string;
  residentialAddressKin: string;
  postalAddressKin: string;
  postalCodeKin: string;
  cityTownKin: string;
  numberKin: string;
  maintained: boolean;
  group: boolean;
}

interface Products {
  createdAt?: Date;
  updatedAt?: Date;
  id?: string;
  productId: string;
  productName: string;
  minimumRange: string;
  maximumRange: string;
  interestRate: string;
  frequency: string;
  maximumTenure: string;
  repaymentCycle: string;
  processingFee: string;
  gracePeriod: string;
  penaltyRate: string;
  penaltyCharge: string;
  penaltyPayment: string;
  approved: boolean;
}

interface Guarantors {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  guarantorName: string;
  guarantorPhone: string;
  guarantorID: string;
  guarantorRelationship: string;
  member?: string;
  memberId: string;
  updater?: string;
  updaterId?: string;
}

interface Loans {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  maintained: string;
  approved: string;
  disbursed: string;
  principal: string;
  interest: string;
  installment: string;
  penalty: string;
  sundays: string;
  payoff: string;
  tenure: string;
  grace: string;
  cycle: string;
  productName: string;
  memberName: string;
  processingFee: string;
  loanRef: string;
  disbursedOn?:string;
  startDate?: string;
  paymentCounter?: string;
  paymentCount?: string;
  paymentDay?: string;
  paymentStatus?: string;
  paymentPenalties?: string;
  guarantor: string;
  guarantorId?: string;
  product: string;
  productId: string;
  member: string;
  memberId: string;
  payment?: string;
  maintainer?: string;
  maintainerId?: string;
  approver?: string;
  approverId?: string;
  disburser?: string;
  disburserId?: string;
  updater?: string;
  updaterId?: string;
}

interface Collaterals {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  item: string;
  value: string;
  member?: string;
  memberId: string;
  updater?: string;
  updaterId?: string;
}
