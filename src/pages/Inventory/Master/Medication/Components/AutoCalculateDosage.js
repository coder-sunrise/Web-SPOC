import React, { useState, useEffect } from 'react'
import { List, Radio } from 'antd'
import { GridContainer, GridItem, CodeSelect, NumberInput } from '@/components'
import SectionHeader from './SectionHeader'
import EditableTable from './DosageRule'

const AutoCalculateDosage = () => {
  return (
    <GridContainer>
      <GridItem md={12}>
        <SectionHeader style={{ display: 'inline-flex', marginRight: 20 }}>
          Auto Calculate Dosage
        </SectionHeader>
        <Radio.Group onChange={() => {}} value={1}>
          <Radio value={1}>None</Radio>
          <Radio value={2}>by Age</Radio>
          <Radio value={3}>by Weight</Radio>
        </Radio.Group>
      </GridItem>
      <GridItem md={12}></GridItem>
    </GridContainer>
  )
}

export default AutoCalculateDosage
