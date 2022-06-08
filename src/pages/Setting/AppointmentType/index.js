import React, { useEffect } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
// material ui
import { withStyles } from '@material-ui/core'
// styles
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
// common components
import { CardContainer, CommonModal, withSettingBase } from '@/components'
import Filter from './Filter'
import Form from './Form'
import Grid from './Grid'

const styles = theme => ({
  ...basicStyle(theme),
  label: {
    fontSize: '1rem',
    color: 'rgba(0, 0, 0, 0.54)',
  },
  colorPicker: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
})

const AppointmentType = ({
  settingAppointmentType,
  dispatch,
  mainDivHeight = 700,
  ...restProps
}) => {
  useEffect(() => {
    dispatch({
      type: 'settingAppointmentType/query',
      payload: {
        isActive: true,
        sorting: [
          { columnName: 'isDefault', direction: 'desc' },
          { columnName: 'displayValue', direction: 'asc' },
        ],
      },
    })
  }, [])

  const toggleModal = () => {
    dispatch({
      type: 'settingAppointmentType/updateState',
      payload: {
        showModal: !settingAppointmentType.showModal,
        entity: settingAppointmentType.showModal
          ? null
          : settingAppointmentType.entity,
      },
    })
  }
  const formTitlePrefix =
    settingAppointmentType.entity === null ? 'Add' : 'Edit'

  let height =
    mainDivHeight - 120 - ($('.filterAppointmentTypeBar').height() || 0)
  if (height < 300) height = 300
  return (
    <CardContainer hideHeader>
      <div className='filterAppointmentTypeBar'>
        <Filter
          toggleModal={toggleModal}
          {...restProps}
          dispatch={dispatch}
          settingAppointmentType={settingAppointmentType}
        />
      </div>
      <Grid
        toggleModal={toggleModal}
        {...restProps}
        dispatch={dispatch}
        settingAppointmentType={settingAppointmentType}
        height={height}
      />
      <CommonModal
        open={settingAppointmentType.showModal}
        observe='AppointmentTypeSettingForm'
        title={`${formTitlePrefix} Appointment Type`}
        maxWidth='md'
        bodyNoPadding
        onClose={toggleModal}
        onConfirm={toggleModal}
      >
        <Form
          toggleModal={toggleModal}
          {...restProps}
          dispatch={dispatch}
          settingAppointmentType={settingAppointmentType}
        />
      </CommonModal>
    </CardContainer>
  )
}

const AppointmentTypeSettingBase = withSettingBase({
  modeName: 'settingAppointmentType',
})(AppointmentType)

const ConnectedAppointmentType = connect(
  ({ settingAppointmentType, global }) => ({
    settingAppointmentType,
    mainDivHeight: global.mainDivHeight,
  }),
)(AppointmentTypeSettingBase)

export default withStyles(styles, { name: 'AppointmentTypeSetting' })(
  ConnectedAppointmentType,
)
