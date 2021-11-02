import React, { useState, useEffect } from 'react'
// formik
import { FastField, Field } from 'formik'
import { connect } from 'dva'
import {
  Button,
  Checkbox,
  DatePicker,
  GridContainer,
  GridItem,
  CodeSelect,
  SizeContainer,
  Select,
} from '@/components'
import { DoctorProfileSelect } from '@/components/_medisys'
import ReportDateRangePicker from '../ReportDateRangePicker'

const FilterBar = ({
  handleSubmit,
  isSubmitting,
  ctservice = [],
  cttag = [],
}) => {
  const serviceOptions = Object.values(_.groupBy(ctservice, 'serviceId')).map(
    x => {
      return { id: x[0].serviceId, name: x[0].displayValue }
    },
  )
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer alignItems='flex-end'>
          <ReportDateRangePicker
            fromDateLabel='Order Date From'
            toDateLabel='Order Date To'
            fromDateWidth='1'
            toDateWidth='1'
          />
          <GridItem md={2}>
            <FastField
              name='doctorIDs'
              render={args => (
                <DoctorProfileSelect
                  mode='multiple'
                  {...args}
                  label='Radiology Technologist'
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
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='modalityIDs'
              render={args => (
                <CodeSelect
                  mode='multiple'
                  label='Modality'
                  code='ctmodality'
                  maxTagPlaceholder='Modalities'
                  remoteFilter={{
                    isActive: true,
                  }}
                  {...args}
                />
              )}
            ></FastField>
          </GridItem>
          <GridItem md={2}>
            <Field
              name='serviceIDs'
              render={args => (
                <CodeSelect
                  label='Examination'
                  mode='multiple'
                  options={serviceOptions}
                  maxTagPlaceholder='Examination'
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='visitTypeIDs'
              render={args => (
                <CodeSelect
                  label='Visit Type'
                  {...args}
                  mode='multiple'
                  code='ctVisitpurpose'
                  allowClear={true}
                />
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <Field
              name='tags'
              render={args => (
                <CodeSelect
                  label='Patient Tag'
                  mode='multiple'
                  options={cttag}
                  maxTagPlaceholder='Patient Tag'
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <Button
              color='primary'
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Generate Report
            </Button>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    </SizeContainer>
  )
}

const Connected = connect(({ codetable }) => ({
  ctservice: codetable.ctservice,
}))(FilterBar)

export default Connected
