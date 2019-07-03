import {
  Button,
  CommonHeader,
  CommonModal,
  NavPills,
  PictureUpload,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
  TextField,
  notification,
  Select,
  CodeSelect,
  DatePicker,
  RadioGroup,
  ProgressButton,
  CardContainer,
  confirm,
} from '@/components'
import Replay from '@material-ui/icons/Replay'
import Clear from '@material-ui/icons/Clear'

import { getUniqueGUID, getRemovedUrl, getAppendUrl } from '@/utils/utils'

module.exports = {
  componentDidUpdate: (props, prevProps) => {
    const { patient } = props
    // console.log(patient.entity, prevProps.values.id)
    if (patient.entity && patient.entity.id !== prevProps.values.id) {
      // console.log(patient.entity)
      props.resetForm(patient.entity)
    }
  },
  handleSubmit: (values, component) => {
    const { props, setValues } = component
    console.log(values)
    // return
    props
      .dispatch({
        type: 'patient/upsert',
        payload: values,
      })
      .then((r) => {
        // console.log(r)
        // console.debug(123)
        if (r) {
          notification.success({
            // duration:0,`
            message: r.id ? 'Created' : 'Saved',
          })

          if (r.id) {
            props.history.push(
              getRemovedUrl(
                [
                  'new',
                ],
                getAppendUrl({
                  pid: r.id,
                }),
              ),
            )
          } else {
            props
              .dispatch({
                type: 'patient/query',
                payload: {
                  id: props.patient.currentId,
                },
              })
              .then((value) => {
                // console.log(value)
                setValues(value)
              })
          }
          if (props.onConfirm) props.onConfirm()
        }
      })
  },

  getFooter: ({
    theme,
    handleSubmit,
    resetForm,
    values,
    dispatch,
    extraBtn,
    patient,
    allowSubmit,
  }) => (
    <div
      style={{
        position: 'relative',
        textAlign: 'center',
        marginTop: theme.spacing.unit,
      }}
    >
      {values &&
      values.id && (
        <Button
          // className={classes.modalCloseButton}
          key='reset'
          aria-label='Reset'
          color='danger'
          onClick={() => {
            resetForm(patient.entity)
          }}
          style={{ left: 0, position: 'absolute' }}
        >
          <Replay />
          Reset
        </Button>
      )}
      <Button
        // className={classes.modalCloseButton}
        key='cancel'
        aria-label='Cancel'
        color='danger'
        onClick={() => {
          dispatch({
            type: 'global/updateAppState',
            payload: {
              showPatientInfoPanel: false,
              fullscreen: false,
              currentPatientId: null,
            },
          })
        }}
        style={{ marginRight: theme.spacing.unit }}
      >
        <Clear />
        Cancel
      </Button>
      <ProgressButton disabled={!allowSubmit} onClick={handleSubmit} />
      {extraBtn}
    </div>
  ),

  // setCurrentPatient: (props, setValues, cb) => {
  //   // eslint-disable-next-line no-undef
  //   props
  //     .dispatch({
  //       type: 'patient/query',
  //       payload: {
  //         id: props.patient.currentId,
  //       },
  //     })
  //     .then((value) => {
  //       // console.log(value)
  //       setValues(value)
  //       if (cb) cb()
  //     })
  // },
}
