import React, { PureComponent } from 'react'
import classnames from 'classnames'
// umi locale
import { FormattedMessage } from 'umi/locale'
// material ui
import { withStyles } from '@material-ui/core'
import { PersonAdd, Create } from '@material-ui/icons'
// custom components
import { Button, GridContainer, GridItem } from '@/components'
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
    float: 'right',
    marginTop: '15px',
  },
})

class DetailsActionBar extends PureComponent {
  state = {
    currentSearchPatient: '',
  }

  onSearchPatientChange = (event) => {
    const { value } = event.target
    this.setState({ currentSearchPatient: value })
  }

  onRegisterVisitClick = () => {
    const { togglePatientSearch } = this.props
    togglePatientSearch(this.state.currentSearchPatient)
  }

  render () {
    const { currentSearchPatient } = this.state
    const {
      classes,
      togglePatientSearch,
      toggleNewPatient,
      currentFilter,
      handleStatusChange,
    } = this.props
    return (
      <GridContainer className={classnames(classes.actionBar)} spacing={8}>
        {/**  
        <GridItem xs md={3}>
            
              <TextField
                value={currentSearchPatient}
                onChange={this.onSearchPatientChange}
                label={formatMessage({
                  id: 'reception.queue.registerVisitTextBox',
                })}
              />
            
          </GridItem>
        */}
        <GridItem xs md={3} container alignItems='center'>
          <Button size='sm' color='info' onClick={togglePatientSearch}>
            <Create />
            <FormattedMessage id='reception.queue.registerVisit' />
          </Button>
          <Button size='sm' color='primary' onClick={toggleNewPatient}>
            <PersonAdd />
            <FormattedMessage id='reception.queue.createPatient' />
          </Button>
        </GridItem>
        <GridItem xs md={9} container justify='flex-end' alignItems='center'>
          <StatisticIndicator
            filter={currentFilter}
            handleStatusClick={handleStatusChange}
          />
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles)(DetailsActionBar)
