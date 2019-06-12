import {
  primaryColor,
  dangerColor,
  successColor,
  defaultFont,
} from 'mui-pro-jss'

const customInputStyle = {
  // disabled: {
  //   "&:before": {
  //     // borderColor: "transparent !important",
  //   },
  // },
  multiline: {
    padding: '0px',
    paddingBottom: '4px',
    '& textarea': {
      marginTop: '6px',
      minHeight: '19px',
    },
  },
  underline: {
    '&:hover:not($disabled):before,&:before': {
      // borderColor: "#D2D2D2 !important",
      borderWidth: '1px !important',
    },
    '&:after': {
      borderColor: primaryColor,
    },
  },
  simple: {
    '&:hover:not($disabled):before,&:before': {
      borderWidth: '0px !important',
    },
    '&:hover:not($disabled):after,&:after': {
      borderWidth: '0px !important',
    },
  },
  inputRoot: {
    marginTop: '0 !important',
  },
  disabled: {
    '&:before': {
      borderBottomStyle: 'dotted',
    },
  },
  underlineError: {
    '&:after': {
      borderColor: dangerColor,
    },
  },
  underlineSuccess: {
    '&:after': {
      borderColor: successColor,
    },
  },
  labelRoot: {
    // ...defaultFont,
    // color: '#AAAAAA !important',
    // fontWeight: '400',
    // fontSize: '14px',
    // lineHeight: '1.42857',
    // top: '5px',
    // '& + $underline': {
    //   marginTop: '0px',
    // },
  },
  labelRootError: {
    color: `${dangerColor} !important`,
  },
  labelRootSuccess: {
    color: `${successColor} !important`,
  },
  formControl: {
    position: 'relative',
    verticalAlign: 'unset',
    margin: '6px 0 5px 0',
    // "& svg,& .fab,& .far,& .fal,& .fas,& .material-icons": {
    //   color: "#495057",
    // },
  },
  medium: {
    margin: '6px 0 5px 0',
    paddingTop: 20,
  },
  small: {
    margin: '2px 0 2px 0',
    paddingTop: 5,
  },
  noLabel: {
    paddingTop: 0,
  },
  whiteUnderline: {
    '&:hover:not($disabled):before,&:before': {
      backgroundColor: '#FFFFFF',
    },
    '&:after': {
      backgroundColor: '#FFFFFF',
    },
  },
  input: {
    // color: '#495057',
    // "&,&::placeholder": {
    //   fontSize: "14px",
    //   fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    //   fontWeight: "400",
    //   lineHeight: "1.42857",
    //   opacity: "1",
    //   minHeight:'19px',
    //   padding: '6px 0 6px',
    // },
    // "&::placeholder": {
    //   color: "#AAAAAA",
    // },
  },
  whiteInput: {
    '&,&::placeholder': {
      color: '#FFFFFF',
      opacity: '1',
    },
  },
}

export default customInputStyle
