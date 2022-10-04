export const renderPayment = (
  amount: number,
  principal: string,
  interest: string,
  installment: string,
  penalty: string,
  sundays: string,
  tenure: string,
  cycle: string,
  prev_outsArrears: string,
  prev_paidArrears: string,
  prev_outsPenalty: string,
  prev_paidPenalty: string,
  prev_outsInterest: string,
  prev_paidInterest: string,
  prev_outsPrincipal: string,
  prev_paidPrincipal: string,
  prev_outsBalance: string,
  id: string,
  transID: string
) => {
  let payment: any = [];

  let os_arrears = +prev_outsArrears;
  let pd_arrears = +prev_paidArrears;
  let os_penalty = +prev_outsPenalty;
  let pd_penalty = +prev_paidPenalty;
  let os_interest = +prev_outsInterest;
  let pd_interest = +prev_paidInterest;
  let os_principal = +prev_outsPrincipal;
  let pd_principal = +prev_paidPrincipal;
  let os_balance = +prev_outsBalance;

  let rem_amount = amount;
  const term_interest = +interest / +tenure;
  const term_principal = +installment - +term_interest;

  /* if (+prev_outsBalance > 0) { */
  /*   let tos_arrears = */
  /*     prev_outsArrears + os_penalty + os_interest + os_principal; */
  /**/
  /*   os_arrears = +tos_arrears - amount; */
  /**/
  /*   (os_arrears > 0 && (+pd_arrears = prev_paidArrears + amount)) || */
  /*     (+pd_arrears = prev_paidArrears + tos_arrears); */
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
  /*   let tos_principal = prev_outsPrincipal + term_principal; */
  /**/
  /*   (rem_amount > 0 && */
  /*     (os_principal = tos_principal - rem_amount) && */
  /*     (rem_amount -= tos_principal)) || */
  /*     ((os_principal = tos_principal)); */
  /**/
  /*   (rem_amount > 0 && */
  /*     (pd_principal = tos_principal - rem_amount) && */
  /*     (rem_amount -= tos_principal)) || */
  /*     ((pd_principal = tos_principal)); */
  /**/
  /*   return os_balance = prev_outsBalance - amount */
  /* } */

  payment.push({
    outsArrears: os_arrears,
    paidArrears: pd_arrears,
    outsPenalty: os_penalty,
    paidPenalty: pd_penalty,
    outsInterest: os_interest,
    paidInterest: pd_interest,
    outsPrincipal: os_principal,
    paidPrincipal: pd_principal,
    outsBalance: os_balance,
    currInstDate: pd_penalty,
    nextInstDate: pd_penalty,
    amount: amount,
    id: id,
    mpesa: transID,
  });

  return payment;
};
