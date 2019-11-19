import React, { PureComponent } from 'react'
import moment from 'moment'
import { formatMessage } from 'umi/locale'
import { Paper, withStyles } from '@material-ui/core'
import { connect } from 'dva'
import {
  GridContainer,
  GridItem,
  DatePicker,
  NumberInput,
  CustomInput,
  TextField,
  CardContainer,
  CodeSelect,
  withFormikExtend,
  Field,
  FastField,
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

class DetailsHeader extends PureComponent {
  render () {
    const { classes, history, values } = this.props

    // const outstandingBalanceStyle = (v) => {
    //   if (v > 0) {
    //     return 'red'
    //   }
    //   return 'green'
    // }

    return (
      <CardContainer hideHeader size='sm'>
        <GridContainer xs={12}>
          <GridContainer item md={3} alignItems='flex-start'>
            <GridItem md={5}>
              <h5 className={classes.boldText}>Statement No.: </h5>
            </GridItem>
            <GridItem md={3}>
              <Field
                name='statementNo'
                render={(args) => (
                  <TextField
                    disabled
                    noUnderline
                    style={{ padding: 0 }}
                    {...args}
                  />
                )}
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
            <GridItem md={5}>
              <Field
                name='copayerFK'
                render={(args) => (
                  <CodeSelect
                    code='ctcopayer'
                    disabled
                    noUnderline
                    labelField='displayValue'
                    {...args}
                  />
                )}
              />
            </GridItem>

            <GridItem md={5}>
              <h5 className={classes.boldText}>Payment Term: </h5>
            </GridItem>
            <GridItem md={3}>
              <Field
                name='paymentTerm'
                render={(args) => (
                  <TextField
                    disabled
                    noUnderline
                    suffix='Days'
                    style={{ padding: 0 }}
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
              <Field
                name='adminChargeValue'
                render={(args) => {
                  return <NumberInput {...amountProps} {...args} />
                }}
              />
            </GridItem>
            <GridItem md={4} />
            <GridItem md={5}>
              <h5 className={classes.boldText}>Payable Amount: </h5>
            </GridItem>
            <GridItem md={3}>
              <FastField
                name='totalAmount'
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
                name='collectedAmount'
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
