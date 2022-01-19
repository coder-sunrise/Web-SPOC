import React, { PureComponent, memo } from 'react'
import { formatMessage } from 'umi'
import Search from '@material-ui/icons/Search'
import { findGetParameter } from '@/utils/utils'
import moment from 'moment'

import {
  Button,
  CommonModal,
  GridContainer,
  GridItem,
  FastField,
  TextField,
  Field,
  CodeSelect,
  withFormikExtend,
  DateRangePicker,
  ClinicianSelect,
  DatePicker,
  Select,
  reversedDateFormat,
  ProgressButton,
  VisitTypeSelect,
  Tooltip,
  Checkbox,
} from '@/components'

const styles = theme => ({
  filterBar: {
    marginBottom: '20px',
  },
  filterBtn: {
    lineHeight: standardRowHeight,
    textAlign: 'left',
    '& > button': {
      marginRight: theme.spacing.unit,
    },
  },
})

const searchResult = (values, props) => {
  const { dispatch, IsOverallGrid, patientId, setState } = props
  let patientID = patientId || Number(findGetParameter('pid'))
  const {
    visitDate,
    isAllDateChecked,
    labTrackingStatusFK,
    serviceName,
    searchValue,
    visitTypeIDs,
  } = values

  const visitStartDate =
    visitDate && visitDate.length > 0
      ? moment(visitDate[0])
          .set({ hour: 0, minute: 0, second: 0 })
          .formatUTC(false)
      : undefined
  const visitEndDate =
    visitDate && visitDate.length > 1
      ? moment(visitDate[1])
          .set({ hour: 23, minute: 59, second: 59 })
          .formatUTC(false)
      : undefined
  const payload = {
    visitFKNavigation: IsOverallGrid
      ? undefined
      : patientID
      ? {
          patientProfileFK: patientID,
        }
      : undefined,
    lgteql_visitDate: isAllDateChecked
      ? undefined
      : visitStartDate || undefined,
    lsteql_visitDate: isAllDateChecked ? undefined : visitEndDate || undefined,
    labTrackingStatusFK: labTrackingStatusFK || undefined,
    apiCriteria: {
      searchValue: searchValue ? searchValue : undefined,
      visitTypeIDs:
        visitTypeIDs && visitTypeIDs.length > 0
          ? visitTypeIDs.join(',')
          : undefined,
    },
    serviceName: serviceName || undefined,
  }
  dispatch({
    type: 'labTrackingDetails/query',
    payload,
  })
}

class FilterBar extends PureComponent {
  constructor(props) {
    super(props)
    const { setFieldValue } = props

    setTimeout(() => {
      setFieldValue('visitDate', [
        moment()
          .add(-1, 'd')
          .toDate(),
        moment()
          .add(-1, 'd')
          .toDate(),
      ])
    }, 1)
  }

  componentDidMount = () => {
    setTimeout(() => {
      const { values } = this.props
      searchResult(values, this.props)
    }, 100)
  }

  render() {
    const { handleSubmit, IsOverallGrid, values } = this.props
    return (
      <div>
        <GridContainer>
          {IsOverallGrid && (
            <GridItem md={3} sm={6}>
              <FastField
                name='searchValue'
                render={args => (
                  <TextField
                    {...args}
                    label='Patient Name, Acc. no, Patient Referrence No'
                    autoFocus
                  />
                )}
              />
            </GridItem>
          )}
          <GridItem md={2} sm={3}>
            <FastField
              name='serviceName'
              render={args => <TextField {...args} label='Service Name' />}
            />
          </GridItem>
          <GridItem md={2} sm={3}>
            <FastField
              name='visitTypeIDs'
              render={args => (
                <Tooltip
                  placement='right'
                  title='Select "All" will retrieve active and inactive visit type'
                >
                  <VisitTypeSelect
                    label='Visit Type'
                    {...args}
                    mode='multiple'
                    maxTagPlaceholder='Visit Types'
                    allowClear={true}
                  />
                </Tooltip>
              )}
            />
          </GridItem>
          <GridItem md={3} sm={4}>
            <Field
              name='visitDate'
              render={args => (
                <DateRangePicker
                  label='Visit Date'
                  label2='To'
                  {...args}
                  disabled={values.isAllDateChecked}
                />
              )}
            />
          </GridItem>
          <GridItem xs sm={2} md={1}>
            <FastField
              name='isAllDateChecked'
              render={args => {
                return (
                  <Tooltip
                    title={formatMessage({
                      id: 'form.date.placeholder.allDate',
                    })}
                    placement='bottom'
                  >
                    <Checkbox
                      label={formatMessage({
                        id: 'form.date.placeholder.allDate',
                      })}
                      inputLabel=' '
                      {...args}
                    />
                  </Tooltip>
                )
              }}
            />
          </GridItem>
          <GridItem md={2} sm={3}>
            <FastField
              name='labTrackingStatusFK'
              render={args => (
                <CodeSelect
                  label='Status'
                  {...args}
                  code='ltlabtrackingstatus'
                />
              )}
            />
          </GridItem>
          <GridItem xs sm={3} md={1}>
            <ProgressButton
              icon={<Search />}
              color='primary'
              style={{ position: 'relative', marginTop: '20px' }}
              size='sm'
              onClick={handleSubmit}
            >
              Search
            </ProgressButton>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default memo(
  withFormikExtend({
    handleSubmit: (values, { props, resetForm }) => {
      searchResult(values, props)
    },
  })(FilterBar),
)
