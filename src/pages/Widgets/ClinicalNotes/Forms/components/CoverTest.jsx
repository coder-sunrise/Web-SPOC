import {
  Button,
  Field,
  MultipleTextField,
  Checkbox,
} from '@/components'
import { PureComponent, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Close from '@material-ui/icons/Close'

class CoverTest extends PureComponent {
  getPrefix() {
    let { index, propName } = this.props
    let prefix = propName
    if (index >= 0) {
      prefix += `[${index}]`
    }
    prefix += '.'
    return prefix
  }

  deleteCoverTest = () => {
    let {
      arrayHelpers: {
        form: { values, setFieldValue },
      },
      targetVal,
      propName,
    } = this.props
    let oldCoverTestList = _.get(values, propName) || []
    let newCoverTestList = _.cloneDeep(oldCoverTestList)
    newCoverTestList.map(item => {
      if (item.isDeleted != true) {
        item.id
          ? (item.isDeleted = item.id == targetVal.id)
          : (item.isDeleted = item.uid == targetVal.uid)
      }
    })
    setFieldValue(propName, newCoverTestList)
  }

  render() {
    const {
      border,
      theme: { spacing },
    } = this.props
    let prefix = this.getPrefix()
    return (
      <div style={{ position: 'relative' }}>
        <Grid
          container
          style={{
            height: spacing(18),
            border: border,
            marginTop: spacing(1),
          }}
        >
          <Grid
            md={4}
            style={{
              borderRight: border,
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
                    return <Checkbox label='without Rx' {...args} />
                  }}
                />
              </div>
            </div>
          </Grid>
          <Grid md={8}>
            <div
              style={{
                height: '50%',
                borderBottom: border,
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
            onClick={() => {
              this.deleteCoverTest()
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
