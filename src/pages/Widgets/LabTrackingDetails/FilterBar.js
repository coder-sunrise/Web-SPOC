import React, { PureComponent, memo } from 'react'
import { formatMessage } from 'umi'
import Search from '@material-ui/icons/Search'
import { findGetParameter } from '@/utils/utils'
import moment from 'moment'

import {
  GridContainer,
  FastField,
  TextField,
  Field,
  CodeSelect,
  withFormikExtend,
  DateRangePicker,
  ProgressButton,
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
    orderedDate,
    isAllDateChecked,
    externalTrackingStatusIDs,
    jobReferenceNo,
    searchValue,
    orderTypes,
    salesTypeIDs,
    supplierIDs,
  } = values

  const orderStartDate =
    orderedDate && orderedDate.length > 0
      ? moment(orderedDate[0]).startOf('day')
      : undefined
  const orderEndDate =
    orderedDate && orderedDate.length > 1
      ? moment(orderedDate[1]).endOf('day')
      : undefined
  const payload = {
    apiCriteria: {
      patientProfileFK: IsOverallGrid ? undefined : patientID,
      orderStartDate: isAllDateChecked ? undefined : orderStartDate,
      orderEndDate: isAllDateChecked ? undefined : orderEndDate,
      searchValue: searchValue ? searchValue : undefined,
      jobReferenceNo: jobReferenceNo || undefined,
      supplierIDs:
        supplierIDs && supplierIDs.length > 0 && supplierIDs.indexOf(-99) < 0
          ? supplierIDs.join(',')
          : undefined,
      salesTypeIDs:
        salesTypeIDs && salesTypeIDs.length > 0 && salesTypeIDs.indexOf(-99) < 0
          ? salesTypeIDs.join(',')
          : undefined,
      orderTypes:
        orderTypes && orderTypes.length > 0 && orderTypes.indexOf(-99) < 0
          ? orderTypes.join(',')
          : undefined,
      externalTrackingStatusIDs:
        externalTrackingStatusIDs &&
        externalTrackingStatusIDs.length > 0 &&
        externalTrackingStatusIDs.indexOf(-99) < 0
          ? externalTrackingStatusIDs.join(',')
          : undefined,
    },
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
  }

  componentDidMount = () => {
    const { values } = this.props
    searchResult(values, this.props)
  }

  render() {
    const { handleSubmit, IsOverallGrid, values } = this.props
    return (
      <div>
        <GridContainer alignItems='flex-end'>
          {IsOverallGrid && (
            <FastField
              name='searchValue'
              render={args => (
                <TextField
                  {...args}
                  label='Patient Name/Ref. No.'
                  autoFocus
                  style={{ width: 180, marginLeft: 10 }}
                />
              )}
            />
          )}
          <FastField
            name='jobReferenceNo'
            render={args => (
              <TextField
                {...args}
                label='Job Ref. No.'
                style={{ width: 140, marginLeft: 10 }}
              />
            )}
          />
          <FastField
            name='orderTypes'
            render={args => {
              return (
                <CodeSelect
                  label='Order Type'
                  mode='multiple'
                  options={[
                    { id: 'ContactLens', name: 'Contact Lens' },
                    { id: 'Spectacle', name: 'Spectacle' },
                  ]}
                  maxTagCount={0}
                  allowClear={true}
                  style={{
                    width: 140,
                    marginLeft: 10,
                  }}
                  {...args}
                />
              )
            }}
          />
          <FastField
            name='salesTypeIDs'
            render={args => (
              <CodeSelect
                label='Sales Type'
                mode='multiple'
                code='ctSalesType'
                maxTagCount={0}
                allowClear={true}
                style={{
                  width: 140,
                  marginLeft: 10,
                }}
                {...args}
              />
            )}
          />
          <FastField
            name='supplierIDs'
            render={args => (
              <CodeSelect
                label='Supplier'
                mode='multiple'
                code='ctSupplier'
                labelField='displayValue'
                maxTagCount={0}
                allowClear={true}
                style={{
                  width: 180,
                  marginLeft: 10,
                }}
                {...args}
              />
            )}
          />
          <div
            style={{
              marginLeft: 10,
            }}
          >
            <Field
              name='orderedDate'
              render={args => (
                <DateRangePicker
                  label='Date Ordered'
                  label2='To'
                  {...args}
                  disabled={values.isAllDateChecked}
                  style={{
                    width: 220,
                  }}
                />
              )}
            />
          </div>
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
                    style={{
                      width: 80,
                      marginLeft: 10,
                      position: 'relative',
                      bottom: '-6px',
                    }}
                    {...args}
                  />
                </Tooltip>
              )
            }}
          />
          <FastField
            name='externalTrackingStatusIDs'
            render={args => (
              <CodeSelect
                label='Status'
                mode='multiple'
                {...args}
                code='ltlabtrackingstatus'
                style={{ width: 140, marginLeft: 10 }}
              />
            )}
          />
          <ProgressButton
            icon={<Search />}
            color='primary'
            size='sm'
            onClick={handleSubmit}
            style={{
              marginLeft: 20,
              position: 'relative',
              bottom: 6,
            }}
          >
            Search
          </ProgressButton>
          <ProgressButton
            icon={null}
            size='sm'
            //onClick={handleSubmit}
            style={{
              position: 'relative',
              bottom: 6,
              backgroundColor: '#14BACE',
            }}
          >
            Export
          </ProgressButton>
          <ProgressButton
            icon={null}
            color='primary'
            size='sm'
            //onClick={handleSubmit}
            style={{
              position: 'relative',
              bottom: 6,
            }}
          >
            Write-Off
          </ProgressButton>
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
    mapPropsToValues: () => ({
      orderedDate: [moment().toDate(), moment().toDate()],
      orderTypes: [-99],
      salesTypeIDs: [-99],
      supplierIDs: [-99],
      externalTrackingStatusIDs: [1, 2, 3, 4, 5],
    }),
  })(FilterBar),
)
