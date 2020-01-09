import React, { Component } from 'react'
import router from 'umi/router'
import { Paper, Divider, Chip } from '@material-ui/core'

import { isNumber } from 'util'
import * as Yup from 'yup'

import _ from 'lodash'

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
    ...rest
  }) => {
    const { data = [], action = {} } = dentalChartComponent
    const { entity = {}, rows } = dentalChartTreatment

    // console.log(rest, this)
    let groupsAry = []
    if (!action.isDisplayInDiagnosis) {
      let groups = _.groupBy(
        data.filter(
          (o) =>
            o.id === action.id &&
            (!rows.find((m) => m.toothInfo.indexOf(`#${o.toothIndex}`) >= 0) ||
              (entity.treatmentFK === action.id &&
                entity.toothInfo.indexOf(`#${o.toothIndex}`) >= 0)),
        ),
        'toothIndex',
      )
      groupsAry = Object.keys(groups).map((k) => {
        return {
          text: `#${k}(${groups[k].map((o) => o.name).join(',')})`.replace(
            '(tooth)',
            '',
          ),
          items: groups[k],
        }
      })
      // let tooth = groupsAry.map((o) => o.text).join(',')
      if (action.chartMethodTypeFK === 3) {
        groupsAry = Object.values(
          _.groupBy(data.filter((o) => o.id === action.id), 'nodes'),
        ).map((o) => {
          // console.log(o[0].nodes)
          const { nodes } = o[0]
          return {
            text: `#${nodes[0]} - ${nodes[1]}`,
            items: o,
          }
        })
      }
    }
    const treatment =
      (codetable.cttreatment || [])
        .find((o) => o.chartMethodFK === action.id) || {}
    let { isExactAmount, adjustment = 0, unitPrice = 0 } = entity
    if (!unitPrice || action.id !== entity.treatmentFK) {
      unitPrice = treatment.sellingPrice || 0
    }
    // console.log(treatment, action)
    // console.log(action, entity, treatment, unitPrice)
    return {
      isExactAmount: false,
      ...dentalChartTreatment.entity,
      unitPrice,

      treatmentFK: treatment.id,
      finalAmount: calculateAdjustAmount(
        isExactAmount,
        unitPrice * groupsAry.length,
        -adjustment,
      ).amount,
      unit: groupsAry.length,
      groups: groupsAry,
      toothInfo: groupsAry.map((o) => o.text).join(','),
    }
  },
  validationSchema: Yup.object().shape({
    unit: Yup.number().required(),
    unitPrice: Yup.number().required(),
    treatmentFK: Yup.number().required(),
  }),
  handleSubmit: async (values, { props }) => {
    const { dispatch } = props
    dispatch({
      type: 'dentalChartTreatment/upsertRow',
      payload: {
        ...values,
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
    const { isExactAmount, adjustment = 0, unitPrice = 0, unit = 0 } = values
    // console.log(calculateAdjustAmount(isExactAmount, unitPrice, -adjustment))
    const subTotal = calculateAdjustAmount(
      isExactAmount,
      unitPrice * unit,
      -adjustment,
    )
    // console.log(subTotal)
    setFieldValue('finalAmount', subTotal.amount)
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
      pedoChart,
      surfaceLabel,
      action = {},
    } = dentalChartComponent

    // console.log(values)
    // console.log(data.filter((o) => o.id === action.id))
    // const groups = _.groupBy(
    //   data.filter((o) => o.id === action.id),
    //   'toothIndex',
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
                {values.groups.map((o) => {
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
                name='details'
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
                        details: e.target.value,
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
                name='unit'
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
                    onChange={(v) => {}}
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
                              onChange={() => {
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
                name='finalAmount'
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
                // this.props.resetForm()
              }}
            >
              Discard
            </Button>
            <ProgressButton color='primary' onClick={this.props.handleSubmit}>
              {values.id ? 'Update' : 'Add'}
            </ProgressButton>
          </p>
        </Paper>
        <TreatmentGrid {...this.props} />
      </div>
    )
  }
}

export default TreatmentForm
