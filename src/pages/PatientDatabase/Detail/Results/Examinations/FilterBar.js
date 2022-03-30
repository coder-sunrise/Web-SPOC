import React, { useEffect, useState, memo } from 'react'
// formik
import { FastField, Field } from 'formik'
import {
  Button,
  GridContainer,
  GridItem,
  CheckBox,
  TextField,
  SizeContainer,
  CodeSelect,
  DateRangePicker,
  withFormikExtend,
  Select,
} from '@/components'
import { ReportDateRangePicker } from '@/pages/Report/ReportDateRangePicker'
import Checkbox from '@/components/Checkbox'
import { DoctorProfileSelect } from '@/components/_medisys'
import { useDispatch } from 'react-redux'

const searchResult = (values, props) => {
  const { dispatch, setState } = props
  const {
    orderDate,
    allDate,
    category,
    examinationName,
    doctorIDs,
    status,
  } = values

  const orderStartDate =
    orderDate && orderDate.length > 0
      ? moment(orderDate[0])
          .set({ hour: 0, minute: 0, second: 0 })
          .formatUTC(false)
      : undefined
  const orderEndDate =
    orderDate && orderDate.length > 1
      ? moment(orderDate[1])
          .set({ hour: 23, minute: 59, second: 59 })
          .formatUTC(false)
      : undefined
  const payload = {
    orderStartDate: allDate ? undefined : orderStartDate || undefined,
    orderEndDate: allDate ? undefined : orderEndDate || undefined,
    examinationName: examinationName || undefined,
    category: category,
    doctorIDs: doctorIDs,
    status: status,
  }
  console.log(payload)
  return
  dispatch({
    type: 'labTrackingDetails/query',
    payload,
  })
}
const FilterBar = props => {
  const [category, setCategory] = useState('Lab')
  const dispatch = useDispatch()
  const { handleSubmit, isSubmitting } = props
  const { setFieldValue } = props
  useEffect(() => {
    setFieldValue('category', 'Lab')
  }, [])
  const radiologyStatus = [
    {
      id: 4,
      code: 'Completed',
      name: 'Completed',
    },
    {
      id: 3,
      code: 'Modality Completed',
      name: 'Modality Completed',
    },
    {
      id: 2,
      code: 'In Progress',
      name: 'In Progress',
    },
    {
      id: 1,
      code: 'New',
      name: 'New',
    },
    {
      id: 5,
      code: 'Cancelled',
      name: 'Cancelled',
    },
  ]
  const labStatus = [
    {
      id: 8,
      code: 'Completed',
      name: 'Completed',
    },
    {
      id: 4,
      code: 'In Progress',
      name: 'In Progress',
    },
    {
      id: 1,
      code: 'New',
      name: 'New',
    },
  ]
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer alignItems='flex-end'>
          <GridItem md={12}>
            <Field
              name='category'
              render={args => {
                const { form: fm } = args
                return (
                  <Select
                    {...args}
                    style={{ width: 140, marginRight: 10 }}
                    label='Category'
                    options={[
                      { id: 1, name: 'Lab', value: 'Lab' },
                      { id: 2, name: 'Radiology', value: 'Radiology' },
                    ]}
                    onChange={v => {
                      setFieldValue('status', '')
                      setCategory(v)
                    }}
                    allowClear={false}
                  />
                )
              }}
            />
            <FastField
              name='examinationName'
              render={args => (
                <TextField
                  maxLength={50}
                  style={{
                    width: 200,
                    position: 'relative',
                    top: -5,
                    marginRight: 10,
                  }}
                  label='Examination Name'
                  {...args}
                />
              )}
            />
            <Field
              name='visitDate'
              render={args => {
                return (
                  <DateRangePicker
                    style={{
                      width: 350,
                      position: 'relative',
                      top: -5,
                      marginRight: 10,
                    }}
                    label='Order Date From'
                    label2='Order Date To'
                    {...args}
                  />
                )
              }}
            />
            <Field
              name='allDate'
              render={args => {
                return (
                  <Checkbox
                    style={{
                      width: 70,
                      position: 'relative',
                      top: -5,
                      marginRight: 10,
                    }}
                    inputLabel=' '
                    label='All Date'
                    {...args}
                  />
                )
              }}
            />
            <FastField
              name='doctorIDs'
              render={args => (
                <DoctorProfileSelect
                  mode='multiple'
                  {...args}
                  style={{ width: 200, marginRight: 10 }}
                  allValue={-99}
                  allValueOption={{
                    id: -99,
                    clinicianProfile: {
                      name: 'All',
                    },
                  }}
                  labelField='clinicianProfile.name'
                />
              )}
            />
            {category === 'Lab' && (
              <Field
                name='status'
                render={args => {
                  const { form } = args
                  return (
                    <CodeSelect
                      {...args}
                      style={{ width: 180, marginRight: 10 }}
                      label='Status'
                      options={labStatus}
                      mode='multiple'
                      labelField='name'
                      temp
                    />
                  )
                }}
              />
            )}
            {category === 'Radiology' && (
              <Field
                name='status'
                render={args => {
                  const { form } = args
                  return (
                    <CodeSelect
                      {...args}
                      style={{ width: 180, marginRight: 10 }}
                      label='Status'
                      options={radiologyStatus}
                      mode='multiple'
                      labelField='name'
                      temp
                    />
                  )
                }}
              />
            )}
            <Button
              color='primary'
              style={{ position: 'relative', top: -8 }}
              onClick={handleSubmit}
              // disabled={isSubmitting}
            >
              Search
            </Button>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    </SizeContainer>
  )
}
export default memo(
  withFormikExtend({
    handleSubmit: (values, { props, resetForm }) => {
      const { search } = props
      search(values)
      // searchResult(values, props)
    },
  })(FilterBar),
)
