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
    ...rest
  }) => {
    const { data = [], action = {} } = dentalChartComponent
    // console.log(rest, this)
    let groups = _.groupBy(
      data.filter((o) => o.value === action.value),
      'toothIndex',
    )
    let groupsAry = Object.keys(groups).map((k) => {
      return {
        text: `#${k}(${groups[k].map((o) => o.name).join(',')})`.replace(
          '(tooth)',
          '',
        ),
        items: groups[k],
      }
    })
    let tooth = groupsAry.map((o) => o.text).join(',')
    if (action.method === 'bridging') {
      groupsAry = Object.values(
        _.groupBy(data.filter((o) => o.value === action.value), 'nodes'),
      ).map((o) => {
        // console.log(o[0].nodes)
        const { nodes } = o[0]
        return {
          text: `#${nodes[0]} - ${nodes[1]}`,
          items: o,
        }
      })
    }

    return {
      finalAmount: 0,
      isExactAmount: false,
      ...dentalChartTreatment.entity,
      unit: groupsAry.length,
      tooth,
      groups: groupsAry,
    }
  },
  validationSchema: Yup.object().shape({
    unit: Yup.number().required(),
    unitPrice: Yup.number().required(),
    code: Yup.number().required(),
  }),
  handleSubmit: async (values, { props }) => {
    const { dispatch } = props
    dispatch({
      type: 'dentalChartTreatment/upsertRow',
      payload: {
        ...values,
      },
    })
  },
  enableReinitialize: true,
  displayName: 'TreatmentForm',
})
class TreatmentForm extends Component {
  // componentWillReceiveProps (nextProps) {
  //   // console.log(_.isEqual(this.props.values, nextProps.values), nextProps)
  //   if (!_.isEqual(this.props.values, nextProps.values)) {
  //   }
  // }

  getFinalAmount = () => {
    const { values, setFieldValue } = this.props
    const { isExactAmount, adjustment = 0, unitPrice = 0, unit = 0 } = values
    // console.log(calculateAdjustAmount(isExactAmount, unitPrice, -adjustment))
    setFieldValue(
      'finalAmount',
      calculateAdjustAmount(isExactAmount, unitPrice * unit, -adjustment)
        .amount,
    )
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
    // console.log(data.filter((o) => o.value === action.value))
    // const groups = _.groupBy(
    //   data.filter((o) => o.value === action.value),
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
    }

    const changeTreatment = (option) => {
      const { sellingPrice } = option

      setFieldValue('unitPrice', sellingPrice)
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
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12} md={4}>
              <FastField
                name='code'
                render={(args) => (
                  <CodeSelect
                    code='cttreatment'
                    labelField='displayValue'
                    label='Treatment'
                    onChange={(v, op) => {
                      changeTreatment(op)
                    }}
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
                    onChange={() => {
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
                this.props.resetForm()
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
