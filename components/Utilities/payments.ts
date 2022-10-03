import { trpc } from "../../utils/trpc";

export const handlePayment = ({
  transID,
  amount,
  firstName,
  middleName,
  lastName,
  msisdn,
}: {
  transID: string;
  amount: string;
  firstName: string;
  middleName: string;
  lastName: string;
  msisdn: string;
}) => {
  const utils = trpc.useContext();

  const transactions = trpc.transactions.member_transactions.useQuery({
    firstname: firstName,
    middlename: middleName,
    lastname: lastName,
    phone: msisdn,
  });

  const name = firstName + " " + middleName + " " + lastName;

  const { data: loan } = trpc.loans.payment.useQuery({
    name: `${name}`,
    phone: `${msisdn}`,
  });

  const { data: payments } = trpc.loans.payments_list.useQuery({
    id: `${loan?.id}`,
  });

  let payment: any = [];

  if (loan && payments) {
    payment = renderPayment(
      +amount,
      +loan?.principal,
      +loan?.interest,
      +loan?.installment,
      +loan?.penalty,
      +loan?.sundays,
      +loan?.tenure,
      +loan?.cycle,
      +payments[payments.length - 1]?.outsArrears,
      +payments[payments.length - 1]?.paidArrears,
      +payments[payments.length - 1]?.outsPenalty,
      +payments[payments.length - 1]?.paidPenalty,
      +payments[payments.length - 1]?.outsInterest,
      +payments[payments.length - 1]?.paidInterest,
      +payments[payments.length - 1]?.outsPrincipal,
      +payments[payments.length - 1]?.paidPrincipal,
      +payments[payments.length - 1]?.outsBalance
    );
  }
  const new_payment = trpc.loans.create_payment.useMutation({
    onSuccess: async () => {
      await utils.loans.payments.invalidate();
    },
  });
  const addPayment = () => {
    new_payment.mutate({
      amount: `${amount}`,
      outsArrears: `${payment.outsArrears}`,
      paidArrears: `${payment.paidArrears}`,
      outsPenalty: `${payment.outsPenalty}`,
      paidPenalty: `${payment.paidPenalty}`,
      outsInterest: `${payment.outsInterest}`,
      paidInterest: `${payment.paidInterest}`,
      outsPrincipal: `${payment.outsPrincipal}`,
      paidPrincipal: `${payment.paidPrincipal}`,
      outsBalance: `${payment.outsBalance}`,
      currInstDate: `${payment.currInstDate}`,
      nextInstDate: `${payment.nextInstDate}`,
      loanId: `${loan?.id}`,
      mpesa: `${transID}`,
    });
  };

  return addPayment;
};

const renderPayment = (
  amount: number,
  principal: number,
  interest: number,
  installment: number,
  penalty: number,
  sundays: number,
  tenure: number,
  cycle: number,
  prev_outsArrears: number,
  prev_paidArrears: number,
  prev_outsPenalty: number,
  prev_paidPenalty: number,
  prev_outsInterest: number,
  prev_paidInterest: number,
  prev_outsPrincipal: number,
  prev_paidPrincipal: number,
  prev_outsBalance: number
) => {
  let payment: any = [];

  let os_arrears = prev_outsArrears;
  let pd_arrears = prev_paidArrears;
  let os_penalty = prev_outsPenalty;
  let pd_penalty = prev_paidPenalty;
  let os_interest = prev_outsInterest;
  let pd_interest = prev_paidInterest;
  let os_principal = prev_outsPrincipal;
  let pd_principal = prev_paidPrincipal;
  let os_balance = prev_outsBalance;

  let rem_amount = amount;
  const term_interest = interest / tenure;
  const term_principal = installment - term_interest;

  /* if (prev_outsBalance > 0) { */
  /*   let tos_arrears = */
  /*     prev_outsArrears + os_penalty + os_interest + os_principal; */
  /**/
  /*   os_arrears = tos_arrears - amount; */
  /**/
  /*   (os_arrears > 0 && (pd_arrears = prev_paidArrears + amount)) || */
  /*     (pd_arrears = prev_paidArrears + tos_arrears); */
  /*   rem_amount = amount - tos_arrears; */
  /**/
  /*   os_penalty = 0; */
  /*   pd_penalty = 0; */
  /**/
  /*   let tos_interest = prev_outsInterest + term_interest; */
  /**/
  /*   (rem_amount > 0 && */
  /*     (os_interest = tos_interest - rem_amount) && */
  /*     (rem_amount -= tos_interest)) || */
  /*     ((os_interest = tos_interest)); */
  /**/
  /*   (rem_amount > 0 && */
  /*     (pd_interest = prev_paidInterest + rem_amount) && */
  /*     (rem_amount -= tos_interest)) || */
  /*     ((pd_interest = tos_interest)); */
  /**/
  /*     let tos_principal = prev_outsPrincipal + term_principal */
  /**/
  /*   (rem_amount > 0 && */
  /*     (os_interest = tos_interest - rem_amount) && */
  /*     (rem_amount -= tos_interest)) || */
  /*     ((os_interest = tos_interest)); */
  /**/
  /*   (rem_amount > 0 && */
  /*     (os_interest = tos_interest - rem_amount) && */
  /*     (rem_amount -= tos_interest)) || */
  /*     ((os_interest = tos_interest)); */
  /*   pd_principal = 0; */
  /**/
  /*   return os_balance = prev_outsBalance - amount */
  /* } */

  payment.push({
    outsArrears: os_arrears.toString(),
    paidArrears: pd_arrears.toString(),
    outsPenalty: os_penalty.toString(),
    paidPenalty: pd_penalty.toString(),
    outsInterest: os_interest.toString(),
    paidInterest: pd_interest.toString(),
    outsPrincipal: os_principal.toString(),
    paidPrincipal: pd_principal.toString(),
    outsBalance: os_balance.toString(),
    currInstDate: pd_penalty.toString(),
    nextInstDate: pd_penalty.toString(),
  });
  return payment;
};
