import React, { memo } from 'react'
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
  GridContainer,
  GridItem,
  TextField,
  ProgressButton,
} from '@/components'
// sub component
import StatusFilterButton from './StatusFilterButton'

const styles = () => ({
  actionBar: { marginBottom: '10px' },
})
const Filterbar = ({ classes, toggleNewPatient, handleSubmit }) => (
  <GridContainer className={classes.actionBar} alignItems='center'>
    <GridItem xs={6} sm={6} md={6} lg={4}>
      <FastField
        name='search'
        render={(args) => {
          return (
            <TextField
              label='Register visit (Patient Name, Acc No., Phone No.)'
              {...args}
            />
          )
        }}
      />
    </GridItem>
    <GridItem xs={6} sm={6} md={6} lg={3}>
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
        Search
      </ProgressButton>

      <Button color='primary' size='sm' onClick={toggleNewPatient}>
        <Hidden mdDown>
          <PersonAdd />
        </Hidden>
        <FormattedMessage id='reception.queue.createPatient' />
      </Button>
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

const FilterbarWithFormik = withFormik({
  mapPropsToValues: () => ({
    search: '',
  }),
  handleSubmit: ({ search }, { props }) => {
    const { onRegisterVisitEnterPressed } = props
    onRegisterVisitEnterPressed(search)
  },
})(Filterbar)

export default memo(withStyles(styles)(FilterbarWithFormik))
