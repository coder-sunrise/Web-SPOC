import { grayColor } from '@/assets/jss'

export default (theme) => ({
  fieldset: {
    border: `1px solid ${grayColor}`,
    borderRadius: theme.spacing(0.5),
    paddingBottom: theme.spacing(1),
  },
  legend: {
    width: 'fit-content',
    fontSize: '1.1rem',
    margin: `${theme.spacing(1)}px ${theme.spacing(1)}px 0px`,
    padding: `0px ${theme.spacing(1)}px`,
  },
})
