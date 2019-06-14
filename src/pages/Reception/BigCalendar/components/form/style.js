import { defaultColorOpts } from '../../setting'

const styles = (theme) => ({
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    zIndex: 99999,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  formContent: {
    padding: `${theme.spacing.unit}px 0`,
  },
  content: {
    margin: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    padding: `0px ${theme.spacing.unit}px`,
  },
  rowContainer: {
    padding: '0px !important',
  },
  colorChipContainer: {
    marginTop: 'auto',
    marginBottom: '10px',
  },
  defaultColor: {
    background: defaultColorOpts.value,
    '&:hover': {
      backgroundColor: defaultColorOpts.activeColor,
    },
  },
  remarksField: {
    marginTop: theme.spacing.unit * 2,
  },
  dateTimePreview: {
    fontSize: '1rem',
    textAlign: 'left',
    paddingLeft: theme.spacing.unit * 9,
    paddingTop: theme.spacing.unit,
  },
  buttonGroup: {
    height: '100%',
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
  },

  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing.unit * 2,
  },
  actionsBtnGroup: {
    textAlign: 'right',
    paddingRight: theme.spacing.unit,
    display: 'inline-block',
  },
  hideCancelAppointmentBtn: {
    display: 'none',
  },
  apptLabel: {
    textAlign: 'left',
    paddingLeft: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
  },
  apptSubLabel: {
    textAlign: 'right',
    fontSize: '.85rem',
    paddingTop: 12,
  },
  divider: {
    marginTop: 15,
    marginBottom: 10,
  },
})

export default styles
