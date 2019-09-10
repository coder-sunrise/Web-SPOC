import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Divider } from '@material-ui/core'
import { formatMessage } from 'umi/locale'
import { Add } from '@material-ui/icons'
import { amountProps } from '../../variables'
import {
  GridContainer,
  GridItem,
  NumberInput,
  Field,
  Switch,
  Tooltip,
  Checkbox,
  Button,
  FieldArray,
  FastField,
  withFormik,
} from '@/components'
import Adjustment from './Adjustment'

class POSummary extends PureComponent {
  // calcTotal = () => {
  //   const { setFieldValue, values } = this.props
  //   const { purchaseOrderItems } = values
  //   let total = 0

  //   purchaseOrderItems.forEach((row) => {
  //     total += row.totalPrice
  //   })

  //   setFieldValue('summaryTotal', total)
  //   return total
  // }

  render () {
    const { props } = this
    const { adjustmentList, toggleInvoiceAdjustment } = props
    console.log('POSummary', this.props)
    return (
      <React.Fragment>
        <GridContainer>
          <GridItem xs={2} md={9} />
          <GridItem xs={10} md={3} container>
            <p>
              {formatMessage({
                id: 'inventory.pr.detail.pod.summary.adjustment',
              })}
            </p>
            &nbsp;&nbsp;&nbsp;
            <Button
              color='primary'
              size='sm'
              justIcon
              key='addAdjustment'
              //onClick={this.addAdjustment}
              onClick={toggleInvoiceAdjustment}
            >
              <Add />
            </Button>
          </GridItem>
        </GridContainer>

        <FieldArray
          name='adjustmentList'
          render={(arrayHelpers) => {
            this.arrayHelpers = arrayHelpers
            if (!adjustmentList) return null
            return adjustmentList.map((v, i) => {
              return (
                <Adjustment
                  key={v.id}
                  index={i}
                  arrayHelpers={arrayHelpers}
                  // propName='purchaseOrder.adjustmentList'
                  {...amountProps}
                  {...props}
                />
              )
            })
          }}
        />

        <GridContainer>
          <GridItem xs={2} md={9} />
          <GridItem xs={10} md={3}>
            <NumberInput
              prefix={formatMessage({
                id: 'inventory.pr.detail.pod.summary.gst',
              })}
              defaultValue={13.3}
              {...amountProps}
            />
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={2} md={9} />
          <GridItem xs={10} md={3}>
            <Field name='gstEnabled' render={(args) => <Switch {...args} />} />
          </GridItem>
          <GridItem xs={2} md={9} />
          <GridItem xs={10} md={3}>
            <FastField
              name='gstIncluded'
              render={(args) => {
                return (
                  <Tooltip
                    title={formatMessage({
                      id: 'inventory.pr.detail.pod.summary.inclusiveGST',
                    })}
                    placement='bottom'
                  >
                    <Checkbox
                      label={formatMessage({
                        id: 'inventory.pr.detail.pod.summary.inclusiveGST',
                      })}
                      {...args}
                    />
                  </Tooltip>
                )
              }}
            />
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={2} md={9} />
          <GridItem xs={10} md={3}>
            <Divider />
          </GridItem>
          <GridItem xs={2} md={9} />
          <GridItem xs={10} md={3}>
            <FastField
              name='summaryTotal'
              render={(args) => {
                return (
                  <NumberInput
                    prefix={formatMessage({
                      id: 'inventory.pr.detail.pod.summary.total',
                    })}
                    //defaultValue={this.calcTotal().toFixed(2)}
                    defaultValue={109.99}
                    {...amountProps}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
      </React.Fragment>
    )
  }
}
export default POSummary
