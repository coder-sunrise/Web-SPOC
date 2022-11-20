import React, { Fragment, memo } from 'react'
import { Row, Col, Divider } from 'antd'
import { connect } from 'umi'
// umi locale
import { FormattedMessage, formatMessage } from 'umi'
// formik
import { FastField, withFormik, Field } from 'formik'
// material ui
import { Hidden, withStyles } from '@material-ui/core'
import PersonAdd from '@material-ui/icons/PersonAdd'
import Search from '@material-ui/icons/Search'
import Add from '@material-ui/icons/Add'
import { DoctorProfileSelect } from '@/components/_medisys'
// custom components
import {
  Button,
  Checkbox,
  GridContainer,
  GridItem,
  TextField,
  ProgressButton,
  VisitTypeSelect,
  Tooltip,
  CodeSelect,
} from '@/components'
// sub component
import Authorized from '@/utils/Authorized'
import StatusFilterButton from './StatusFilterButton'

const styles = () => ({
  actionBar: { marginBottom: '10px' },
  switch: { display: 'inline-block', width: '100px' },
})

const Filterbar = props => {
  const {
    classes,
    dispatch,
    toggleNewPatient,
    handleSubmit,
    setFieldValue,
    selfOnly,
    hideSelfOnlyFilter,
    user,
    setSearch,
    loading,
    queueLog,
    values,
  } = props

  const onSwitchClick = e => {
    dispatch({ type: 'queueLog/toggleSelfOnly' })
    dispatch({
      type: 'queueLog/saveUserPreference',
      payload: {
        userPreferenceDetails: {
          value: {
            selfOnly: e.target.value,
          },
          Identifier: 'Queue',
        },
        itemIdentifier: 'Queue',
        type: '9',
      },
    })
  }
  const clinicRoleFK = user.clinicianProfile.userProfile.role?.clinicRoleFK
  const doctorId = user.clinicianProfile?.doctorProfile?.id
  // const { currentFilter } = queueLog
  return (
    <div className='div-reception-header'>
      <Row wrap={false}>
        <Col flex='auto'>
          <Fragment>
            {clinicRoleFK === 2 && (
              <FastField
                name='visitType'
                render={args => (
                  <Tooltip placement='right' title='Filter by visit type.'>
                    <VisitTypeSelect
                      label='Visit Type'
                      {...args}
                      mode='multiple'
                      // disabled={currentFilter === 'Appointment'}
                      style={{
                        width: 180,
                        marginLeft: 10,
                      }}
                      maxTagPlaceholder='Visit Types'
                      allowClear={true}
                      onChange={(v, op = {}) => {
                        dispatch({
                          type: 'queueLog/saveUserPreference',
                          payload: {
                            userPreferenceDetails: {
                              value: {
                                visitType: v,
                              },
                              Identifier: 'Queue',
                            },
                            itemIdentifier: 'Queue',
                            type: '9',
                          },
                        })
                      }}
                      maxTagCount={0}
                    />
                  </Tooltip>
                )}
              />
            )}
            {clinicRoleFK === 2 && (
              <FastField
                name='room'
                render={args => (
                  <Tooltip placement='right' title='Filter by room.'>
                    <CodeSelect
                      style={{
                        width: 160,
                        marginLeft: 10,
                      }}
                      code='ctRoom'
                      label='Room'
                      mode='multiple'
                      maxTagPlaceholder='Room'
                      maxTagCount={0}
                      all={-99}
                      onChange={(v, op = {}) => {
                        dispatch({
                          type: 'queueLog/saveUserPreference',
                          payload: {
                            userPreferenceDetails: {
                              value: {
                                room: v,
                              },
                              Identifier: 'Queue',
                            },
                            itemIdentifier: 'Queue',
                            type: '9',
                          },
                        })
                      }}
                      {...args}
                    />
                  </Tooltip>
                )}
              />
            )}
            {clinicRoleFK === 2 && (
              <FastField
                name='doctor'
                render={args => (
                  <Tooltip placement='right' title='Filter by optometrist.'>
                    <DoctorProfileSelect
                      mode='multiple'
                      {...args}
                      style={{
                        width: 160,
                        marginLeft: 10,
                      }}
                      allValue={-99}
                      allValueOption={{
                        id: -99,
                        clinicianProfile: {
                          name: 'All',
                        },
                      }}
                      onChange={(v, op = {}) => {
                        dispatch({
                          type: 'queueLog/saveUserPreference',
                          payload: {
                            userPreferenceDetails: {
                              value: {
                                doctor: v,
                              },
                              Identifier: 'Queue',
                            },
                            itemIdentifier: 'Queue',
                            type: '9',
                          },
                        })
                      }}
                      maxTagCount={0}
                      labelField='clinicianProfile.name'
                    />
                  </Tooltip>
                )}
              />
            )}
            <FastField
              name='search'
              render={args => (
                <Tooltip
                  placement='right'
                  title='Filter by Patient Name, Ref. No., Acc. No or Contact No.'
                >
                  <TextField
                    {...args}
                    autocomplete='off'
                    label='Patient Name, Ref/Acc No, Contact No'
                    onChange={e => setSearch(e.target.value)}
                    bind='patientSearch/query'
                    useLeading={false}
                    style={{
                      width: 290,
                      position: 'relative',
                      marginLeft: 10,
                      top: -9,
                    }}
                    debounceDuration={500}
                  />
                </Tooltip>
              )}
            />
            <div
              style={{
                display: 'inline-block',
                position: 'relative',
                top: -10,
                marginLeft: 10,
              }}
            >
              <Authorized authority='queue.registervisit'>
                <ProgressButton
                  variant='contained'
                  color='primary'
                  icon={
                    <Hidden mdDown>
                      <Add />
                    </Hidden>
                  }
                  onClick={() => {
                    handleSubmit()
                  }}
                  size='sm'
                  submitKey='patientSearch/query'
                >
                  New Visit
                </ProgressButton>
              </Authorized>
              <Authorized authority='patientdatabase.newpatient'>
                <Button
                  icon={null}
                  color='primary'
                  size='sm'
                  onClick={() => {
                    toggleNewPatient()
                    setFieldValue('search', '')
                    setSearch('')
                  }}
                  disabled={loading.global}
                >
                  <Hidden mdDown>
                    <PersonAdd />
                  </Hidden>
                  <FormattedMessage id='reception.queue.createPatient' />
                </Button>
              </Authorized>

              {/* {clinicRoleFK === 1 && !hideSelfOnlyFilter && (
                <div className={classes.switch}>
                  <Checkbox
                    label='My Patient'
                    onChange={onSwitchClick}
                    checked={selfOnly}
                  />
                </div>
              )} */}
            </div>
          </Fragment>
        </Col>
        <Col flex='none'>
          <div
            style={{
              width: 650,
              display: 'flex',
              marginTop: 5,
              marginBottom: 5,
              justifyContent: 'flex-end',
            }}
          >
            <StatusFilterButton
              clinicRoleFK={clinicRoleFK}
              doctorId={doctorId}
              roomIds={
                // Student only able to see the visit which set to current room
                clinicRoleFK === 3
                  ? [parseInt(localStorage.getItem('roomLocalIdentityID'), 10)]
                  : []
              }
              // optometrist only able to see the visit which primary doctor is him/her self
              doctorIds={clinicRoleFK === 1 ? [doctorId] : []}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

const connectedFilterbar = connect(({ queueLog, user, loading }) => ({
  selfOnly: queueLog.selfOnly,
  hideSelfOnlyFilter: queueLog.hideSelfOnlyFilter,
  user: user.data,
  loading,
}))(Filterbar)

const FilterbarWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ queueLog }) => {
    const { visitType, doctor, room } = queueLog.queueFilterBar || {}
    return {
      search: '',
      visitType: visitType || [],
      doctor: doctor || [],
      room: room || [],
    }
  },
  handleSubmit: ({ search }, { props }) => {
    const { onRegisterVisitEnterPressed } = props
    onRegisterVisitEnterPressed(search)
  },
})(connectedFilterbar)

export default memo(withStyles(styles)(FilterbarWithFormik))
