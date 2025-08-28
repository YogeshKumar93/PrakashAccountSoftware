import {
  broadband_invert,
  credit_card_invert,
  electricity_svg,
  fastTag,
  recharge_white,
} from "../iconsImports";
import { broadband } from "../iconsImports";
import { dth } from "../iconsImports";
import { gas } from "../iconsImports";
import { water_drop } from "../iconsImports";
import { health } from "../iconsImports";
import { car } from "../iconsImports";
import { taxSvg } from "../iconsImports";
import { subsciptionSvg } from "../iconsImports";
import { housingSvg } from "../iconsImports";
import { clulbSvg } from "../iconsImports";
import { hospitalSvg } from "../iconsImports";
import { piggyBankSvg } from "../iconsImports";
import { recharge_white_invert } from "../iconsImports";
import { dth_invert } from "../iconsImports";
import { gas_invert } from "../iconsImports";
import { water_drop_invert } from "../iconsImports";
import { healthInvert } from "../iconsImports";
import { carInvert } from "../iconsImports";
import { fastTag_invert } from "../iconsImports";
import { taxSvgInvert } from "../iconsImports";
import { subsciptionSvgInvert } from "../iconsImports";
import { housingSvgInvert } from "../iconsImports";
import { clulbSvgInvert } from "../iconsImports";
import { hospitalSvgInvert } from "../iconsImports";
import { rDepositSvgInvert } from "../iconsImports";
import { electricity_invert } from "../iconsImports";
import { credit_card } from "../iconsImports";
import { CableIcon } from "../iconsImports";
import { CableInv } from "../iconsImports";

export const getRecAndBillImg = (img) => {
  if (process.env.REACT_APP_TITLE === "ImpsGuru") {
    if (img) {
      if (img === "Mobile Postpaid") return recharge_white;
      else if (img === "Mobile Prepaid") return recharge_white;
      else if (img === "Landline") return broadband;
      else if (img === "Cable TV") return CableIcon;
      else if (img === "Electricity") return electricity_svg;
      else if (img === "Broadband") return broadband;
      else if (img === "Piped Gas") return gas;
      else if (img === "Water") return water_drop;
      else if (img === "Gas Cylinder") return gas;
      else if (img === "Insurance") return health;
      else if (img === "Loan EMI") return car;
      else if (img === "FASTag") return fastTag;
      else if (img === "Credit Card") return credit_card;
      else if (img === "Municipal Taxes") return taxSvg;
      else if (img === "Subscription") return subsciptionSvg;
      else if (img === "Housing Society") return housingSvg;
      else if (img === "Clubs & Associations") return clulbSvg;
      else if (img === "Hospital & Pathology") return hospitalSvg;
      else if (img === "Recurring Deposit") return piggyBankSvg;
      else if (img === "DTH") return dth;
    }
  }
  return electricity_svg;
};
export const getRecAndBillInvertImg = (img) => {
  if (process.env.REACT_APP_TITLE === "ImpsGuru") {
    if (img) {
      if (img === "Mobile Postpaid") return recharge_white_invert;
      else if (img === "Mobile Prepaid") return recharge_white_invert;
      else if (img === "Landline") return broadband_invert;
      else if (img === "Cable TV") return CableInv;
      else if (img === "Electricity") return electricity_invert;
      else if (img === "Broadband") return broadband_invert;
      else if (img === "Piped Gas") return gas_invert;
      else if (img === "Water") return water_drop_invert;
      else if (img === "Gas Cylinder") return gas_invert;
      else if (img === "Insurance") return healthInvert;
      else if (img === "Loan EMI") return carInvert;
      else if (img === "FASTag") return fastTag_invert;
      else if (img === "Municipal Taxes") return taxSvgInvert;
      else if (img === "Subscription") return subsciptionSvgInvert;
      else if (img === "Housing Society") return housingSvgInvert;
      else if (img === "Credit Card") return credit_card_invert;
      else if (img === "Clubs & Associations") return clulbSvgInvert;
      else if (img === "Hospital & Pathology") return hospitalSvgInvert;
      else if (img === "Recurring Deposit") return rDepositSvgInvert;
      else if (img === "DTH") return dth_invert;
    }
  }
  return electricity_invert;
};
