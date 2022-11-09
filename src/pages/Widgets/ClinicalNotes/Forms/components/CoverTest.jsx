import {
  GridContainer,
  GridItem,
  TextField,
  NumberInput,
  RadioGroup,
  Button,
  FieldArray,
  Field,
  withFormikExtend,
  MultipleTextField,
  Checkbox,
} from '@/components'
import { FastField } from 'formik'
import { PureComponent, useState } from 'react'
import { Delete, Add } from '@material-ui/icons'
import { getUniqueId } from '@/utils/utils'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import { useTheme } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Close from '@material-ui/icons/Close'
import { getIn, setIn } from 'formik'
import { render } from 'react-dom'
import { getUniqueNumericId } from '@/utils/utils'

class CoverTest extends PureComponent {
  getPrefix() {
    const { index, propName, arrayHelpers } = this.props
    let prefix = propName
    if (index >= 0) {
      prefix += `[${index}]`
    }
    prefix += '.'
    return prefix
  }
  removeCoverTest() {
    let { arrayHelpers, index, targetVal } = this.props
    let {
      form: { setFieldValue, values },
    } = arrayHelpers
    const coverTest = _.cloneDeep(
      values.corDoctorNote.corPaediatricEntity.coverTest,
    )
    coverTest.find(item => item.id == targetVal.id).isDeleted = true
    let newCoverTest = coverTest.filter(item => item.isDeleted !== true)
    setFieldValue('corDoctorNote.corPaediatricEntity.coverTest', newCoverTest)
  }
  render() {
    const {
      classes,
      index,
      arrayHelpers,
      theme: { spacing },
    } = this.props
    let prefix = this.getPrefix()
    return (
      <div style={{ position: 'relative' }}>
        <Grid
          container
          style={{
            height: spacing(18),
            border: '1px solid rgb(217,217,217)',
            marginTop: spacing(1),
          }}
        >
          <Grid
            md={4}
            style={{
              borderRight: '1px solid rgb(217,217,217)',
              padding: spacing(1),
            }}
          >
            <div>
              <p>CoverTest</p>
              <p style={{ fontSize: '0.8rem' }}>
                <em>(including its magnitude and direction)</em>
              </p>
            </div>
            <div style={{ marginTop: spacing(2) }}>
              <div style={{ display: 'inline-block' }}>
                <Field
                  name={`${prefix}withRx`}
                  render={args => {
                    return (
                      <Checkbox onChange={e => {}} label='with Rx' {...args} />
                    )
                  }}
                />
              </div>
              <div style={{ display: 'inline-block' }}>
                <Field
                  name={`${prefix}withoutRx`}
                  render={args => {
                    return (
                      <Checkbox
                        onChange={e => {}}
                        label='without Rx'
                        {...args}
                      />
                    )
                  }}
                />
              </div>
            </div>
          </Grid>
          <Grid md={8}>
            <div
              style={{
                height: '50%',
                borderBottom: '1px solid rgb(217,217,217)',
              }}
            >
              <div>
                <Field
                  name={`${prefix}coverTestD`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      placeholder='D'
                      onChange={e => {}}
                      {...args}
                    />
                  )}
                />
              </div>
            </div>
            <div style={{ height: '50%' }}>
              <div>
                <Field
                  name={`${prefix}coverTestN`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      placeholder='N'
                      onChange={e => {}}
                      {...args}
                    />
                  )}
                />
              </div>
            </div>
          </Grid>
        </Grid>
        <div style={{ position: 'absolute', top: spacing(1), right: '0' }}>
          <Button
            color='danger'
            size='sm'
            onClick={(a, b) => {
              console.log(this.props)
              this.removeCoverTest()
            }}
            justIcon
          >
            <Close />
          </Button>
        </div>
      </div>
    )
  }
}

export default CoverTest
