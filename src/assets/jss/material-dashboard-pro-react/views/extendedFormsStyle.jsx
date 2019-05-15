// ##############################
// // // ExtendedForms view styles
// #############################

import { cardTitle } from "mui-pro-jss"
import customSelectStyle from "mui-pro-jss/material-dashboard-pro-react/customSelectStyle.jsx"
import customCheckboxRadioSwitch from "mui-pro-jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx"
import customInputStyle from "mui-pro-jss/material-dashboard-pro-react/components/customInputStyle.jsx"

const extendedFormsStyle = {
  ...customCheckboxRadioSwitch,
  ...customSelectStyle,
  ...customInputStyle,
  cardTitle,
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
  label: {
    cursor: "pointer",
    paddingLeft: "0",
    color: "rgba(0, 0, 0, 0.26)",
    fontSize: "14px",
    lineHeight: "1.428571429",
    fontWeight: "400",
    display: "inline-flex",
  },
  mrAuto: {
    marginRight: "auto",
  },
  mlAuto: {
    marginLeft: "auto",
  },
}

export default extendedFormsStyle
