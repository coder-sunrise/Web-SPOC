import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Paper, Divider, Chip } from '@material-ui/core'
import _ from 'lodash'
import {
  GridContainer,
  GridItem,
  withFormikExtend,
  Field,
  NumberInput,
  FastField,
  OutlinedTextField,
  Switch,
  CodeSelect,
  Select,
} from '@/components'
import Yup from '@/utils/yup'
import { calculateAdjustAmount } from '@/utils/utils'

const rangeReg = /(\d+)\s?-?\s?(\d*)/gim
// @Authorized.Secured('queue.dispense.editorder')
@connect(({ codetable, global }) => ({ codetable, global }))
@withFormikExtend({
  // authority: [
  //   'queue.dispense.editorder',
  // ],
  // notDirtyDuration: 0, // this page should alwasy show warning message when leave
  mapPropsToValues: ({
    dentalChartComponent = {},
    codetable,
    orders,
    ...rest
  }) => {
    if (
      orders.entity &&
      orders.entity.treatmentFK &&
      _.isEmpty(dentalChartComponent)
    ) {
      const treatment = (codetable.cttreatment || [])
        .find((o) => o.id === orders.entity.treatmentFK)
      return {
        ...orders.entity,
        treatmentCategoryFK: treatment ? treatment.treatmentCategoryFK : null,
      }
    }
    // console.log(dentalChartComponent, dentalChartTreatment)
    const { data = [], action = {} } = dentalChartComponent
    const { entity = {} } = orders
    const { rows } = orders
    // console.log(action, data, rows)
    // console.log(rest, this)

    const treatment =
      (codetable.cttreatment || [])
        .find((o) => o.id === action.dentalTreatmentFK) || {}
    const existedTooths = []
    const otherTreatmentTooths = []
    rows
      .filter(
        (o) => o.type === '7' && o.treatmentFK === action.dentalTreatmentFK,
      )
      .forEach((r) => {
        let matches = (r.itemNotes || '').matchAll(rangeReg)
        for (let result of matches) {
          if (result[2]) {
            for (
              let index = Number(result[1]);
              index <= Number(result[2]);
              index++
            ) {
              if (r.uid !== entity.uid) {
                otherTreatmentTooths.push(index)
              } else {
                existedTooths.push(index)
              }
            }
          } else if (r.uid !== entity.uid) {
            otherTreatmentTooths.push(Number(result[1]))
          } else {
            existedTooths.push(Number(result[1]))
          }
        }
      })

    // console.log(existedTooths, otherTreatmentTooths)
    const dataFiltered = data.filter(
      (o) =>
        // o.id === action.id &&
        o.action.dentalTreatmentFK === treatment.id &&
        (existedTooths.indexOf(o.toothNo) >= 0 ||
          otherTreatmentTooths.indexOf(o.toothNo) < 0),
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

    let groupsAry = []
    let quantity
    if (treatment.id) {
      let groups = _.groupBy(dataFiltered, 'toothNo')
      groupsAry = Object.keys(groups).map((k) => {
        return {
          text: `#${k}(${groups[k].map((o) => o.name).join(',')})`.replace(
            '(tooth)',
            '',
          ),
          items: groups[k],
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
    // console.log(entity)
    let { adjType, adjValue = 0, unitPrice } = entity
    if (!unitPrice || action.id !== entity.treatmentFK) {
      unitPrice = treatment.sellingPrice
    }
    const totalPrice = unitPrice * quantity || undefined
    // console.log(groupsAry)
    // console.log(action, entity, treatment, unitPrice)
    const isExactAmount = adjType === 'ExactAmount'

    const final = calculateAdjustAmount(isExactAmount, totalPrice, adjValue)
    return {
      isExactAmount,
      isActive: true,
      ...orders.entity,
      unitPrice,
      chartMethodFK: action.id,
      treatmentFK: treatment.id,
      itemName: treatment.displayValue,
      totalPrice,
      adjustment: adjValue,
      adjType: isExactAmount ? 'ExactAmount' : 'Percentage',
      adjAmount: final.adjAmount,
      totalAfterItemAdjustment: final.amount || undefined,
      quantity,
      groups: groupsAry,
      itemNotes: groupsAry.map((o) => o.text).join(','),
    }
  },
  validationSchema: Yup.object().shape({
    quantity: Yup.number()
      .min(1, 'Need apply at least one treatment')
      .required(),
    unitPrice: Yup.number().required(),
    treatmentFK: Yup.number().required(),
  }),
  handleReset: () => {
    const { setValues, orders } = this.props
    setValues({
      ...orders.defaultTreatment,
      type: orders.type,
    })
  },
  handleSubmit: async (values, { props, onConfirm }) => {
    const { dispatch, orders, currentType, getNextSequence } = props

    const data = {
      sequence: getNextSequence(),
      ...values,
      subject: currentType.getSubject(values),
      instruction: values.itemNotes,
      isDeleted: false,
      totalAfterItemAdjustment: values.totalAfterItemAdjustment,
      type: '7',
    }
    // console.log(data)
    dispatch({
      type: 'orders/upsertRow',
      payload: data,
    })

    dispatch({
      type: 'dentalChartComponent/updateState',
      payload: {
        action: undefined,
      },
    })

    if (onConfirm) onConfirm()
  },
  enableReinitialize: true,
  displayName: 'TreatmentForm',
})
class Treatment extends PureComponent {
  constructor (props) {
    super(props)
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'cttreatment',
      },
    })
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctchartmethod',
      },
    })
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.orders.type === this.props.type)
      if (
        (!this.props.global.openAdjustment &&
          nextProps.global.openAdjustment) ||
        nextProps.orders.shouldPushToState
      ) {
        nextProps.dispatch({
          type: 'orders/updateState',
          payload: {
            entity: nextProps.values,
            shouldPushToState: false,
          },
        })
      }
  }

  setTotalPrice = () => {
    const { setFieldValue, values, disableEdit } = this.props
    if (disableEdit === false) {
      if (values.unitPrice) {
        const total = (values.quantity || 0) * values.unitPrice
        setFieldValue('totalPrice', total)
        this.updateTotalPrice(total)
      }
    }
  }

  updateTotalPrice = (v) => {
    if (v || v === 0) {
      const { adjType, adjValue } = this.props.values
      const adjustment = calculateAdjustAmount(
        adjType === 'ExactAmount',
        v,
        adjValue,
      )
      this.props.setFieldValue('totalAfterItemAdjustment', adjustment.amount)
      this.props.setFieldValue('adjAmount', adjustment.adjAmount)
    } else {
      this.props.setFieldValue('totalAfterItemAdjustment', undefined)
      this.props.setFieldValue('adjAmount', undefined)
    }
  }

  changeTreatment = (option = {}) => {
    const { setFieldValue } = this.props

    const { sellingPrice } = option

    setFieldValue('unitPrice', sellingPrice)
  }

  updateValueToStore = (vals) => {
    this.props.dispatch({
      type: 'orders/updateState',
      payload: {
        entity: {
          ...this.props.values,
          ...vals,
        },
      },
    })
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.orders.type === this.props.type)
      if (
        (!this.props.global.openAdjustment &&
          nextProps.global.openAdjustment) ||
        nextProps.orders.shouldPushToState
      ) {
        nextProps.dispatch({
          type: 'orders/updateState',
          payload: {
            entity: nextProps.values,
            shouldPushToState: false,
          },
        })
      }
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
      codetable = {},
      footer,
      handleSubmit,
      from,
    } = this.props
    // const {
    //   data = [],
    //   isPedoChart,
    //   isSurfaceLabel,
    //   action = {},
    // } = dentalChartComponent
    const isDoctor = from === 'doctor'
    const { cttreatment = [] } = codetable
    // console.log(cttreatment)
    return (
      <div>
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
              name='remark'
              render={(args) => (
                <OutlinedTextField
                  // autoFocus
                  label='Treatment Details'
                  multiline
                  maxLength={2000}
                  rowsMax={6}
                  rows={6}
                  onChange={(e) => {
                    this.updateValueToStore({
                      remark: e.target.value,
                    })
                  }}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs={12} md={4}>
            {!isDoctor && (
              <FastField
                name='treatmentCategoryFK'
                render={(args) => (
                  <CodeSelect
                    label='Treatment Category'
                    code='cttreatmentcategory'
                    labelField='name'
                    onChange={() => setFieldValue('treatmentFK', undefined)}
                    {...args}
                  />
                )}
              />
            )}
            <FastField
              name='treatmentFK'
              render={(args) => (
                <Select
                  options={
                    isDoctor ? (
                      cttreatment
                    ) : (
                      cttreatment.filter(
                        (o) =>
                          o.treatmentCategoryFK === values.treatmentCategoryFK,
                      )
                    )
                  }
                  valueField='id'
                  labelField='displayValue'
                  label='Treatment'
                  disabled={isDoctor}
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
                      this.setTotalPrice()
                    }, 1)
                  }}
                  disabled={isDoctor && values.chartMethodFK}
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
                      this.setTotalPrice()
                    }, 1)
                  }}
                  {...args}
                />
              )}
            />
            <FastField
              name='totalPrice'
              render={(args) => {
                return <NumberInput label='Total' disabled currency {...args} />
              }}
            />
            <FastField
              name='totalAfterItemAdjustment'
              render={(args) => (
                <NumberInput
                  disabled
                  currency
                  label='Total After Adj'
                  {...args}
                />
              )}
            />
          </GridItem>
        </GridContainer>
        {footer({
          onSave: handleSubmit,
          onReset: this.handleReset,
        })}
      </div>
    )
  }
}

export default Treatment
