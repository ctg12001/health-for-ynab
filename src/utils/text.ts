import { utils } from "ynab";

export const numberToCurrency = (amount: number) => {
  return utils
    .convertMilliUnitsToCurrencyAmount(amount)
    .toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
};
