import React, { useState, useEffect } from 'react'
import { formatMessage } from 'umi'
import Yup from '@/utils/yup'
import { Field, FastField } from 'formik'
import {
  EditableTableGrid,
  CommonCard,
  GridContainer,
  GridItem,
  RadioGroup,
  TextField,
} from '@/components'
const messageVisualAcuityTest = 'Value must be between 0 and 2'
const messageIntraocularPressureTest = 'Value must be between 0 and 40 mmHg'
const gridVisualAcuityTestValidationSchema = Yup.object().shape({
  BareEye5: Yup.number()
    .min(0, messageVisualAcuityTest)
    .max(2, messageVisualAcuityTest),
  CorrectedVision5: Yup.number()
    .min(0, messageVisualAcuityTest)
    .max(2, messageVisualAcuityTest),
  BareEye50: Yup.number()
    .min(0, messageVisualAcuityTest)
    .max(2, messageVisualAcuityTest),
  CorrectedVision50: Yup.number()
    .min(0, messageVisualAcuityTest)
    .max(2, messageVisualAcuityTest),
})

const gridIntraocularPressureTestValidationSchema = Yup.object().shape({
  FirstResult: Yup.number()
    .min(0, messageIntraocularPressureTest)
    .max(40, messageIntraocularPressureTest),
  SecondResult: Yup.number()
    .min(0, messageIntraocularPressureTest)
    .max(40, messageIntraocularPressureTest),
  ThirdResult: Yup.number()
    .min(0, messageIntraocularPressureTest)
    .max(40, messageIntraocularPressureTest),
})
export default ({
  dispatch,
  classes,
  from,
  codetable,
  onVisualAcuityTestCommitChanges,
  onIntraocularPressureTestChanges,
  ...restProps
}) => {
  const {
    rowsVisualAcuityTest = [],
    rowsIntraocularPressureTest = [],
    isEditable = true,
  } = restProps

  const tableVisualAcuityTestParas = {
    columns: [
      { name: 'type', title: 'Eye/Distance' },
      { name: 'BareEye5', title: '5m (Bare Eye)' },
      { name: 'CorrectedVision5', title: '5m (Corrected Vision)' },
      { name: 'BareEye50', title: '50cm (Bare Eye)' },
      { name: 'CorrectedVision50', title: '50cm (Corrected Vision)' },
    ],

    columnExtensions: [
      {
        columnName: 'type',
        width: 120,
        isDisabled: () => true,
        sortingEnabled: false,
      },
      {
        columnName: 'BareEye5',
        type: 'number',
        align: 'center',
        precision: 1,
        sortingEnabled: false,
      },
      {
        columnName: 'CorrectedVision5',
        type: 'number',
        align: 'center',
        precision: 1,
        sortingEnabled: false,
      },
      {
        columnName: 'BareEye50',
        type: 'number',
        align: 'center',
        precision: 1,
        sortingEnabled: false,
      },
      {
        columnName: 'CorrectedVision50',
        type: 'number',
        align: 'center',
        precision: 1,
        sortingEnabled: false,
      },
    ],
  }

  const tableIntraocularPressureTestParas = {
    columns: [
      { name: 'type', title: 'Eye/Test Result' },
      { name: 'FirstResult', title: '1st Result (mmHg)' },
      { name: 'SecondResult', title: '2nd Result (mmHg)' },
      { name: 'ThirdResult', title: '3rd Result (mmHg)' },
      { name: 'AverageResult', title: 'Average Result (mmHg)' },
    ],

    columnExtensions: [
      {
        columnName: 'type',
        width: 120,
        isDisabled: () => true,
        sortingEnabled: false,
      },
      {
        columnName: 'FirstResult',
        type: 'number',
        align: 'center',
        precision: 0,
        sortingEnabled: false,
      },
      {
        columnName: 'SecondResult',
        type: 'number',
        align: 'center',
        precision: 0,
        sortingEnabled: false,
      },
      {
        columnName: 'ThirdResult',
        type: 'number',
        align: 'center',
        precision: 0,
        sortingEnabled: false,
      },
      {
        columnName: 'AverageResult',
        type: 'number',
        align: 'center',
        precision: 1,
        sortingEnabled: false,
        // isDisabled: () => true,
      },
    ],
  }

  return (
    <div>
      <CommonCard title='Visual Acuity Test' style={{ padding: '0px 10px' }}>
        <Field
          name={`corEyeExaminations[0].visionCorrectionMethod`}
          render={args => (
            <RadioGroup
              label='Vision Correction Method'
              options={[
                { value: 'Contact Lens', label: 'Contact Lens' },
                { value: 'Glasses', label: 'Glasses' },
              ]}
              {...args}
            />
          )}
        />
        <EditableTableGrid
          size='sm'
          style={{ margin: 0 }}
          rows={rowsVisualAcuityTest}
          schema={gridVisualAcuityTestValidationSchema}
          FuncProps={{
            pager: false,
            edit: isEditable,
          }}
          EditingProps={{
            showAddCommand: false,
            showCommandColumn: false,
            onCommitChanges: onVisualAcuityTestCommitChanges,
          }}
          {...tableVisualAcuityTestParas}
        />
      </CommonCard>
      <CommonCard title='Intraocular Pressure Test (IOP)'>
        <EditableTableGrid
          size='sm'
          style={{ margin: 0 }}
          rows={rowsIntraocularPressureTest}
          schema={gridIntraocularPressureTestValidationSchema}
          FuncProps={{
            pager: false,
            edit: isEditable,
          }}
          EditingProps={{
            showAddCommand: false,
            showCommandColumn: false,
            onCommitChanges: onIntraocularPressureTestChanges,
          }}
          {...tableIntraocularPressureTestParas}
        />
      </CommonCard>
      <CommonCard title='Color Vision Test'>
        <div style={{ position: 'relative', paddingLeft: 200 }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
            }}
          >
            <Field
              name={`corEyeExaminations[0].colorVisionTestResult`}
              render={args => (
                <RadioGroup
                  label='Color Vision Test Result'
                  options={[
                    { value: 'Normal', label: 'Normal' },
                    { value: 'Abnormal', label: 'Abnormal' },
                  ]}
                  {...args}
                />
              )}
            />
          </div>
          <GridContainer>
            <GridItem md={12}>
              <FastField
                name={`corEyeExaminations[0].remarks`}
                render={args => (
                  <TextField label='Remarks' maxLength={2000} {...args} />
                )}
              />
            </GridItem>
          </GridContainer>
        </div>
      </CommonCard>
    </div>
  )
}
