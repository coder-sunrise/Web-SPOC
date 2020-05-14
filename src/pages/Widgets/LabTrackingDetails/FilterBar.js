import React, { PureComponent, memo } from 'react'
import { formatMessage } from 'umi/locale'
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
  Tooltip,
  Checkbox,
} from '@/components'

const styles = (theme) => ({
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

  const payload = IsOverallGrid
    ? {
        visitFKNavigation: undefined,
        lgteql_visitDate: isAllDateChecked
          ? undefined
          : visitStartDate || undefined,
        lsteql_visitDate: isAllDateChecked
          ? undefined
          : visitEndDate || undefined,
        labTrackingStatusFK: labTrackingStatusFK || undefined,
        apiCriteria: searchValue ? { searchValue } : undefined,
        serviceName: serviceName || undefined,
      }
    : {
        visitFKNavigation: patientID
          ? {
              patientProfileFK: patientID,
            }
          : undefined,
        lgteql_visitDate: isAllDateChecked
          ? undefined
          : visitStartDate || undefined,
        lsteql_visitDate: isAllDateChecked
          ? undefined
          : visitEndDate || undefined,
        labTrackingStatusFK: labTrackingStatusFK || undefined,
        serviceName: serviceName || undefined,
        apiCriteria: searchValue ? { searchValue } : undefined,
      }
  console.log('searchResult', payload)
  dispatch({
    type: 'labTrackingDetails/query',
    payload,
  })
}

class FilterBar extends PureComponent {
  constructor (props) {
    super(props)
    const { setFieldValue } = props

    setTimeout(() => {
      setFieldValue('visitDate', [
        moment().add(-1, 'd').toDate(),
        moment().add(-1, 'd').toDate(),
      ])
    }, 1)
  }

  componentDidMount = () => {
    setTimeout(() => {
      const { values } = this.props
      searchResult(values, this.props)
    }, 100)
  }

  render () {
    const { handleSubmit, IsOverallGrid } = this.props
    return (
      <div>
        <GridContainer>
          <GridItem md={3}>
            {IsOverallGrid ? (
              <FastField
                name='searchValue'
                render={(args) => (
                  <TextField
                    {...args}
                    label={formatMessage({
                      id: 'patient.patientresult.searchValue',
                    })}
                    autoFocus
                  />
                )}
              />
            ) : (
              <FastField
                name='serviceName'
                render={(args) => (
                  <TextField
                    {...args}
                    label={formatMessage({
                      id: 'patient.patientresult.serviceName',
                    })}
                    autoFocus
                  />
                )}
              />
            )}
          </GridItem>
          <GridItem md={1} />
          <GridItem md={3}>
            <FastField
              name='visitDate'
              render={(args) => (
                <DateRangePicker label='Visit Date' label2='To' {...args} />
              )}
            />
          </GridItem>
          <GridItem xs sm={4} md={1}>
            <FastField
              name='isAllDateChecked'
              render={(args) => {
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
          <GridItem md={1} />
          <GridItem md={3}>
            <FastField
              name='labTrackingStatusFK'
              render={(args) => (
                <CodeSelect
                  label='Status'
                  {...args}
                  code='ltlabtrackingstatus'
                />
              )}
            />
          </GridItem>
          <GridItem xs sm={8} md={4}>
            <ProgressButton
              icon={null}
              color='primary'
              size='sm'
              onClick={handleSubmit}
            >
              <Search />
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
