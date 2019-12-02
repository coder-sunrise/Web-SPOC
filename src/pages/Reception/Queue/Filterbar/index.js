import React, { memo } from 'react'
import { connect } from 'dva'
// umi locale
import { FormattedMessage, formatMessage } from 'umi/locale'
// formik
import { FastField, withFormik } from 'formik'
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
} from '@/components'
// sub component
import StatusFilterButton from './StatusFilterButton'
import Authorized from '@/utils/Authorized'
import { USER_ROLE } from '@/utils/constants'

const styles = () => ({
  actionBar: { marginBottom: '10px' },
  switch: { display: 'inline-block', minWidth: '200px' },
})

const shouldShowSelfOnlyCheckbox = [
  USER_ROLE.DOCTOR,
  USER_ROLE.DOCTOR_OWNER,
]

const Filterbar = ({
  classes,
  dispatch,
  toggleNewPatient,
  handleSubmit,
  selfOnly,
  user,
  setSearch,
  loading,
}) => {
  const onSwitchClick = () => dispatch({ type: 'queueLog/toggleSelfOnly' })

  return (
    <GridContainer
      className={classes.actionBar}
      justify='flex-start'
      alignItems='center'
    >
      <GridItem xs={3} sm={3} md={3} lg={3}>
        <FastField
          name='search'
          render={(args) => (
            <TextField
              {...args}
              inputProps={{
                autocomplete: 'queue-listing-filterbar-search',
              }}
              label={formatMessage({
                id: 'reception.queue.patientSearchPlaceholder',
              })}
              onChange={(e) => setSearch(e.target.value)}
              bind='patientSearch/query'
              useLeading={false}
              debounceDuration={500}
            />
          )}
        />
      </GridItem>
      <GridItem xs={7} sm={7} md={7} lg={4}>
        <Authorized authority='queue.registervisit'>
          <ProgressButton
            variant='contained'
            color='primary'
            icon={
              <Hidden mdDown>
                <Search />
              </Hidden>
            }
            onClick={handleSubmit}
            size='sm'
            submitKey='patientSearch/query'
          >
            Create Visit
          </ProgressButton>
        </Authorized>
        <Button
          icon={null}
          color='primary'
          size='sm'
          onClick={toggleNewPatient}
          disabled={loading.global}
        >
          <Hidden mdDown>
            <PersonAdd />
          </Hidden>
          <FormattedMessage id='reception.queue.createPatient' />
        </Button>

        {shouldShowSelfOnlyCheckbox.includes(
          user.clinicianProfile.userProfile.role.id,
        ) && (
          <div className={classes.switch}>
            <Checkbox
              label='Visit assign to me only'
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
        lg={5}
        container
        justify='flex-end'
        alignItems='center'
        style={{ paddingRight: 0 }}
      >
        <StatusFilterButton />
      </GridItem>
    </GridContainer>
  )
}

const connectedFilterbar = connect(({ queueLog, user, loading }) => ({
  selfOnly: queueLog.selfOnly,
  user: user.data,
  loading,
}))(Filterbar)

const FilterbarWithFormik = withFormik({
  mapPropsToValues: () => ({
    search: '',
  }),
  handleSubmit: ({ search }, { props }) => {
    const { onRegisterVisitEnterPressed } = props
    onRegisterVisitEnterPressed(search)
  },
})(connectedFilterbar)

export default memo(withStyles(styles)(FilterbarWithFormik))
