// ##############################
// // // Modal component styles
// #############################

const modalStyle = (theme) => {
  // console.log(theme)
  return {
    modalRoot: {
      alignItems: 'unset',
      justifyContent: 'unset',
    },
    modal: {
      [theme.breakpoints.up('sm')]: {
        // maxWidth: "500px",
        // margin: "1.75rem auto",
      },

      borderRadius: '6px',
      [theme.breakpoints.down('lg')]: {
        minHeight: '600px',
        borderRadius: '0px',
      },
      // marginTop: "100px !important",
      overflow: 'visible',
      maxHeight: 'unset',
      position: 'relative',
      // height: "fit-content",
    },
    modalHeader: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      paddingTop: '9px',
      paddingRight: '12px',
      paddingBottom: '5px',
      paddingLeft: '12px',
      minHeight: '16.43px',
    },
    modalTitle: {
      margin: '0',
      lineHeight: '1.42857143',
    },
    modalCloseButton: {
      color: '#999999',
      marginTop: '-12px',
      WebkitAppearance: 'none',
      padding: '0',
      cursor: 'pointer',
      background: '0 0',
      border: '0',
      fontSize: 'inherit',
      opacity: '.9',
      textShadow: 'none',
      fontWeight: '700',
      lineHeight: '1',
      float: 'right',
      right: '-8px',
      top: '6px',
    },
    modalClose: {
      width: '16px',
      height: '16px',
    },
    modalBody: {
      position: 'relative',
      overflow: 'auto',
      boxSizing: 'border-box',
    },
    modalBodyPadding: {
      paddingTop: '12px',
      paddingRight: '12px',
      paddingBottom: '8px',
      paddingLeft: '12px',
    },
    modalBodyNoPadding: {
      padding: 0,
    },
    modalFooter: {
      borderTop: `1px solid ${theme.palette.divider}`,

      padding: '12px',
      // textAlign: "right",
      // paddingTop: "0",
      margin: '0',
    },
    modalFooterCenter: {
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    instructionNoticeModal: {
      marginBottom: '25px',
    },
    imageNoticeModal: {
      maxWidth: '150px',
    },
    modalSmall: {
      width: '300px',
    },
    modalSmallBody: {
      paddingTop: '0',
    },
    modalSmallFooterFirstButton: {
      margin: '0',
      paddingLeft: '16px',
      paddingRight: '16px',
      width: 'auto',
    },
    modalSmallFooterSecondButton: {
      marginBottom: '0',
      marginLeft: '5px',
    },
  }
}

export default modalStyle
