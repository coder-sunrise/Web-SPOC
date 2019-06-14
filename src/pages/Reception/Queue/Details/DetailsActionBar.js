import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
// umi locale
import { FormattedMessage, formatMessage } from 'umi/locale'
// material ui
import { CircularProgress, withStyles } from '@material-ui/core'
import { PersonAdd } from '@material-ui/icons'
// custom components
import {
  Button,
  GridContainer,
  GridItem,
  AntdInput,
  TextField,
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
    float: 'right',
    marginTop: '15px',
  },
})

class DetailsActionBar extends PureComponent {
  static propTypes = {
    onRegisterVisitEnterPressed: PropTypes.func,
    toggleNewPatient: PropTypes.func,
    handleStatusChange: PropTypes.func,
  }

  render () {
    const {
      classes,
      toggleNewPatient,
      currentFilter,
      currentSearchPatient,
      handleStatusChange,
      handleQueryChange,
      onRegisterVisitEnterPressed,
      isFetching,
    } = this.props
    return (
      <GridContainer className={classnames(classes.actionBar)}>
        <GridItem xs md={4}>
          <AntdInput
            suffix={isFetching && <CircularProgress size={16} />}
            value={currentSearchPatient}
            onChange={handleQueryChange}
            onEnterPressed={onRegisterVisitEnterPressed}
            label={formatMessage({
              id: 'reception.queue.registerVisitTextBox',
            })}
          />
        </GridItem>

        <GridItem xs md={2} container alignItems='center'>
          <Button size='sm' color='primary' onClick={toggleNewPatient}>
            <PersonAdd />
            <FormattedMessage id='reception.queue.createPatient' />
          </Button>
        </GridItem>
        <GridItem xs md={6} container justify='flex-end' alignItems='center'>
          <StatisticIndicator
            filter={currentFilter}
            handleStatusClick={handleStatusChange}
          />
        </GridItem>
      </GridContainer>
    )
    // return (
    //   <GridContainer className={classNames(classes.spacing)}>
    //     <GridItem xs md={4}>
    //       <FastField
    //         name='SessionNo'
    //         render={(args) => (
    //           <TextField
    //             {...args}
    //             readOnly
    //             prefixProps={{
    //               disableTypography: true,
    //               style: { width: '25%' },
    //             }}
    //             prefix={formatMessage({
    //               id: 'reception.queue.sessionNo',
    //             })}
    //           />
    //         )}
    //       />
    //     </GridItem>
    //     <GridItem xs md={8} container justify='flex-end' alignItems='center'>
    //       <Button color='danger' onClick={this.toggleDrawer}>
    //         <Stop />
    //         <FormattedMessage id='reception.queue.endSession' />
    //       </Button>
    //     </GridItem>
    //   </GridContainer>
    // )
  }
}

export default withStyles(styles)(DetailsActionBar)
