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
