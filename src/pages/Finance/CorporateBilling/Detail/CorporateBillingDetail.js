import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Assignment, FilterList } from '@material-ui/icons'
import { withStyles } from '@material-ui/core'
import { Affix } from 'antd'
import { formatMessage } from 'umi/locale'

import { Button, CommonHeader, CommonModal, NavPills } from '@/components'
import Filter from './Filter'
import ListingMode from './ListingMode'
import DetailsMode from './DetailsMode'
import CollectPayment from '../CollectPayment/CollectPayment'

const styles = () => ({
  collectPaymentBtn: { float: 'right', marginTop: '22px', marginRight: '10px' },
})

@connect(({ corporateBilling }) => ({
  corporateBilling,
}))
class CorporateBillingDetail extends PureComponent {
  state = {
    showCollectPayment: false,
    columns: [
      { name: 'id', title: 'id' },
      { name: 'patientRefNo', title: 'Patient Ref No.' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'invoiceNo', title: 'Invoice No' },
      { name: 'copay', title: 'Co-Pay' },
      { name: 'amount', title: 'Amount' },
      { name: 'outstandingBalance', title: 'O/S Balance' },
      { name: 'payAmount', title: 'Pay Amount', nonEditable: false },
      { name: 'balance', title: 'Balance' },
    ],
  }

  filterList = (item) => {
    const { columns } = this.state
    const cols = columns.map((col) => col.name)
    const list = Object.keys(item).reduce((filtered, key) => {
      return cols.includes(key)
        ? { ...filtered, [key]: item[key] }
        : { ...filtered }
    }, {})
    return list
  }

  toggleCollectPayment = () => {
    const { showCollectPayment, columns } = this.state
    const { corporateBilling: { list }, dispatch } = this.props

    // opening showCollectPayment
    if (!showCollectPayment) {
      dispatch({
        type: 'corporateBilling/updateCollectPaymentList',
        payload: list.map(this.filterList),
      })
    }

    this.setState({ showCollectPayment: !showCollectPayment })
  }

  render () {
    const { theme, classes } = this.props
    const { showCollectPayment } = this.state
    return (
      <CommonHeader
        Icon={<Assignment />}
        titleId='menu.finance.corporate-billing.detail'
      >
        <Affix target={() => window.mainPanel}>
          <Filter />
        </Affix>
        <div className={classes.collectPaymentBtn}>
          <Button color='primary' onClick={this.toggleCollectPayment}>
            <FilterList />
            Collect Payment
          </Button>
        </div>
        <NavPills
          color='primary'
          tabs={[
            {
              tabButton: 'Listing Mode',
              tabContent: (
                <div style={{ padding: theme.spacing.unit }}>
                  <ListingMode />
                </div>
              ),
            },
            {
              tabButton: 'Details Mode',
              tabContent: (
                <div style={{ padding: theme.spacing.unit * 2 }}>
                  <DetailsMode />
                </div>
              ),
            },
          ]}
        />
        <CommonModal
          open={showCollectPayment}
          title={formatMessage({
            id: 'finance.corporate-billing.collectPaymentTitle',
          })}
          onClose={this.toggleCollectPayment}
          onConfirm={this.toggleCollectPayment}
          maxWidth='xl'
          showFooter={false}
        >
          <CollectPayment />
        </CommonModal>
      </CommonHeader>
    )
  }
}

export default withStyles(styles, { withTheme: true })(CorporateBillingDetail)
