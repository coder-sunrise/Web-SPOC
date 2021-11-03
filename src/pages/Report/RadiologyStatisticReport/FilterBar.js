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
  ClinicianSelect,
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
            fromDateCols='1'
            toDateCols='1'
          />
          <GridItem md={2}>
            <FastField
              name='radiographerIDs'
              render={args => (
                <ClinicianSelect
                  label='Radiology Technologist'
                  noDefaultValue
                  mode='multiple'
                  temp={false}
                  maxTagPlaceholder='Radiology Technologists'
                  {...args}
                  localFilter={item => item.userProfile.role.clinicRoleFK === 3}
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
                  maxTagPlaceholder='Examinations'
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
                  maxTagPlaceholder='Visit Types'
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
                  maxTagPlaceholder='Patient Tags'
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem md={12} style={{ textAlign: 'right' }}>
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
