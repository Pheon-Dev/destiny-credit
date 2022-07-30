export default {
  name: 'mpesaPayments',
  title: 'M-PESA Payments',
  type: 'document',
  fields: [
    {
      name: 'transactionType',
      title: 'Transaction Type',
      type: 'string',
    },
    {
      name: 'transID',
      title: 'Transaction ID',
      type: 'string',
    },
    {
      name: 'transTime',
      title: 'Transaction Time',
      type: 'string',
    },
    {
      name: 'transAmount',
      title: 'Transaction Amount',
      type: 'string',
    },
    {
      name: 'businessShortCode',
      title: 'Business Short Code',
      type: 'string',
    },
    {
      name: 'billRefNumber',
      title: 'Bill Reference Number',
      type: 'string',
    },
    {
      name: 'invoiceNumber',
      title: 'Invoice Number',
      type: 'string',
    },
    {
      name: 'orgAccountBalance',
      title: 'Org. Account Balance',
      type: 'string',
    },
    {
      name: 'thirdPartyTransID',
      title: 'Third Party Transaction ID',
      type: 'string',
    },
    {
      name: 'mSISDN',
      title: 'Phone Number [MSISDN]',
      type: 'string',
    },
    {
      name: 'firstName',
      title: 'First Name',
      type: 'string',
    },
    {
      name: 'middleName',
      title: 'Middle Name',
      type: 'string',
    },
    {
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
    },
  ],
};

