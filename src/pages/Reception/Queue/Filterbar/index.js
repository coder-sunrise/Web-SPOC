import React, { memo } from 'react'
import { connect } from 'umi'
// umi locale
import { FormattedMessage, formatMessage } from 'umi'
// formik
import { FastField, withFormik, Field } from 'formik'
// material ui
import { Hidden, withStyles } from '@material-ui/core'
import PersonAdd from '@material-ui/icons/PersonAdd'
import Search from '@material-ui/icons/Search'
// custom components
import {
  Button,
  Checkbox,
  GridContainer,
  GridItem,
  TextField,
  ProgressButton,
  CodeSelect,
} from '@/components'
// sub component
import Authorized from '@/utils/Authorized'
import { getMappedVisitType } from '@/utils/utils'
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
    clinicSettings,
    codetable,
    values,
    queueLog,
  } = props

  const onSwitchClick = () => dispatch({ type: 'queueLog/toggleSelfOnly' })
  const clinicRoleFK = user.clinicianProfile.userProfile.role?.clinicRoleFK
  const servePatientRight = Authorized.check('queue.servepatient')

  const visitTypes = () => {
    const { ctvisitpurpose = [] } = codetable
    const { visitTypeSetting } = clinicSettings

    let visitTypeSettingsObj = undefined
    let visitPurpose = []
    if (visitTypeSetting) {
      try {
        visitTypeSettingsObj = JSON.parse(visitTypeSetting)
      } catch {}
    }
    if ((ctvisitpurpose || []).length > 0) {
      visitPurpose = getMappedVisitType(
        ctvisitpurpose,
        visitTypeSettingsObj,
      ).filter(vstType => vstType['isEnabled'] === 'true')
    }
    return visitPurpose
  }

  const { visitType = [] } = values
  const visittypeCount = visitType.length <= 1 ? 1 : 0
  return (
    <div className='div-reception-header'>
      <GridContainer
        className={classes.actionBar}
        justify='flex-start'
        alignItems='center'
      >
        <GridItem xs={2} sm={2} md={2} lg={2}>
          <Field
            name='visitType'
            render={args => (
              <CodeSelect
                label='Visit Type'
                onChange={(v, op = {}) => {
                  dispatch({
                    type: 'queueLog/saveUserPreference',
                    payload: {
                      userPreferenceDetails: {
                        value: {
                          ...queueLog.queueFilterBar,
                          visitType: v,
                        },
                        Identifier: 'QueueFilterBar',
                      },
                      itemIdentifier: 'QueueFilterBar',
                      type: '9',
                    },
                  })

                  dispatch({
                    type: 'queueLog/updateState',
                    payload: {
                      queueFilterBar: {
                        ...queueLog.queueFilterBar,
                        visitType: v,
                      },
                    },
                  })
                }}
                options={visitTypes()}
                allowClear={false}
                mode='multiple'
                all={-99}
                maxTagCount={visittypeCount}
                maxTagPlaceholder='visit types'
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={3} sm={3} md={3} lg={3}>
          <FastField
            name='search'
            render={args => (
              <TextField
                {...args}
                autocomplete='off'
                // inputProps={{
                //   autocomplete: 'queue-listing-filterbar-search',
                // }}
                label={formatMessage({
                  id: 'reception.queue.patientSearchPlaceholder',
                })}
                onChange={e => setSearch(e.target.value)}
                bind='patientSearch/query'
                useLeading={false}
                debounceDuration={500}
              />
            )}
          />
        </GridItem>
        <GridItem xs={7} sm={7} md={7} lg={3}>
          <Authorized authority='queue.registervisit'>
            <ProgressButton
              variant='contained'
              color='primary'
              icon={
                <Hidden mdDown>
                  <Search />
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
              Create Visit
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
            (clinicRoleFK === 2 &&
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
  mapPropsToValues: ({ queueLog }) => {
    const { visitType } = queueLog.queueFilterBar || {}
    return {
      search: '',
      visitType: visitType || [-99],
    }
  },
  handleSubmit: ({ search }, { props }) => {
    const { onRegisterVisitEnterPressed } = props
    onRegisterVisitEnterPressed(search)
  },
})(connectedFilterbar)

export default memo(withStyles(styles)(FilterbarWithFormik))
