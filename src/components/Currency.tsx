import React from "react";
import NumberFormat from "react-number-format";
import { utils } from "ynab";

const Currency = (props: { amount: number }) => {
  const { amount } = props;
  return (
    <NumberFormat
      value={utils.convertMilliUnitsToCurrencyAmount(amount)}
      displayType={"text"}
      thousandSeparator={true}
      prefix={"$"}
    />
  );
};

export default Currency;
