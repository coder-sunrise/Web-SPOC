import React, { PureComponent } from 'react'
import moment from 'moment'
import { FastField, withFormik } from 'formik'
import { withStyles } from '@material-ui/core'
import { formatMessage, FormattedMessage } from 'umi/locale'
import {
  GridContainer,
  GridItem,
  NumberInput,
  EditableTableGrid,
  CommonTableGrid,
  Select,
  TextField,
  Button,
} from '@/components'

const styles = () => ({
  grid: {
    marginTop: 10,
    marginBottom: 10,
  },
})

@withFormik({
  mapPropsToValues: () => ({
    PaymentAmount: 20,
    Total: 20,
  }),
})
class CollectPaymentConfirm extends PureComponent {
  state = {
    rows: [
      {
        id: 'PT-000001A',
        invoiceNo: 'IV-000001',
        invoiceDate: moment()
          .add(Math.ceil(Math.random() * 100) - 100, 'days')
          .format('LLL'),
        patientName: 'Patient 01',
        adminCharge: 1.66,
        payableAmount: 50,
        outstandingBalance: 48.34,
        payment: 48.34,
      },
    ],
    columns: [
      { name: 'invoiceNo', title: 'Invoice No' },
      { name: 'invoiceDate', title: 'Invoice Date' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'adminCharge', title: 'Admin Charge' },
      { name: 'payableAmount', title: 'Payable Amount' },
      { name: 'outstandingBalance', title: 'Outstanding' },
      { name: 'payment', title: 'Payment' },
    ],
    columnExtensions: [
      {
        columnName: 'adminCharge',
        type: 'number',
        currency: true,
      },
      {
        columnName: 'payableAmount',
        type: 'number',
        currency: true,
      },
      {
        columnName: 'outstandingBalance',
        type: 'number',
        currency: true,
      },
      { columnName: 'invoiceDate', type: 'date', format: 'DD MMM YYYY' },
      {
        columnName: 'payment',
        // type: 'number',
        currency: true,
        render: (row) => {
          return (
            <GridItem xs={8}>
              <FastField
                name={`packageValueDto[${row.rowIndex - 1}].itemValue`}
                render={(args) => <NumberInput {...args} />}
              />
            </GridItem>
          )
        },
      },
    ],
  }

  render () {
    const { rows, columns, columnExtensions } = this.state
    const { classes, onConfirm } = this.props
    return (
      <React.Fragment>
        {/* <GridContainer
          direction='column'
          justify='space-between'
          alignItems='center'
        >
          <GridItem className={classes.grid} xs md={6}>
            <FastField
              name='PaymentAmount'
              render={(args) => (
                <NumberInput
                  {...args}
                  disabled
                  currency
                  prefixProps={{ style: { width: '65%' } }}
                  prefix={formatMessage({
                    id: 'finance.collectPayment.paymentAmount',
                  })}
                />
              )}
            />
          </GridItem>
          <GridItem xs> */}
        <CommonTableGrid
          rows={rows}
          columns={columns}
          columnExtensions={columnExtensions}
          FuncProps={{ pager: false }}
          // height={300}
        />
        {/* </GridItem>
        </GridContainer>
        <GridContainer
          classes={{ grid: classes.grid }}
          direction='column'
          justify='flex-end'
          alignItems='flex-end'
        >
          <GridItem xs md={6}>
            <FastField
              name='Total'
              render={(args) => (
                <NumberInput
                  {...args}
                  disabled
                  currency
                  prefix={formatMessage({
                    id: 'finance.collectPayment.total',
                  })}
                />
              )}
            />
          </GridItem> */}
        {/* </GridContainer> */}

        <GridContainer style={{ marginTop: 20 }}>
          <GridItem container>
            <GridItem md={6}>
              <FastField
                name='amount'
                render={(args) => (
                  <NumberInput {...args} disabled currency label='Amount' />
                )}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='paymentMode'
                render={(args) => (
                  <Select
                    {...args}
                    label='Payment Mode'
                    options={[
                      { value: 'Giro', name: 'Giro' },
                      { value: 'Cash', name: 'Cash' },
                    ]}
                  />
                )}
              />
            </GridItem>
          </GridItem>

          <GridItem container>
            <GridItem md={12}>
              <FastField
                name='remarks'
                render={(args) => (
                  <TextField {...args} multiline label='Remarks' />
                )}
              />
            </GridItem>
          </GridItem>
        </GridContainer>
        <GridItem container>
          <GridItem style={{ marginTop: 10 }}>
            <Button color='primary'>Confirm Payment</Button>
          </GridItem>
        </GridItem>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(CollectPaymentConfirm)
