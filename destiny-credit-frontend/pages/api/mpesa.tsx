import { Mpesa } from "mpesa-api";

const credentials = {
  clientKey: `${process.env.consumer_key}`,
  clientSecret: `${process.env.consumer_secret}`,
  initiatorPassword: `${process.env.security_credential}`,
  // securityCredential: `${process.env.security_credential}`,
  // certificatePath: './SandboxCertificate.cer',
}

const environment = "sandbox";

const mpesa = new Mpesa(credentials, environment);

// mpesa.lipaNaMpesaQuery({
//   // mpesa.fetchApi({
//   BusinessShortCode: 4085055,
//   CheckoutRequestID: "Checkout Request ID",
//   passKey: "Lipa Na M-PESA Pass Key",
// })
//   .then((response) => {
//     console.log(response);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// mpesa.lipaNaMpesaOnline({
//   BusinessShortCode: 123456,
//   Amount: 1000,
//   PartyA: "Party A",
//   PhoneNumber: "Phone Number",
//   CallBackURL: "CallBack URL",
//   AccountReference: "Account Reference",
//   passKey: "Lipa Na M-PESA Pass Key",
//   TransactionType: "CustomerPayBillOnline",
//   TransactionDesc: "Transaction Desc",
// })
//   .then((response) => {
//     console.log(response);
//   })
//   .catch((error) => {
//     console.log(error);
//   });


mpesa.c2bSimulate({
  ShortCode: 4085055,
  Amount: 1000,
  Msisdn: 254768858280,
  CommandID: "CustomerPayBillOnline",
  BillRefNumber: ""
})
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  });

