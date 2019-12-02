import { defaultColorOpts } from '../../utils'

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
    padding: `${theme.spacing.unit}px 0px`,
  },
  verticalSpacing: {
    margin: `${theme.spacing(1)}px 0px`,
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
    paddingTop: theme.spacing(2),
    height: '100%',
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
  },
  footerGrid: {
    paddingRight: '0px !important',
  },
  footer: {
    textAlign: 'right',
    paddingLeft: theme.spacing.unit * 2,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
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
  conflictContent: {
    fontWeight: 'bold',
  },
  patientNameButton: {
    paddingLeft: '0px !important',
    textDecoration: 'underline',
  },
  recurrenceListLabel: {
    marginTop: theme.spacing(1),
    fontSize: '1rem',
  },
  inlineLabel: {
    marginTop: theme.spacing(1),
    fontSize: '1rem',
  },
  appointmentHistory: {
    height: '100%',
    padding: theme.spacing(1),
    overflow: 'auto',
  },
})

export default styles
