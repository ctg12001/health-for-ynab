export const calculateFIAge = (
  currentValue: number,
  expenses: number,
  contributions: number,
  interestRate: number,
  withdrawRate: number
) => {
  // Setting age to 26. This will be configurable in the future
  const age = 26;

  /*
   * Derived from the formula for calculating the future value of money and the future value of an annuity:
   * fv = p(i+1)^t + d*(1+i)*(((1+i)^t - 1)/i)
   * where fv = future value, p = present value, i = interest rate, t = number of periods, d = deposit each period
   *
   * Solving for t:
   * t = ( ln(fv * i + d * (1 + i)) - ln(p * i + d * (1 + i)) ) / ln(1 + i)
   * using fv = yearly expenses / withdrawRate
   */
  const r = 1 + interestRate;
  return (
    age +
    (Math.log(
      (1 / withdrawRate) * expenses * interestRate + contributions * r
    ) -
      Math.log(currentValue * interestRate + contributions * r)) /
      Math.log(r)
  );
};
