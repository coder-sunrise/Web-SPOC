import React, { memo } from 'react'
import { connect } from 'dva'
// umi locale
import { FormattedMessage } from 'umi/locale'
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

const styles = () => ({
  actionBar: { marginBottom: '10px' },
  switch: { display: 'inline-block', minWidth: '200px' },
})
const Filterbar = ({
  classes,
  dispatch,
  toggleNewPatient,
  handleSubmit,
  selfOnly,
  setSearch,
}) => {
  const onSwitchClick = () => dispatch({ type: 'queueLog/toggleSelfOnly' })

  return (
    <GridContainer
      className={classes.actionBar}
      justify='flex-start'
      alignItems='center'
    >
      <GridItem xs={3} sm={3} md={3} lg={2}>
        <FastField
          name='search'
          render={(args) => (
            <TextField
              {...args}
              inputProps={{
                autocomplete: 'queue-listing-filterbar-search',
              }}
              label='Patient Name, Acc No., Phone No.'
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
        />
      </GridItem>
      <GridItem xs={7} sm={7} md={7} lg={5}>
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

        <Button color='primary' size='sm' onClick={toggleNewPatient}>
          <Hidden mdDown>
            <PersonAdd />
          </Hidden>
          <FormattedMessage id='reception.queue.createPatient' />
        </Button>
        <div className={classes.switch}>
          <Checkbox
            label='Visit assign to me only'
            onChange={onSwitchClick}
            checked={selfOnly}
          />
        </div>
      </GridItem>

      <GridItem
        xs={12}
        sm={12}
        md={12}
        lg={5}
        container
        justify='flex-end'
        alignItems='center'
      >
        <StatusFilterButton />
      </GridItem>
    </GridContainer>
  )
}

const connectedFilterbar = connect(({ queueLog }) => ({
  selfOnly: queueLog.selfOnly,
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
