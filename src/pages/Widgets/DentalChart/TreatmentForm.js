import React, { Component } from 'react'
import router from 'umi/router'
import { Paper, Divider, Chip } from '@material-ui/core'

import { isNumber } from 'util'
import * as Yup from 'yup'

import _ from 'lodash'
import { orderTypes } from '@/utils/codes'

// common component
import {
  GridContainer,
  GridItem,
  notification,
  withFormikExtend,
  FastField,
  Field,
  OutlinedTextField,
  TextField,
  NumberInput,
  Button,
  ProgressButton,
  Switch,
  CodeSelect,
} from '@/components'
// utils
import { calculateAdjustAmount } from '@/utils/utils'

import { getAppendUrl } from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import TreatmentGrid from './TreatmentGrid'

// @Authorized.Secured('queue.dispense.editorder')
@withFormikExtend({
  // authority: [
  //   'queue.dispense.editorder',
  // ],
  // notDirtyDuration: 0, // this page should alwasy show warning message when leave
  mapPropsToValues: ({
    dentalChartTreatment,
    dentalChartComponent,
    codetable,
    orders,
    ...rest
  }) => {
    const { data = [], action = {} } = dentalChartComponent
    const { entity = {}, rows } = dentalChartTreatment
    // console.log(action, data, rows)
    // console.log(rest, this)
    const dataFiltered = data.filter(
      (o) => o.id === action.id,
      // &&
      // (!rows.find((m) =>
      //   m.groups.find((k) =>
      //     k.items.find(
      //       (j) => j.action.id === o.id && j.toothNo === o.toothNo,
      //     ),
      //   ),
      // ) ||
      //   (entity.chartMethodFK === action.id &&
      //     entity.groups.find((k) =>
      //       k.items.find((j) => j.toothNo === o.toothNo),
      //     ))),
    )
    // console.log(dataFiltered)
    let treatment = {}
    if (action.id)
      treatment =
        (codetable.cttreatment || [])
          .find((o) => o.chartMethodFK === action.id) || {}

    let groupsAry = []
    let quantity
    if (treatment.id) {
      let gs = _.groupBy(dataFiltered, 'toothNo')
      groupsAry = Object.keys(gs).map((k) => {
        return {
          text: `#${k}(${gs[k].map((o) => o.name).join(',')})`.replace(
            '(tooth)',
            '',
          ),
          items: gs[k],
        }
      })
      // console.log(groupsAry)
      quantity = groupsAry.length
      // let tooth = groupsAry.map((o) => o.text).join(',')
      if (action.chartMethodTypeFK === 3) {
        quantity = 0
        groupsAry = Object.values(_.groupBy(dataFiltered, 'nodes')).map((o) => {
          // console.log(o[0].nodes)
          const { nodes } = o[0]
          quantity += o.length

          return {
            text: `#${nodes[0]} - ${nodes[1]}`,
            items: o,
          }
        })
      }
    }

    let { adjType, adjustment = 0, unitPrice } = entity
    if (!unitPrice || action.id !== entity.treatmentFK) {
      unitPrice = treatment.sellingPrice
    }
    const totalPrice = unitPrice * quantity
    // console.log(groupsAry)
    // console.log(action, entity, treatment, unitPrice)
    const isExactAmount = adjType === 'ExactAmount'

    const final = calculateAdjustAmount(isExactAmount, totalPrice, -adjustment)
    return {
      isExactAmount,
      ...dentalChartTreatment.entity,
      unitPrice,
      chartMethodFK: action.id,
      treatmentFK: treatment.id,
      itemName: treatment.displayValue,
      totalPrice,
      // adjType: isExactAmount ? 'ExactAmount' : 'Percentage',
      adjAmount: Math.abs(final.adjAmount),
      totalAfterItemAdjustment: final.amount,
      quantity,
      // groups: groupsAry,
      toothInfo: groupsAry.map((o) => o.text).join(','),
    }
  },
  validationSchema: Yup.object().shape({
    quantity: Yup.number()
      .min(1, 'Need apply at least one treatment')
      .required(),
    unitPrice: Yup.number().required(),
    treatmentFK: Yup.number().required(),
  }),
  handleSubmit: async (values, { props }) => {
    const { dispatch, orders } = props
    dispatch({
      type: 'dentalChartTreatment/upsertRow',
      payload: {
        ...values,
      },
    })

    const { rows = [] } = orders
    const treatment = orderTypes.find((o) => o.value === '7')
    const data = {
      type: '7',
      sequence:
        _.maxBy(rows.filter((o) => !o.isDeleted), 'sequence').sequence + 1 || 0,
      ...values,
      subject: treatment.getSubject(values),
      isDeleted: false,
      totalPrice: values.unitPrice,
      totalAfterItemAdjustment: values.totalAfterItemAdjustment,
    }
    console.log(data)
    dispatch({
      type: 'orders/upsertRow',
      payload: data,
    })

    dispatch({
      type: 'dentalChartTreatment/updateState',
      payload: {
        entity: undefined,
      },
    })
    dispatch({
      type: 'dentalChartComponent/updateState',
      payload: {
        action: undefined,
      },
    })
  },
  enableReinitialize: true,
  displayName: 'TreatmentForm',
})
class TreatmentForm extends Component {
  // componentWillReceiveProps (nextProps) {
  //   // console.log(_.isEqual(this.props.values, nextProps.values), nextProps)
  //   if (
  //     !_.isEqual(this.props.values.treatmentFK, nextProps.values.treatmentFK)
  //   ) {
  //     console.log(
  //       nextProps.codetable.cttreatment.find(
  //         (o) => o.id === nextProps.values.treatmentFK,
  //       ),
  //     )
  //     this.changeTreatment(
  //       nextProps.codetable.cttreatment.find(
  //         (o) => o.id === nextProps.values.treatmentFK,
  //       ),
  //     )
  //     this.getFinalAmount(nextProps)
  //   }
  // }

