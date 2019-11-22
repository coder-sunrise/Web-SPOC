import {
  primaryColor,
  dangerColor,
  successColor,
  defaultFont,
  fontColor,
} from 'mui-pro-jss'

const customInputStyle = {
  // disabled: {
  //   "&:before": {
  //     // borderColor: "transparent !important",
  //   },
  // },
  // multiline: {
  //   padding: '0px',
  //   paddingBottom: '4px',
  //   '& textarea': {
  //     marginTop: '6px',
  //     minHeight: '19px',
  //   },
  // },
  underline: {
    '&:hover:not($disabled):before,&:before': {
      // borderColor: "#D2D2D2 !important",
      borderWidth: '1px !important',
    },
    '&:after': {
      borderColor: primaryColor,
    },
  },
  noUnderline: {
    '&:hover:not($disabled):before,&:before': {
      borderWidth: '0px !important',
    },
    '&:hover:not($disabled):after,&:after': {
      borderWidth: '0px !important',
    },
  },

  // inputRoot: {
  //   marginTop: '0 !important',
  // },
  disabled: {
    color: 'rgba(0, 0, 0, 1)',
    // cursor: 'not-allowed',
    '&:before': {
      borderBottomStyle: 'dotted',
    },
  },
  text: {
    color: 'transparent',
    textShadow: `0 0 0 ${fontColor}`,
    padding: 0,
  },
  textControl: {
    display: 'inline-block',
    // width: 'auto',
    margin: 0,
    '& .Mui-disabled': {
      cursor: 'initial',
    },
  },
  textInput: {
    color: 'currentColor',
    cursor: 'initial !important',
    fontSize: 'inherit',
    '& > div': {
      top: 0,
      '& > p': {
        minHeight: 24,
        display: 'inline-block',
        lineHeight: '24px',
      },
    },
  },
  normalText: {
    color: 'currentColor',
    cursor: 'initial !important',
  },
  rightAlign: {
    '& input': {
      textAlign: 'right',
      width: '100% !important',
    },
  },
  currency: {
    '& input': {
      color: 'darkblue',
      fontWeight: 500,
    },
  },
  inActive: {
    '& input': {
      color: 'gray',
      fontWeight: 200,
    },
  },

  negativeCurrency: {
    '& input': {
      color: 'red',
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
  strongLabel: {
    '& > label[data-shrink="true"]': {
      fontWeight: 500,
      fontSize: '1.2rem',
      color: 'rgba(0, 0, 0, 0.8)',
    },
  },
  labelRootError: {
    color: `${dangerColor} !important`,
  },
  labelRootSuccess: {
    color: `${successColor} !important`,
  },
  required: {
    top: -2,
    position: 'relative',
    left: 5,
    color: 'red',
    fontWeight: 500,
  },
  formControl: {
    position: 'relative',
    verticalAlign: 'unset',
    // margin: '5px 0 5px 0',
    // "& svg,& .fab,& .far,& .fal,& .fas,& .material-icons": {
    //   color: "#495057",
    // },
  },
  simple: {
    margin: 0,
    '& > *': {
      padding: '1px 0 0px',
    },
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

  errorAdornment: {
    top: '2px !important',
    marginLeft: -2,
  },
  adornment: {
    width: 'auto !important',
  },
}

export default customInputStyle
