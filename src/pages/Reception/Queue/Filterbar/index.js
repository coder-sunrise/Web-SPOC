import React, { Fragment, memo } from 'react'
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

  const onSwitchClick = () => dispatch({ type: 'queueLog/toggleSelfOnly' })
  const clinicRoleFK = user.clinicianProfile.userProfile.role?.clinicRoleFK
  const servePatientRight = Authorized.check('queue.servepatient')
  return (
    <div className='div-reception-header'>
      <GridContainer
        className={classes.actionBar}
        justify='flex-start'
        alignItems='center'
      >
        <GridItem xs={12} sm={12} md={5} lg={5}>
          <Fragment>
            <FastField
              name='visitType'
              render={args => (
                <Tooltip
                  placement='right'
                  title='Filter by visit type.'
                >
                  <VisitTypeSelect
                    label='Visit Type'
                    {...args}
                    mode='multiple'
                    style={{ width: 200, marginRight: 10 }}
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

            <FastField
              name='doctor'
              render={args => (
                <Tooltip placement='right' title='Quick filter by primary doctor or reporting doctor.'>
                  <DoctorProfileSelect
                    mode='multiple'
                    {...args}
                    style={{ width: 200, marginRight: 10 }}
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
            <FastField
              name='search'
              render={args => (
                <Tooltip
                  placement='right'
                  title='Filter by Patient Name, Ref. No., Acc. No or Contact No..'
                >
                  <TextField
                    {...args}
                    autocomplete='off'
                    label='Quick Filter'
                    onChange={e => setSearch(e.target.value)}
                    bind='patientSearch/query'
                    useLeading={false}
                    style={{ width: 200, position: 'relative', top: -9 }}
                    debounceDuration={500}
                  />
                </Tooltip>
              )}
            />
          </Fragment>
        </GridItem>
        <GridItem xs={7} sm={7} md={7} lg={3}>
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
                setTimeout(() => {
                  setFieldValue('search', '')
                  setSearch('')
                }, 1000)
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

          {((clinicRoleFK === 1 && !hideSelfOnlyFilter) ||
            (clinicRoleFK === 6 &&
              servePatientRight &&
              servePatientRight.rights !== 'hidden')) && (
            <div className={classes.switch}>
              <Checkbox
                label='My Patient'
                onChange={onSwitchClick}
                checked={selfOnly}
              />
            </div>
          )}
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={12}
          lg={4}
          container
          justify='flex-end'
          alignItems='center'
          style={{ paddingRight: 0 }}
        >
          <StatusFilterButton />
        </GridItem>
      </GridContainer>
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
    const { visitType } = queueLog.queueFilterBar || {}
    const { doctor } = queueLog.queueFilterBar || {}
    return {
      search: '',
      visitType: visitType || [],
      doctor: doctor || [],
    }
  },
  handleSubmit: ({ search }, { props }) => {
    const { onRegisterVisitEnterPressed } = props
    onRegisterVisitEnterPressed(search)
  },
})(connectedFilterbar)

export default memo(withStyles(styles)(FilterbarWithFormik))
