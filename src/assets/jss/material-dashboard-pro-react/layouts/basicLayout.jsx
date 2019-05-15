import { standardRowHeight } from 'assets/jss'

const basicStyle = (theme) => ({
  filterBar: {
    marginBottom: '10px',
  },
  filterBtn: {
    lineHeight: standardRowHeight,
    textAlign: 'left',
    '& > button': {
      marginRight: theme.spacing.unit,
    },
  },
  actionBtn: {
    position: 'relative',
    textAlign: 'center',
    marginTop: theme.spacing.unit,
  },
})

export default basicStyle
