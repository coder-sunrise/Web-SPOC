import React, { Component } from 'react'
import router from 'umi/router'
import { withStyles, Divider } from '@material-ui/core'
import _ from 'lodash'

// common component
import {
  GridContainer,
  GridItem,
  notification,
  withFormikExtend,
  FastField,
  OutlinedTextField,
  TextField,
  NumberInput,
  Button,
  ProgressButton,
  Switch,
  CodeSelect,
} from '@/components'
// utils
import { getAppendUrl } from '@/utils/utils'
import Authorized from '@/utils/Authorized'

// @Authorized.Secured('queue.dispense.editorder')
@withFormikExtend({
  // authority: [
  //   'queue.dispense.editorder',
  // ],
  // notDirtyDuration: 0, // this page should alwasy show warning message when leave
  mapPropsToValues: () => ({ subTotal: 0 }),
  // dirtyCheckMessage: 'Discard edit order?',
  // onDirtyDiscard: discardConsultation,
  // enableReinitialize: false,
  displayName: 'TreatmentForm',
})
class TreatmentForm extends Component {
  componentDidMount () {
    const { setFieldValue } = this.props
    setTimeout(() => {
      setFieldValue('fakeField', 'setdirty')
    }, 500)
  }

  render () {
    const {
      classes,
      dispense,
      consultation,
      dispatch,
      theme,
      dentalChartComponent,
    } = this.props
    const {
      data = [],
      pedoChart,
      surfaceLabel,
      action = {},
    } = dentalChartComponent
    // console.log(data.filter((o) => o.value === action.value))
    const groups = _.groupBy(
      data.filter((o) => o.value === action.value),
      'toothIndex',
    )
    // console.log(groups)
    return (
      <div className={classes.content}>
        <GridContainer>
          <GridItem xs={12} md={8}>
            <p style={{ marginBottom: 0 }}>
              Tooth No.{' '}
              {Object.keys(groups).map((k) => {
                return `#${k}(${groups[k].map((o) => o.name).join(',')}) `
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
              render={(args) => <CodeSelect label='Treatment' {...args} />}
            />
            <FastField
              name='unit'
              render={(args) => <NumberInput label='Unit' disabled {...args} />}
            />
            <FastField
              name='unitPrice'
              render={(args) => <NumberInput label='Unit Price' {...args} />}
            />
            <FastField
              name='discount'
              render={(args) => (
                <NumberInput
                  label='Discount'
                  suffix={
                    <Switch
                      checkedChildren='$'
                      unCheckedChildren='%'
                      simple
                      style={{ top: -2, position: 'relative' }}
                      onChange={() => {
                        // setTimeout(() => {
                        //   this.onConditionChange()
                        // }, 1)
                      }}
                      {...args}
                    />
                  }
                  {...args}
                />
              )}
            />
            <FastField
              name='subTotal'
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
        <p style={{ padding: theme.spacing(1), textAlign: 'right' }}>
          <Button color='danger' onClick={() => {}}>
            Discard
          </Button>
          <ProgressButton color='primary' onClick={() => {}}>
            Add
          </ProgressButton>
        </p>
      </div>
    )
  }
}

export default TreatmentForm
