import React, { useState, useEffect } from 'react'
import { List, Radio, InputNumber } from 'antd'
import { formatMessage } from 'umi'
import { FastField, Field, withFormik } from 'formik'
import { GridContainer, GridItem, CodeSelect, NumberInput } from '@/components'
import SectionHeader from '../SectionHeader'
import EditableTable from './DosageRule'

const AutoCalculateDosage = ({ languageLabel, values }) => {
  const { ruleType } = values

  useEffect(() => {
    console.log('values', values)
  }, [values.ruleType])

  const optionLabelLength = 40
  return (
    <GridContainer>
      <GridItem md={6}>
        <SectionHeader style={{ display: 'inline-flex', marginRight: 20 }}>
          Prescribing {languageLabel}
        </SectionHeader>
      </GridItem>
      <GridItem md={6}>
        <SectionHeader style={{ display: 'inline-flex', marginRight: 20 }}>
          Dispensing {languageLabel}
        </SectionHeader>
      </GridItem>
      <GridItem md={3}>
        <FastField
          name='medicationUsageFK'
          render={args => (
            <CodeSelect
              label={formatMessage({
                id: 'inventory.master.setting.usage',
              })}
              labelField='name'
              code='ctMedicationUsage'
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={3}>
        <FastField
          name='prescribeUomFK'
          render={args => (
            <CodeSelect
              label={formatMessage({
                id: 'inventory.master.setting.uom',
              })}
              labelField='name'
              code='ctmedicationunitofmeasurement'
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={3}>
        <FastField
          name='dispenseUomFK'
          render={args => (
            <CodeSelect
              label={formatMessage({
                id: 'inventory.master.setting.uom',
              })}
              labelField='name'
              code='ctmedicationunitofmeasurement'
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={3}>
        <GridContainer>
          <GridItem md={5}>
            <FastField
              name='prescriptionToDispenseConversion'
              render={args => (
                <NumberInput
                  label={formatMessage({
                    id:
                      'inventory.master.setting.prescriptionToDispenseConversion',
                  })}
                  format='0.0'
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem>
            <FastField
              name='prescribeUomFK'
              render={args => (
                <CodeSelect
                  style={{ marginTop: 15 }}
                  label=''
                  text
                  labelField='name'
                  optionLabelLength={optionLabelLength}
                  code='ctmedicationunitofmeasurement'
                  {...args}
                />
              )}
            />
          </GridItem>

          <GridItem>
            <div style={{ marginTop: 30, fontSize: 16 }}>= 1.0</div>
          </GridItem>
          <GridItem>
            <FastField
              name='dispenseUomFK'
              render={args => (
                <CodeSelect
                  style={{ marginTop: 15 }}
                  label=''
                  text
                  labelField='name'
                  optionLabelLength={optionLabelLength}
                  code='ctmedicationunitofmeasurement'
                  {...args}
                />
              )}
            />
          </GridItem>
        </GridContainer>
      </GridItem>
      <GridItem md={12}>
        <SectionHeader style={{ display: 'inline-flex', marginRight: 20 }}>
          Instruction Setting
        </SectionHeader>
        <FastField
          name='ruleType'
          render={args => (
            <Radio.Group
              onChange={e =>
                args.form.setFieldValue('ruleType', e.target.value)
              }
            >
              <Radio value='default'>Default</Radio>
              <Radio value='age'>by Age</Radio>
              <Radio value='weight'>by Weight</Radio>
            </Radio.Group>
          )}
        />
      </GridItem>
      <GridItem md={12}>
        <Field
          name='dosageRules'
          render={args => (
            <EditableTable
              rule={ruleType}
              medicationUsageFK={values.medicationUsageFK}
              dispenseUomFK={values.dispenseUomFK}
              prescribeUomFK={values.prescribeUomFK}
            />
          )}
        />
      </GridItem>
    </GridContainer>
  )
}

export default AutoCalculateDosage
