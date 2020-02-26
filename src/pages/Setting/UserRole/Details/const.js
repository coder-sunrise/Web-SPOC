import { FastField, Field } from 'formik'
import {
  GridContainer,
  GridItem,
  Select,
  EditableTableGrid,
} from '@/components'

const permissionList = {
  Module: [
    'ReadWrite',
    'ReadOnly',
    'Hidden',
  ],
  Action: [
    'Enabled',
    'Disabled',
    'Hidden',
  ],
  Field: [
    'ReadWrite',
    'ReadOnly',
    'Hidden',
  ],
}

const permissionOption = ({ type, permission }) => {
  // console.log(type)
  const result = []
  const baseType = [
    'Module',
    'Action',
    'Field',
  ]
  if (baseType.indexOf(type) < 0) {
    for (let i = 0; i < baseType.length; i++) {
      if (permissionList[baseType[i]].indexOf(permission) >= 0) {
        type = baseType[i]
        break
      }
    }
  }
  permissionList[type].map((p) => {
    return result.push({ name: p, value: p })
  })
  return result
}

export const AccessRightConfig = {
  columns: [
    { name: 'module', title: 'Module' },
    { name: 'displayValue', title: 'Function Access' },
    { name: 'permission', title: 'Accessbility' },
  ],
  columnExtensions: [
    {
      columnName: 'permission',
      type: 'select',
      align: 'center',
      width: 250,
      sortingEnabled: false,
      render: (row) => {
        // console.log('row', row)
        return (
          <GridContainer style={{ justifyContent: 'center' }}>
            <GridItem md={6}>
              <Field
                name={`filteredAccessRight[${row.rowIndex}].permission`}
                render={(args) => (
                  <Select
                    // value={row.permission}
                    {...args}
                    options={permissionOption(row)}
                    onChange={(e) => {
                      console.log(row.permission)
                      console.log(e)
                    }}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
        )
      },
    },
  ],
  FuncProps: {
    pager: false,
  },
}

const generateDummyData = () => {
  let data = []
  for (let i = 0; i < 5; i++) {
    const profileData = {
      id: `dummyid-${i}`,
      code: 'DO1',
      name: `dummy name - ${i}`,
      description: 'Access rights for ...',
      clinical_role: 'Doctor',
      status: 'Active',
    }
    data.push(profileData)
  }
  return data
}

export const dummyData = generateDummyData()
