import { primaryColor, dangerColor, roseColor, grayColor } from 'mui-pro-jss'

const customCheckboxRadioSwitch = (theme) => {
  return {
    checkRoot: {
      padding: '3px 3px 2px 3px',
      margin: '0px 9px',
      // padding: '5px 0px 4px 0px',
    },
    radioRoot: {
      padding: '7px 6px 6px 6px',
      marginLeft: theme.spacing.unit,
    },
    checkboxAndRadio: {
      position: 'relative',
      display: 'block',
      marginTop: '10px',
      marginBottom: '10px',
    },
    checkboxAndRadioHorizontal: {
      position: 'relative',
      display: 'inline-block',
      '&:first-child': {
        // marginTop: "10px",
      },
      '&:not(:first-child)': {
        // marginTop: "-14px",
      },
      marginTop: '0',
      marginBottom: '0',
    },
    checked: {
      color: `${primaryColor}!important`,
    },
    checkedIcon: {
      width: '20px',
      height: '20px',
      // padding: '9px',
      // position: 'absolute',

      border: '1px solid rgba(0, 0, 0, .54)',
      borderRadius: '3px',
    },
    uncheckedIcon: {
      width: '0px',
      height: '0px',
      padding: '9px',
      // position: 'absolute',
      border: '1px solid rgba(0, 0, 0, .54)',
      borderRadius: '3px',
    },
    disabledCheckboxAndRadio: {
      '& $checkedIcon,& $uncheckedIcon,& $radioChecked,& $radioUnchecked': {
        borderColor: '#000000',
        opacity: '0.26',
        color: '#000000',
      },
    },
    label: {
      cursor: 'pointer',
      paddingLeft: '0',
      // color: '#AAAAAA',
      fontSize: '1rem',
      // lineHeight: '1.428571429',
      fontWeight: '350',
      display: 'inline-flex',
      transition: '0.3s ease all',
      marginRight: theme.spacing.unit * 3,
    },
    labelHorizontal: {
      color: 'rgba(0, 0, 0, 0.26)',
      cursor: 'pointer',
      display: 'inline-flex',
      fontSize: '14px',
      lineHeight: '1.428571429',
      fontWeight: '350',
      paddingTop: '39px',
      marginRight: '0',
      '@media (min-width: 992px)': {
        float: 'right',
      },
    },
    labelHorizontalRadioCheckbox: {
      paddingTop: '22px',
    },
    labelLeftHorizontal: {
      color: 'rgba(0, 0, 0, 0.26)',
      cursor: 'pointer',
      display: 'inline-flex',
      fontSize: '14px',
      lineHeight: '1.428571429',
      fontWeight: '400',
      paddingTop: '22px',
      marginRight: '0',
    },
    labelError: {
      color: dangerColor,
    },
    radio: {
      color: `${primaryColor}!important`,
    },
    radioChecked: {
      width: '16px',
      height: '16px',
      border: `1px solid ${primaryColor}`,
      borderRadius: '50%',
    },
    radioUnchecked: {
      width: '0px',
      height: '0px',
      padding: '7px',
      border: '1px solid rgba(0, 0, 0, .54)',
      borderRadius: '50%',
    },
    inlineChecks: {
      marginTop: '8px',
    },
    iconCheckbox: {
      height: '116px',
      width: '116px',
      color: grayColor,
      padding: '0',
      margin: '0 auto 20px',
      '& > span:first-child': {
        borderWidth: '4px',
        borderStyle: 'solid',
        borderColor: '#CCCCCC',
        textAlign: 'center',
        verticalAlign: 'middle',
        borderRadius: '50%',
        color: 'inherit',
        transition: 'all 0.2s',
      },
      '&:hover': {
        color: roseColor,
        '& > span:first-child': {
          borderColor: roseColor,
        },
      },
    },
    iconCheckboxChecked: {
      color: roseColor,
      '& > span:first-child': {
        borderColor: roseColor,
      },
    },
    iconCheckboxIcon: {
      fontSize: '40px',
      lineHeight: '111px',
    },
    switchBase: {
      height: 'auto',
      padding: '5px 4px 4px 4px',
    },
    switchRoot: {
      // marginLeft: 30,
    },
    // switchIcon: {
    //   boxShadow: '0 1px 3px 1px rgba(0, 0, 0, 0.4)',
    //   color: '#FFFFFF !important',
    //   border: '1px solid rgba(0, 0, 0, .54)',
    //   transform: 'translateX(-4px)!important',
    // },
    switchIconChecked: {
      borderColor: '#9c27b0',
      transform: 'translateX(0px)!important',
    },
    switchBar: {
      width: '30px',
      height: '15px',
      backgroundColor: 'rgb(80, 80, 80)',
      borderRadius: '15px',
      opacity: '0.7!important',
    },
    switchChecked: {
      '& + $switchBar': {
        backgroundColor: 'rgba(156, 39, 176, 1) !important',
      },
    },
  }
}

export default customCheckboxRadioSwitch
