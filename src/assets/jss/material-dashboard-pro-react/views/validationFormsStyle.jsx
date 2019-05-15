// ##############################
// // // ValidationForms view styles
// #############################

import {
  cardTitle,
  dangerColor
} from "mui-pro-jss";
import customCheckboxRadioSwitch from "mui-pro-jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";

const validationFormsStyle = {
  ...customCheckboxRadioSwitch,
  cardTitle: {
    ...cardTitle,
    color: "#FFFFFF"
  },
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  formCategory: {
    marginBottom: "0",
    color: "#999999",
    fontSize: "14px",
    padding: "10px 0 10px"
  },
  center: {
    textAlign: "center"
  },
  justifyContentCenter: {
    justifyContent: "center"
  },
  registerButton: {
    float: "right"
  },
  danger: {
    color: dangerColor + "!important"
  }
};

export default validationFormsStyle;
