import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
// umi locale
import { FormattedMessage, formatMessage } from 'umi/locale'
// formik
import { FastField, withFormik } from 'formik'
// material ui
import { CircularProgress, withStyles } from '@material-ui/core'
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
import StatisticIndicator from './StatisticIndicator'

const styles = () => ({
  cardTitle: {
    marginTop: '0',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
  },
  rightButtons: { float: 'right' },
  actionBar: { marginBottom: '10px' },
  spacing: {
    marginBottom: '10px',
  },
  sessionNo: {
    float: 'left',
  },
  toolBtns: {
    marginBottom: 20,
  },
  textBox: {
    width: '50%',
  },
})

@withFormik({
  mapPropsToValues: () => ({
    search: '',
  }),
  handleSubmit: ({ search }, { props }) => {
    const { onRegisterVisitEnterPressed } = props
    onRegisterVisitEnterPressed(search)
  },
})
class DetailsActionBar extends PureComponent {
  static propTypes = {
    onRegisterVisitEnterPressed: PropTypes.func,
    toggleNewPatient: PropTypes.func,
  }

  render () {
    const { classes, toggleNewPatient, handleSubmit, values } = this.props
    return (
      <GridContainer className={classnames(classes.actionBar)}>
        <GridItem xs={6} sm={6} md={6} lg={7} container alignItems='center'>
          <FastField
            name='search'
            render={(args) => {
              return (
                <TextField
                  label={formatMessage({
                    id: 'reception.queue.registerVisitTextBox',
                  })}
                  fullWidth={false}
                  className={classes.textBox}
                  {...args}
                />
              )
            }}
          />
          <ProgressButton
            variant='contained'
            color='primary'
            icon={<Search />}
            onClick={handleSubmit}
            size='sm'
            submitKey='patientSearch/query'
          >
            Search
          </ProgressButton>

          <Button color='primary' size='sm' onClick={toggleNewPatient}>
            <PersonAdd />
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
          <StatisticIndicator />
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles)(DetailsActionBar)
