import React, { PureComponent } from 'react'
import _, { values } from 'lodash'
import { FormattedMessage } from 'umi'
import moment from 'moment'
import Yup from '@/utils/yup'
import { navigateDirtyCheck } from '@/utils/utils'
import { Link } from '@material-ui/core'
import Warning from '@material-ui/icons/Error'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
  NumberInput,
  FastEditableTableGrid,
  SyncfusionTimePicker,
  Tooltip,
  CommonModal,
  notification,
} from '@/components'
import { ShoppingCartTwoTone } from '@material-ui/icons'
import DailyResourceManagement from './DailyResourceManagement'

const styles = theme => ({})

const resourceCapacitySchema = Yup.object().shape({
  isAllInput: Yup.string().required('Must input start time and end time.'),
  maxCapacity: Yup.number().required(),
})

@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: ({ settingResource }) => ({
    ...(settingResource.entity || settingResource.default),
  }),
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    effectiveDates: Yup.array()
      .of(Yup.date())
      .min(2)
      .required(),
    calendarResource: Yup.object().shape({
      ctcalendarResourceCapacity: Yup.array()
        .compact(v => v.isDeleted)
        .of(resourceCapacitySchema),
    }),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props
    dispatch({
      type: 'settingResource/upsert',
      payload: {
        ...restValues,
        calendarResource: {
          ...restValues.calendarResource,
          ctCalendarResourceCapacity: restValues.calendarResource.ctCalendarResourceCapacity.map(
            csc => {
              return {
                ...csc,
                startTime: moment(csc.startTime, 'hh:mm A').format('HH:mm'),
                endTime: moment(csc.endTime, 'hh:mm A').format('HH:mm'),
              }
            },
          ),
        },
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
      },
    }).then(r => {
      if (r) {
        resetForm()
        let queryId = values.id
        if (!values.id) {
          queryId = r.id
        }
        dispatch({
          type: 'settingResource/queryOne',
          payload: {
            id: queryId,
          },
        })
      }
    })
  },
  displayName: 'ResourceDetail',
})
class Detail extends PureComponent {
  state = { showDailyManagementModal: false }

  commitChanges = ({ rows, changed }) => {
    const { setFieldValue } = this.props
    setFieldValue('_fakeField', 'fakeValue')
    rows = _.orderBy(rows, ['startTime'], ['asc'])
    setFieldValue('calendarResource.ctCalendarResourceCapacity', rows)
    return rows
  }

  isEnableDailyManagement = () => {
    const { values } = this.props
    const newCapacity = values.calendarResource.ctCalendarResourceCapacity
    const oldCapacity =
      values.calendarResource.oldCtCalendarResourceCapacity || []
    if (!values.id) return false
    if (!newCapacity.length) return false

    const generateItem = item => {
      if (!item) return {}
      return {
        startTime: item.startTime,
        endTime: item.endTime,
        maxCapacity: item.maxCapacity,
        isDeleted: item.isDeleted,
      }
    }
    for (let index = 0; index < newCapacity.length; index++) {
      const currentRow = oldCapacity.find(r => r.id === newCapacity[index].id)
      if (
        !_.isEqual(generateItem(newCapacity[index]), generateItem(currentRow))
      ) {
        return false
      }
    }
    return true
  }

  toggleModal = () => {
    this.props.dispatch({
      type: 'calendarResource/updateState',
      payload: {
        entity: undefined,
        editId: undefined,
        selectMonth: undefined,
      },
    })
    this.setState({ showDailyManagementModal: false })
  }

