export const renderPayment = (
  amount: number,
  principal: number,
  interest: number,
  installment: number,
  penalty: number,
  sundays: number,
  tenure: number,
  cycle: string,
  prev_outsArrears: number,
  prev_paidArrears: number,
  prev_outsPenalty: number,
  prev_paidPenalty: number,
  prev_outsInterest: number,
  prev_paidInterest: number,
  prev_outsPrincipal: number,
  prev_paidPrincipal: number,
  prev_outsBalance: number,
  id: string,
  transID: string
) => {
  let prev_os_arrears = 0;
  /* prev_outsArrears === "undefined" && prev_os_arrears = 0 */
  let payment: any = [];
  let counter = 0;

  let os_arrears = counter;
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

  if (+prev_outsBalance !== 0) {
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
    os_balance = +prev_outsBalance - amount
  }
  /* console.log(os_balance) */

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
