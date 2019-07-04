import { standardRowHeight } from 'assets/jss'

const basicStyle = (theme) => ({
  filterBar: {
    marginBottom: '10px',
  },
  filterBtn: {
    lineHeight: standardRowHeight,
    textAlign: 'left',
    '& > button': {
      marginRight: theme.spacing(1),
    },
  },
  actionBtn: {
    position: 'relative',
    textAlign: 'right',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
})

export default basicStyle
