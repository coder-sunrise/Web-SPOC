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

@connect(({ purchaseOrder }) => ({
  purchaseOrder,
}))
@withFormik({
  displayName: 'purchaseOrder',
  mapPropsToValues: ({ purchaseOrder }) => {
    return purchaseOrder.entity || purchaseOrder.default
  },
})
class POSummary extends PureComponent {
  addAdjustment = () => {
    this.arrayHelpers.push({
      adjTitle: 'test',
      adjAmount: 0.5,
      isDeleted: false,
    })
  }

  render() {
    const { props } = this
    const { values } = props

    return (
      <React.Fragment>
        <GridContainer>
          <GridItem xs={2} md={9} />
          <GridItem xs={10} md={3}>
            <NumberInput
              prefix={formatMessage({
                id: 'inventory.pr.detail.pod.summary.subTotal',
              })}
              defaultValue={190}
              {...amountProps}
            />
          </GridItem>
        </GridContainer>

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
              onClick={this.addAdjustment}
            >
              <Add />
            </Button>
          </GridItem>
        </GridContainer>

        <FieldArray
          name='adjustmentList'
          render={(arrayHelpers) => {
            this.arrayHelpers = arrayHelpers
            if (!values.adjustmentList) return null
            return values.adjustmentList.map((v, i) => {
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
            <Field
              name='gstEnabled'
              render={(args) => (
                <Switch
                  {...args}
                />
              )}
            />
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
            <NumberInput
              prefix={formatMessage({
                id: 'inventory.pr.detail.pod.summary.total',
              })}
              defaultValue={203.3}
              {...amountProps}
            />
          </GridItem>
        </GridContainer>
      </React.Fragment>
    )
  }
}
export default POSummary
