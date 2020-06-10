import React from 'react'
import { connect } from 'dva'
// formik
import { FastField } from 'formik'
import { Chip, withStyles } from '@material-ui/core'
// common components
import {
  Button,
  Checkbox,
  DatePicker,
  GridContainer,
  GridItem,
  SizeContainer,
  RadioGroup,
} from '@/components'
import { DiagnosisSelect } from '@/components/_medisys'
import ReportDateRangePicker from '../ReportDateRangePicker'

const styles = (theme) => ({
  generateBtn: {
    marginBottom: theme.spacing(1),
  },
})

const FilterBar = ({
  classes,
  handleSubmit,
  isSubmitting,
  formikProps,
  ctdiagnosis = [],
}) => {
  const { values, setFieldValue } = formikProps

  const { diagnosisIds = [] } = values

  const selectedDiagnosis = ctdiagnosis.filter((diagnosis) =>
    diagnosisIds.includes(diagnosis.id),
  )

  const handleDelete = (diagnosisID) => {
    setFieldValue(
      'diagnosisIds',
      diagnosisIds.filter((item) => item !== diagnosisID),
    )
  }

  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer alignItems='flex-end'>
          <ReportDateRangePicker
            fromDateFieldName='listingFrom'
            toDateFieldName='listingTo'
          />

          <GridItem md={2}>
            <FastField
              name='viewBy'
              render={(args) => (
                <RadioGroup
                  {...args}
                  label='View By'
                  options={[
                    {
                      value: 'Monthly',
                      label: 'Monthly',
                    },
                    {
                      value: 'Weekly',
                      label: 'Weekly',
                    },
                  ]}
                />
              )}
            />
          </GridItem>
          <GridItem md={2} className={classes.generateBtn}>
            <Button
              color='primary'
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Generate Report
            </Button>
          </GridItem>
          <GridItem md={4} />
          <GridItem md={4}>
            <FastField
              name='diagnosisIds'
              render={(args) => <DiagnosisSelect {...args} mode='multiple' />}
            />
          </GridItem>
          <GridItem md={4}>
            <FastField
              name='showDetails'
              render={(args) => <Checkbox {...args} label='Show Details' />}
            />
          </GridItem>
          <GridItem md={12}>
            {selectedDiagnosis.map((item) => (
              <Chip
                style={{ margin: 8 }}
                key={item.code}
                size='small'
                variant='outlined'
                label={item.displayvalue}
                color='primary'
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </GridItem>
        </GridContainer>
      </React.Fragment>
    </SizeContainer>
  )
}

const Connected = connect(({ codetable }) => ({
  ctdiagnosis: codetable['codetable/ctsnomeddiagnosis'],
}))(FilterBar)

export default withStyles(styles, { name: 'SalesSummaryFilterBar' })(Connected)
