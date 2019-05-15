import {
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader,
  roseCardHeader,
} from 'mui-pro-jss'

const cardIconStyle = {
  cardIcon: {
    '&$warningCardHeader,&$successCardHeader,&$dangerCardHeader,&$infoCardHeader,&$primaryCardHeader,&$roseCardHeader': {
      borderRadius: '3px',
      backgroundColor: '#999',
      padding: '15px',
      marginTop: '-20px',
      marginRight: '15px',
      float: 'left',
    },
    '& > svg': {
      width: 24,
      height: 24,
      margin: '5px 4px 0px',
      textAlign: 'center',
      lineHeight: '33px',
    },
  },
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader,
  roseCardHeader,
}

export default cardIconStyle
