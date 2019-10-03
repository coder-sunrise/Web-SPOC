import React, { PureComponent } from 'react'
import moment from 'moment'
import { formatMessage } from 'umi/locale'
import { withFormik, FastField } from 'formik'
import { Paper, withStyles } from '@material-ui/core'
import {
  GridContainer,
  GridItem,
  DatePicker,
  NumberInput,
  CustomInput,
  TextField,
  CardContainer,
  CodeSelect,
} from '@/components'

const styles = (theme) => ({
  root: {
    padding: '10px',
    marginBottom: '10px',
  },

  boldText: {
    fontWeight: '700',
    marginTop: theme.spacing(1),
  },
})

const amountProps = {
  noUnderline: true,
  currency: true,
  disabled: true,
  rightAlign: true,
  normalText: true,
}

@withFormik({
  mapPropsToValues: () => ({
    statementNo: 'SM-000002',
    coPayer: 1,
    adminCharge: 10,
    paid: 20,
    statementDate: moment().add(-1, 'months'),
    paymentTerm: '30 Days',
    payableAmount: 1233,
    outstandingBalance: 490,
    // paymentDueDate: moment().add(+1, 'months'),
  }),
})
class DetailsHeader extends PureComponent {
  render () {
    const { classes, history, values } = this.props
    return (
      // <Paper className={classes.root}>
      //   <GridContainer item style={boldFont}>
      //     <GridItem xs>
      //       <FastField
      //         name='statementNo'
      //         render={(args) => (
      //           <TextField disabled label='Statement No.' {...args} />
      //         )}
      //       />
      //     </GridItem>

      //     <GridItem xs>
      //       <FastField
      //         name='coPayer'
      //         render={(args) => (
      //           <TextField disabled label='Co-Payer' {...args} />
      //         )}
      //       />
      //     </GridItem>

      //     <GridItem xs>
      //       <FastField
      //         name='adminCharge'
      //         render={(args) => (
      //           <NumberInput disabled currency label='Admin Charge' {...args} />
      //         )}
      //       />
      //     </GridItem>
      //     <GridItem xs>
      //       <FastField
      //         name='paid'
      //         render={(args) => (
      //           <NumberInput disabled currency label='Paid' {...args} />
      //         )}
      //       />
      //     </GridItem>
      //     {/* <GridItem xs>
      //           <FastField
      //             name='Company'
      //             render={(args) => (
      //               <CustomInput
      //                 disabled
      //                 label={formatMessage({
      //                   id: 'finance.statement.company',
      //                 })}
      //                 {...args}
      //               />
      //             )}
      //           />
      //         </GridItem> */}
      //   </GridContainer>

      //   <GridContainer item style={{ fontWeight: 'bold', paddingBottom: 40 }}>
      //     {/* <GridItem xs>
      //           <FastField
      //             name='TotalAmount'
      //             render={(args) => (
      //               <NumberInput
      //                 currency
      //                 disabled
      //                 label={formatMessage({
      //                   id: 'finance.statement.totalAmount',
      //                 })}
      //                 {...args}
      //               />
      //             )}
      //           />
      //         </GridItem>
      //         <GridItem xs>
      //           <FastField
      //             name='OutstandingBalance'
      //             render={(args) => (
      //               <NumberInput
      //                 currency
      //                 disabled
      //                 label={formatMessage({
      //                   id: 'finance.statement.outstandingBalance',
      //                 })}
      //                 {...args}
      //               />
      //             )}
      //           />
      //         </GridItem> */}
      //     <GridItem xs>
      //       <FastField
      //         name='statementDate'
      //         render={(args) => (
      //           <DatePicker disabled label='Statement Date' {...args} />
      //         )}
      //       />
      //     </GridItem>
      //     <GridItem xs>
      //       <FastField
      //         name='paymentTerm'
      //         render={(args) => (
      //           <CustomInput disabled label='Payment Term' {...args} />
      //         )}
      //       />
      //     </GridItem>
      //     <GridItem xs>
      //       <FastField
      //         name='payableAmount'
      //         render={(args) => (
      //           <NumberInput
      //             currency
      //             disabled
      //             label='Payable Amount'
      //             {...args}
      //           />
      //         )}
      //       />
      //     </GridItem>
      //     <GridItem xs>
      //       <FastField
      //         name='outstandingBalance'
      //         render={(args) => (
      //           <NumberInput currency disabled label='O/S Balance' {...args} />
      //         )}
      //       />
      //     </GridItem>

      //     {/* <GridItem xs>
      //       <FastField
      //         name='PaymentDueDate'
      //         render={(args) => (
      //           <DatePicker
      //             disabled
      //             label={formatMessage({
      //               id: 'finance.statement.paymentDueDate',
      //             })}
      //             {...args}
      //           />
      //         )}
      //       />
      //     </GridItem> */}
      //     {/* <GridItem xs lg={4}>
      //       <FastField
      //         name='Remark'
      //         render={(args) => (
      //           <TextField
      //             {...args}
      //             label={formatMessage({
      //               id: 'finance.statement.details.remarks',
      //             })}
      //           />
      //         )}
      //       />
      //     </GridItem> */}
      //   </GridContainer>
      //   <a
      //     style={{
      //       float: 'right',
      //       marginTop: -25,
      //       marginRight: 6,
      //     }}
      //     onClick={() => history.push(`/finance/statement/editstatement`)}
      //   >
      //     Edit statement
      //   </a>
      // </Paper>
      <CardContainer hideHeader size='sm'>
        <GridContainer xs={12}>
          <GridContainer item md={3} alignItems='flex-start'>
            <GridItem md={5}>
              <h5 className={classes.boldText}>Statement No.: </h5>
            </GridItem>
            <GridItem md={3}>
              <FastField
                name='statementNo'
                render={(args) => <TextField disabled noUnderline {...args} />}
              />
            </GridItem>
            <GridItem md={5}>
              <h5 className={classes.boldText}>Statement Date: </h5>
            </GridItem>
            <GridItem md={4}>
              <FastField
                name='statementDate'
                render={(args) => <DatePicker disabled noUnderline {...args} />}
              />
            </GridItem>
          </GridContainer>

          <GridContainer item md={3} alignItems='flex-start'>
            <GridItem md={5}>
              <h5 className={classes.boldText}>Co-Payer: </h5>
            </GridItem>
            <GridItem md={3}>
              <FastField
                name='coPayer'
                render={(args) => (
                  <CodeSelect
                    code='ctcopayer'
                    noUnderline
                    disabled
                    style={{
                      right: -60,
                    }}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem md={4} />
            <GridItem md={5}>
              <h5 className={classes.boldText}>Payment Term: </h5>
            </GridItem>
            <GridItem md={3}>
              <FastField
                name='paymentTerm'
                render={(args) => (
                  <CustomInput
                    disabled
                    noUnderline
                    rightAlign='true'
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>

          <GridContainer item md={3} alignItems='flex-start'>
            <GridItem md={5}>
              <h5 className={classes.boldText}>Admin Charge:</h5>
            </GridItem>
            <GridItem md={3}>
              <FastField
                name='adminCharge'
                render={(args) => <NumberInput {...amountProps} {...args} />}
              />
            </GridItem>
            <GridItem md={4} />
            <GridItem md={5}>
              <h5 className={classes.boldText}>Payable Amount: </h5>
            </GridItem>
            <GridItem md={3}>
              <FastField
                name='payableAmount'
                render={(args) => <NumberInput {...amountProps} {...args} />}
              />
            </GridItem>
            <GridItem md={4} />
            <GridItem md={5}>
              <h5 className={classes.boldText}>&nbsp;</h5>
            </GridItem>
            <GridItem md={7}>
              <h5 className={classes.normalText}>&nbsp;</h5>
            </GridItem>
          </GridContainer>

          <GridContainer item md={3} alignItems='flex-start'>
            <GridItem md={5}>
              <h5 className={classes.boldText}>Paid </h5>
            </GridItem>
            <GridItem md={3}>
              <FastField
                name='paid'
                render={(args) => <NumberInput {...amountProps} {...args} />}
              />
            </GridItem>
            <GridItem md={4} />
            <GridItem md={5}>
              <h5 className={classes.boldText}>O/S Balance: </h5>
            </GridItem>
            <GridItem md={3}>
              <FastField
                name='outstandingBalance'
                render={(args) => <NumberInput {...amountProps} {...args} />}
              />
            </GridItem>
            <GridItem md={4} />
            <GridItem md={5}>
              <h5 className={classes.boldText}>&nbsp;</h5>
            </GridItem>
            <GridItem md={4}>
              <a
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  margin: 10,
                }}
                onClick={() => history.push(`/finance/statement/editstatement`)}
              >
                Edit statement
              </a>
            </GridItem>
          </GridContainer>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(DetailsHeader)