  getFinalAmount = (props) => {
    const { values, setFieldValue } = props || this.props
    const {
      isExactAmount,
      adjustment = 0,
      unitPrice = 0,
      quantity = 0,
    } = values
    // console.log(calculateAdjustAmount(isExactAmount, unitPrice, -adjustment))
    const subTotal = calculateAdjustAmount(
      isExactAmount,
      unitPrice * quantity,
      -adjustment,
    )
    // console.log(subTotal)
    setFieldValue('totalAfterItemAdjustment', subTotal.amount)
    setFieldValue('adjAmount', Math.abs(subTotal.adjAmount))
    this.updateValueToStore()
  }

  changeTreatment = (option = {}) => {
    const { setFieldValue } = this.props

    const { sellingPrice } = option

    setFieldValue('unitPrice', sellingPrice)
  }

  updateValueToStore = (vals) => {
    this.props.dispatch({
      type: 'dentalChartTreatment/updateState',
      payload: {
        entity: {
          ...this.props.values,
          ...vals,
        },
      },
    })
  }

  render () {
    const {
      classes,
      dispense,
      consultation,
      dispatch,
      theme,
      dentalChartComponent,
      setFieldValue,
      values,
    } = this.props
    const {
      data = [],
      isPedoChart,
      isSurfaceLabel,
      action = {},
    } = dentalChartComponent

    // console.log(values)
    // console.log(data.filter((o) => o.id === action.id))
    // const groups = _.groupBy(
    //   data.filter((o) => o.id === action.id),
    //   'toothNo',
    // )
    // const tooth = Object.keys(groups)
    //   .map((k) => {
    //     return `#${k}(${groups[k].map((o) => o.name).join(',')})`.replace(
    //       '(tooth)',
    //       '',
    //     )
    //   })
    //   .join(',')
    // console.log(groups)
    // console.log(values)
    const discountCfg = {}
    if (values.isExactAmount) {
      discountCfg.currency = true
    } else {
      discountCfg.percentage = true
      discountCfg.max = 100
      discountCfg.min = 0
    }

    // console.log(discountCfg)
    return (
      <div className={classes.content}>
        <Paper
          style={{
            marginBottom: theme.spacing(1),
            padding: theme.spacing(1, 0),
          }}
        >
          <GridContainer>
            <GridItem xs={12} md={8}>
              {/* <p style={{ marginBottom: 0 }}>Tooth No. {values.tooth}</p> */}
              <p>
                {/* Tooth No.{' '} */}
                {(values.groups || []).map((o) => {
                  return (
                    <Chip
                      // icon={<FaceIcon />}
                      label={o.text}
                      onDelete={() => {
                        dispatch({
                          type: 'dentalChartComponent/toggleMultiSelect',
                          payload: o.items.map((m) => ({
                            ...m,
                            deleted: true,
                          })),
                        })
                        // console.log(o)
                      }}
                      style={{ margin: theme.spacing(0, 0.25, 0.25, 0) }}
                      color='primary'
                    />
                  )
                })}
              </p>
              <FastField
                name='itemsNotes'
                render={(args) => (
                  <OutlinedTextField
                    autoFocus
                    label='Treatment Details'
                    multiline
                    maxLength={2000}
                    rowsMax={6}
                    rows={6}
                    onChange={(e) => {
                      this.updateValueToStore({
                        itemsNotes: e.target.value,
                      })
                    }}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12} md={4}>
              <FastField
                name='treatmentFK'
                render={(args) => (
                  <CodeSelect
                    code='cttreatment'
                    labelField='displayValue'
                    label='Treatment'
                    disabled
                    // onChange={(v, op) => {
                    //   this.changeTreatment(op)
                    // }}
                    {...args}
                  />
                )}
              />
              <FastField
                name='quantity'
                render={(args) => (
                  <NumberInput
                    label='Unit'
                    onChange={() => {
                      setTimeout(() => {
                        this.getFinalAmount()
                      }, 1)
                    }}
                    disabled
                    {...args}
                  />
                )}
              />
              <FastField
                name='unitPrice'
                render={(args) => (
                  <NumberInput
                    label='Unit Price'
                    currency
                    onChange={(v) => {
                      setTimeout(() => {
                        this.getFinalAmount()
                      }, 1)
                    }}
                    {...args}
                  />
                )}
              />
              <Field
                name='adjustment'
                render={(args) => (
                  <NumberInput
                    label='Discount'
                    onChange={() => {
                      setTimeout(() => {
                        this.getFinalAmount()
                      }, 1)
                    }}
                    suffix={
                      <FastField
                        name='isExactAmount'
                        render={(args2) => {
                          return (
                            <Switch
                              simple
                              style={{ top: -3, position: 'relative' }}
                              checkedChildren='$'
                              unCheckedChildren='%'
                              label=''
                              onChange={(v) => {
                                // console.log(v)
                                setFieldValue(
                                  'adjType',
                                  v ? 'ExactAmount' : 'Percentage',
                                )
                                setTimeout(() => {
                                  this.getFinalAmount()
                                }, 1)
                              }}
                              {...args2}
                            />
                          )
                        }}
                      />
                    }
                    {...discountCfg}
                    {...args}
                  />
                )}
              />
              <FastField
                name='totalAfterItemAdjustment'
                render={(args) => (
                  <NumberInput
                    disabled
                    text
                    currency
                    fullWidth
                    rightAlign
                    prefix='Sub Total'
                    style={{ margin: theme.spacing(1, 0) }}
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <Divider light />
          <p style={{ paddingTop: theme.spacing(1), textAlign: 'right' }}>
            <Button
              color='danger'
              onClick={() => {
                dispatch({
                  type: 'dentalChartTreatment/updateState',
                  payload: {
                    entity: undefined,
                  },
                })
                dispatch({
                  type: 'dentalChartComponent/updateState',
                  payload: {
                    action: undefined,
                  },
                })
                // this.props.resetForm()
              }}
            >
              Discard
            </Button>
            <ProgressButton color='primary' onClick={this.props.handleSubmit}>
              {values.uid ? 'Update' : 'Add'}
            </ProgressButton>
          </p>
        </Paper>
        <TreatmentGrid {...this.props} />
      </div>
    )
  }
}

export default TreatmentForm
