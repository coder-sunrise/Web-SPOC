import { Button, Field, MultipleTextField, Checkbox } from '@/components'
import { PureComponent, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Close from '@material-ui/icons/Close'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'

const _styles = withStyles(
  theme => ({
    itemTable: {
      width: '100%',
      marginBottom: theme.spacing(1),
      '& > tr > td': {
        border: '1px solid #ccc',
        height: theme.spacing(8),
      },
      '& > tr > td > div': {
        height: '100%',
        position: 'relative',
      },
      '& td[width="5%"]': {
        textAlign: 'center',
      },
    },
  }),
  { withTheme: true },
)

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
      theme: { spacing },
      classes,
    } = this.props
    let prefix = this.getPrefix()
    return (
      <div>
        <table className={classes.itemTable}>
          <tr>
            <td rowspan='2' width='30%'>
              <div>
                <div
                  style={{ position: 'absolute', top: spacing(2), left: '5px' }}
                >
                  <p>CoverTest</p>
                  <p style={{ fontSize: '0.8rem' }}>
                    <em>(including its magnitude and direction)</em>
                  </p>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: spacing(10),
                    left: '5px',
                  }}
                >
                  <div style={{ display: 'inline-block' }}>
                    <Field
                      name={`${prefix}withRx`}
                      render={args => {
                        return (
                          <Checkbox
                            onChange={e => {}}
                            label='with Rx'
                            {...args}
                          />
                        )
                      }}
                    />
                  </div>
                  <div
                    style={{ display: 'inline-block', marginLeft: spacing(3) }}
                  >
                    <Field
                      name={`${prefix}withoutRx`}
                      render={args => {
                        return <Checkbox label='without Rx' {...args} />
                      }}
                    />
                  </div>
                </div>
              </div>
            </td>
            <td width='5%'>D</td>
            <td>
              <div>
                <Button
                  color='danger'
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '0',
                    zIndex: '99',
                  }}
                  size='sm'
                  onClick={() => {
                    this.deleteCoverTest()
                  }}
                  justIcon
                >
                  <Close />
                </Button>
                <Field
                  name={`${prefix}coverTestD`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      {...args}
                    />
                  )}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td width='5%'>N</td>
            <td>
              <div>
                <Field
                  name={`${prefix}coverTestN`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={true}
                      {...args}
                    />
                  )}
                />
              </div>
            </td>
          </tr>
        </table>
      </div>
    )
  }
}

export default compose(_styles)(CoverTest)
