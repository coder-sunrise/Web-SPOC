import React, { useState, useEffect } from 'react'
import { List, Radio } from 'antd'
import { formatMessage } from 'umi'
import { FastField } from 'formik'
import { GridContainer, GridItem, CodeSelect, NumberInput } from '@/components'
import SectionHeader from '../SectionHeader'
import EditableTable from './DosageRule'

const AutoCalculateDosage = ({ languageLabel }) => {
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
        <Radio.Group onChange={() => {}} value={1}>
          <Radio value={1}>Default</Radio>
          <Radio value={2}>by Age</Radio>
          <Radio value={3}>by Weight</Radio>
        </Radio.Group>
      </GridItem>
      <GridItem md={12}>
        <EditableTable />
      </GridItem>
    </GridContainer>
  )
}

export default AutoCalculateDosage
