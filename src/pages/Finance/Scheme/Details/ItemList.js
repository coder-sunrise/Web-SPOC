import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi/locale'
import {
  Field,
  FastField,
  RadioGroup,
  GridContainer,
  GridItem,
  CodeSelect,
  TextField,
  NumberInput,
  Button,
  Tabs,
  Switch,
  CommonTableGrid,
} from '@/components'
import Delete from '@material-ui/icons/Delete'

function callback (key) {
  console.log(key)
}
const addContent = (type) => {
  return (
    <GridContainer>
      <GridItem xs={8}>
        <CodeSelect autoComplete code={type} />
      </GridItem>
      <GridItem xs={4}>
        <Button color='info'>Add</Button>
      </GridItem>
    </GridContainer>
  )
}
const options = [
  {
    id: 1,
    name: 'Consumables',
    content: addContent('ctVaccination'),
  },
  {
    id: 2,
    name: 'Medications',
  },
  {
    id: 3,
    name: 'Vaccines',
    content: addContent('ctVaccination'),
  },
  {
    id: 4,
    name: 'Services',
    content: addContent('ctService'),
  },
  {
    id: 5,
    name: 'Packages',
  },
]

const ItemList = ({ values, CPSwitch, classes }) => {
  console.log(values)
  return (
    <div>
      <Tabs defaultActiveKey='1' onChange={callback} options={options} />
      <CommonTableGrid
        rows={values.packageValueDto}
        FuncProps={{ pager: false }}
        // schema={schema}
        columns={[
          { name: 'inventoryPackageFK', title: 'Item' },
          { name: 'unitPrice', title: 'Unit Price' },
          { name: 'cpAmount', title: 'Co-Pay Amount' },
          { name: 'action', title: 'Actions' },
        ]}
        columnExtensions={[
          {
            columnName: 'unitPrice',
            type: 'currency',
          },
          {
            columnName: 'cpAmount',
            render: (row) => {
              return (
                <GridContainer>
                  <GridItem xs={8}>
                    <FastField
                      name={`packageValueDto[${row.rowIndex - 1}].itemValue`}
                      render={(args) => <NumberInput {...args} />}
                    />
                  </GridItem>
                  <GridItem xs={4}>
                    <FastField
                      name={`packageValueDto[${row.rowIndex -
                        1}].itemValueType`}
                      render={(args) => {
                        return (
                          <Switch
                            checkedChildren='$'
                            checkedValue='ExactAmount'
                            unCheckedChildren='%'
                            unCheckedValue='Percentage'
                            {...args}
                          />
                        )
                      }}
                    />
                  </GridItem>
                </GridContainer>
              )
            },
          },
          {
            columnName: 'action',
            align: 'center',
            render: (row) => {
              return (
                <Button
                  onClick={(e) => {
                    // updateGlobalVariable('gridIgnoreValidation', true)
                    // onExecute(e)
                  }}
                  justIcon
                  color='danger'
                  title='Delete'
                >
                  <Delete />
                </Button>
              )
            },
          },
        ]}
      />
    </div>
  )
}
export default ItemList