  onConfirm = () => {
    const { values, handleSubmit } = this.props
    const resourceCapacity =
      values.calendarResource?.ctCalendarResourceCapacity || []
    let containsWrongCapacity = false
    for (let index = 0; index < resourceCapacity.length; index++) {
      if (
        index > 0 &&
        resourceCapacity[index].startTime < resourceCapacity[index - 1].endTime
      ) {
        containsWrongCapacity = true
        break
      }
    }
    if (containsWrongCapacity) {
      notification.error({
        message: 'Time from can not be more than previous time to',
      })
    } else {
      handleSubmit()
    }
  }
  render() {
    const {
      theme,
      footer,
      values,
      dispatch,
      apptTimeIntervel = 30,
    } = this.props
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='code'
                render={args => (
                  <TextField
                    label='Code'
                    autoFocus
                    {...args}
                    disabled={!!values.id}
                  />
                )}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='displayValue'
                render={args => <TextField label='Display Value' {...args} />}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='effectiveDates'
                render={args => {
                  return (
                    <DateRangePicker
                      label='Effective Start Date'
                      label2='End Date'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='sortOrder'
                render={args => {
                  return (
                    <NumberInput
                      label='Sort Order'
                      precision={0}
                      rowsMax={4}
                      max={9999}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={12}>
              <FastField
                name='description'
                render={args => {
                  return (
                    <TextField
                      label='Description'
                      multiline
                      rowsMax={4}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          <h4 style={{ fontWeight: 400, margin: '8px 6px -4px 6px' }}>
            <b>Resource Management</b>
          </h4>
          <div style={{ position: 'relative' }}>
            <FastEditableTableGrid
              forceRender
              style={{
                marginTop: theme.spacing(1),
                margin: theme.spacing(2),
              }}
              rows={values.calendarResource?.ctCalendarResourceCapacity || []}
              EditingProps={{
                showAddCommand: true,
                onCommitChanges: this.commitChanges,
              }}
              schema={resourceCapacitySchema}
              columns={[
                { name: 'isAllInput', title: 'Time From & Time To' },
                { name: 'maxCapacity', title: 'Default Maximum Capacity' },
              ]}
              columnExtensions={[
                {
                  columnName: 'isAllInput',
                  isReactComponent: true,
                  render: e => {
                    const { row, columnConfig, cellProps } = e
                    const { control, error, validSchema } = columnConfig
                    return (
                      <div style={{ position: 'relative', paddingRight: 10 }}>
                        <GridContainer>
                          <GridItem xs md={6} style={{ paddingRight: 20 }}>
                            <SyncfusionTimePicker
                              step={apptTimeIntervel}
                              value={row.startTime}
                              onTimeChange={e => {
                                const { commitChanges } = control
                                row.startTime = e.value
                                row.isAllInput =
                                  (row.startTime && row.endTime) || undefined
                                if (
                                  row.isAllInput &&
                                  row.startTime > row.endTime
                                ) {
                                  row.endTime = row.startTime
                                }
                                commitChanges({
                                  changed: {
                                    [row.id]: {
                                      startTime: row.startTime,
                                      endTime: row.endTime,
                                      isAllInput: row.isAllInput,
                                    },
                                  },
                                })
                              }}
                            />
                          </GridItem>
                          <GridItem xs md={6} style={{ paddingLeft: 20 }}>
                            <div style={{ position: 'relative' }}>
                              <div
                                style={{
                                  position: 'absolute',
                                  left: '-25px',
                                  bottom: 4,
                                }}
                              >
                                To
                              </div>
                              <SyncfusionTimePicker
                                step={apptTimeIntervel}
                                value={row.endTime}
                                min={row.startTime}
                                onTimeChange={e => {
                                  const { commitChanges } = control
                                  row.endTime = e.value
                                  row.isAllInput =
                                    (row.startTime && row.endTime) || undefined
                                  commitChanges({
                                    changed: {
                                      [row.id]: {
                                        endTime: row.endTime,
                                        isAllInput: row.isAllInput,
                                      },
                                    },
                                  })
                                  document.activeElement.blur()
                                }}
                              />
                            </div>
                          </GridItem>
                          <div
                            style={{
                              position: 'absolute',
                              right: '-4px',
                              top: 8,
                            }}
                          >
                            {error && (
                              <Tooltip title={error}>
                                <Warning style={{ color: 'red' }} />
                              </Tooltip>
                            )}
                          </div>
                        </GridContainer>
                      </div>
                    )
                  },
                  sortingEnabled: false,
                },
                {
                  columnName: 'maxCapacity',
                  type: 'number',
                  max: 9999,
                  precision: 0,
                  sortingEnabled: false,
                  width: 200,
                },
              ]}
              FuncProps={{
                pager: false,
              }}
            />
            <div style={{ position: 'absolute', bottom: 10, right: 14 }}>
              {this.isEnableDailyManagement() && (
                <Link
                  component='button'
                  style={{ textDecoration: 'underline' }}
                  onClick={e => {
                    navigateDirtyCheck({
                      onProceed: async () => {
                        await dispatch({
                          type: 'calendarResource/updateState',
                          payload: {
                            editId: values.calendarResource.id,
                            selectMonth: moment(),
                          },
                        })
                        this.setState({ showDailyManagementModal: true })
                      },
                    })(e)
                  }}
                >
                  Daily Resource Management
                </Link>
              )}
            </div>
          </div>
        </div>
        {footer &&
          footer({
            onConfirm: this.onConfirm,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
        <CommonModal
          open={this.state.showDailyManagementModal}
          observe='DailyResourceManagement'
          title={'Daily Resource Management'}
          maxWidth='md'
          bodyNoPadding
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
        >
          <DailyResourceManagement {...this.props} />
        </CommonModal>
      </React.Fragment>
    )
  }
}

export default Detail
