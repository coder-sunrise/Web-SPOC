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
    const {
      classes,
      toggleNewPatient,
      isFetching,
      handleSubmit,
      values,
    } = this.props
    return (
      <GridContainer className={classnames(classes.actionBar)}>
        <GridItem xs md={3}>
          <FastField
            name='search'
            render={(args) => {
              return (
                <TextField
                  suffix={isFetching && <CircularProgress size={16} />}
                  label={formatMessage({
                    id: 'reception.queue.registerVisitTextBox',
                  })}
                  {...args}
                />
              )
            }}
          />
        </GridItem>

        <GridItem xs md={3} container alignItems='center'>
          <ProgressButton
            variant='contained'
            color='primary'
            icon={<Search />}
            onClick={handleSubmit}
            size='sm'
          >
            Search
          </ProgressButton>

          <Button color='primary' size='sm' onClick={toggleNewPatient}>
            <PersonAdd />
            <FormattedMessage id='reception.queue.createPatient' />
          </Button>
        </GridItem>
        <GridItem xs md={6} container justify='flex-end' alignItems='center'>
          <StatisticIndicator />
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles)(DetailsActionBar)
