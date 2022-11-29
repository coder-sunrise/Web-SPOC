import { Button, Field, MultipleTextField, Checkbox } from '@/components'
import { useRef } from 'react'
import Close from '@material-ui/icons/Close'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { useHover } from 'ahooks'

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
    extraDom: {
      '&::after': {
        content: "' + '",
        position: 'relative',
        top: '-10px',
      },
    },
  }),
  { withTheme: true },
)

const CoverTest = props => {
  let {
    index,
    propName,
    arrayHelpers: {
      form: { values, setFieldValue },
    },
    targetVal,
    theme: { spacing },
    classes,
    dispatch,
  } = props

  let getPrefix = () => {
    let prefix = propName
    if (index >= 0) {
      prefix += `[${index}]`
    }
    prefix += '.'
    return prefix
  }

  let deleteCoverTest = () => {
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

  let prefix = getPrefix()
  let ref = useRef(null)
  let isShowCloseBtn =
    useHover(ref) &&
    _.get(values, propName)?.filter(
      coverTestItem =>
        coverTestItem.isDeleted == false ||
        coverTestItem.isDeleted == undefined,
    ).length > 1
  return (
    <div>
      <table className={classes.itemTable}>
        <tr>
          <td rowspan='2' width='30%'>
            <div>
              <div
                style={{ position: 'absolute', top: spacing(2), left: '5px' }}
              >
                <p className={classes.extraDom}>CoverTest</p>
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
                          disabled={_.get(values, `${prefix}withoutRx`)}
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
                      return (
                        <Checkbox
                          label='without Rx'
                          {...args}
                          disabled={_.get(values, `${prefix}withRx`)}
                        />
                      )
                    }}
                  />
                </div>
              </div>
            </div>
          </td>
          <td width='5%'>D</td>
          <td>
            <div ref={ref}>
              {isShowCloseBtn && (
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
                    dispatch({
                      type: 'global/updateAppState',
                      payload: {
                        openConfirm: true,
                        openConfirmContent: `Confirm to delete?`,
                        onConfirmSave: deleteCoverTest,
                      },
                    })
                  }}
                  justIcon
                >
                  <Close />
                </Button>
              )}
              <Field
                name={`${prefix}coverTestD`}
                render={args => (
                  <MultipleTextField
                    maxLength={2000}
                    bordered={false}
                    autoSize={{ minRows: 3 }}
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
                    autoSize={{ minRows: 3 }}
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

export default compose(_styles)(CoverTest)
