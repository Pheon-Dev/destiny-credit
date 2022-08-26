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
  data: any;
};

type Links = {
  title: string;
  data: any;
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

export interface Member {
  date: Date;
  branchName: string;
  memberNumber: string;
  firstName: string;
  lastName: string;
  dob: Date;
  idPass: string;
  kraPin: string;
  mobileNumber: string;
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
  maintained?: string;
  group?: string;
}
