import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core/styles'

import { Card, CardHeader, CardIcon, CardBody } from 'mui-pro-components'

import SearchBar from './SearchBar/SearchBar'
import DoctorExpenseGrid from './DoctorExpenseGrid'
import { SimpleModal, CommonModal, PageHeaderWrapper } from '@/components'
import ExpenseDetail from './ExpenseDetail'

const styles = (theme) => ({
  root: {
    // padding: theme.spacing.unit * 2,
    // margin: 'auto',
    // maxWidth: 800,
  },
  actionBar: {
    marginTop: theme.spacing.unit * 3,
  },
  radiogroup: {
    marginTop: theme.spacing.unit * 1,
  },
  buttonContainer: {
    padding: '0 10px',
  },
  header: {
    marginTop: 0,
    color: 'black',
  },
})

@connect(({ doctorExpense }) => ({
  doctorExpense,
}))
class DoctorExpense extends PureComponent {
  state = {
    showAddExpense: false,
    showExpenseDetail: false,
    showConfirmDelete: false,
  }

  toggleShowAddExpense = () => {
    const { showAddExpense } = this.state
    this.setState({ showAddExpense: !showAddExpense })
  }

  toggleShowExpenseDetail = () => {
    const { showExpenseDetail } = this.state
    this.setState({ showExpenseDetail: !showExpenseDetail })
  }

  toggleShowConfirmDelete = () => {
    const { showConfirmDelete } = this.state
    this.setState({ showConfirmDelete: !showConfirmDelete })
  }

  render () {
    const { classes } = this.props
    const { showAddExpense, showExpenseDetail, showConfirmDelete } = this.state
    return (
      <PageHeaderWrapper
        title={<FormattedMessage id='app.forms.basic.title' />}
        content={<FormattedMessage id='app.forms.basic.description' />}
      >
        <Card>
          <CardBody>
            <h3 className={classes.header}>
              {formatMessage({ id: 'finance.doctor-expense.title' })}
            </h3>
            <SearchBar onAddExpense={this.toggleShowAddExpense} />
            <DoctorExpenseGrid
              onShowDetails={this.toggleShowExpenseDetail}
              onConfirmDelete={this.toggleShowConfirmDelete}
            />
          </CardBody>
        </Card>
        {showAddExpense && (
          <CommonModal
            open={showAddExpense}
            title={formatMessage({
              id: 'finance.doctor-expense.addDoctorExpenses',
            })}
            onClose={this.toggleShowAddExpense}
            onConfirm={this.toggleShowAddExpense}
            showFooter={false}
            maxWidth='sm'
            adaptFullWidth={false}
          >
            <ExpenseDetail />
          </CommonModal>
        )}
        {showExpenseDetail && (
          <CommonModal
            open={showExpenseDetail}
            title={formatMessage({
              id: 'finance.doctor-expense.viewDoctorExpenses',
            })}
            onClose={this.toggleShowExpenseDetail}
            onConfirm={this.toggleShowExpenseDetail}
            showFooter={false}
            maxWidth='sm'
            adaptFullWidth={false}
          >
            <ExpenseDetail />
          </CommonModal>
        )}
        {showConfirmDelete && (
          <SimpleModal
            title='Are you sure to delete the expenses?'
            open={showConfirmDelete}
            onCancel={this.toggleShowConfirmDelete}
            onConfirm={this.toggleShowConfirmDelete}
          />
        )}
      </PageHeaderWrapper>
    )
  }
}

export default withStyles(styles)(DoctorExpense)
