import React, { useState, useEffect } from 'react'
import { List, Radio, InputNumber } from 'antd'
import { formatMessage } from 'umi'
import { FastField, Field, withFormik } from 'formik'
import {
  GridContainer,
  GridItem,
  CodeSelect,
  NumberInput,
  Popconfirm,
} from '@/components'
import SectionHeader from '../SectionHeader'
import DosageRuleTable from './DosageRule'

const AutoCalculateDosage = ({
  languageLabel,
  setFieldValue,
  values,
  ...restProps
}) => {
  const [ruleType, setRuleType] = useState('default')
  const [isChangeRuleType, setIsChangeRuleType] = useState(false)

  useEffect(() => {
    if (
      values.medicationInstructionRule &&
      values.medicationInstructionRule.length > 0
    ) {
      setRuleType(values.medicationInstructionRule[0].ruleType)
    }
  }, [values.medicationInstructionRule])

  useEffect(() => {
    console.log('values', values)
  }, [values.ruleType])

  let switchingRuleType = ''
  const handleRuleTypeClick = e => {
    const clickedItem = e.currentTarget.dataset.ruletype

    if (clickedItem === ruleType) {
      e.stopPropagation()
      e.preventDefault()
    }

    switchingRuleType = clickedItem
  }

  const handleRuleTypeChange = () => {
    setFieldValue('medicationInstructionRule', [])
    setRuleType(switchingRuleType)
  }

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
          name='prescribingUOMFK'
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
          name='dispensingUOMFK'
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
              name='prescribingUOMFK'
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
              name='dispensingUOMFK'
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
        <Field
          name='ruleType'
          render={args => (
            <Popconfirm
              title='Confirm to remove all instructions by changing setting?'
              onConfirm={handleRuleTypeChange}
            >
              <span data-ruletype='default' onClick={handleRuleTypeClick}>
                <Radio
                  value='default'
                  checked={ruleType === 'default'}
                  data-ruletype='default'
                >
                  Default
                </Radio>
              </span>
              <span data-ruletype='age' onClick={handleRuleTypeClick}>
                <Radio value='age' checked={ruleType === 'age'}>
                  by Age
                </Radio>
              </span>
              <span data-ruletype='weight' onClick={handleRuleTypeClick}>
                <Radio value='weight' checked={ruleType === 'weight'}>
                  by Weight
                </Radio>
              </span>
            </Popconfirm>
          )}
        />
      </GridItem>
      <GridItem md={12}>
        <Field
          name='medicationInstructionRule'
          render={args => (
            <DosageRuleTable
              rule={ruleType}
              medicationUsageFK={values.medicationUsageFK}
              dispenseUomFK={values.dispensingUOMFK}
              prescribeUomFK={values.prescribingUOMFK}
              initialData={values.medicationInstructionRule}
              onChange={data => {
                args.form.setFieldValue(
                  'medicationInstructionRule',
                  data.map(item => {
                    return { ...item, ruleType }
                  }),
                )
              }}
            />
          )}
        />
      </GridItem>
    </GridContainer>
  )
}

export default AutoCalculateDosage
