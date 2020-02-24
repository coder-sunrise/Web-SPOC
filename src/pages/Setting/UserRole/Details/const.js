import { FastField } from 'formik'
import {
  GridContainer,
  GridItem,
  Select,
  EditableTableGrid,
} from '@/components'

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
      sortingEnabled: false,
      width: 250,
      render: (row) => {
        // console.log(row)
        return (
          <GridContainer style={{ justifyContent: 'center' }}>
            <GridItem md={6}>
              <Select
                value={row.permission}
                options={[
                  { name: 'ReadWrite', value: 0 },
                  { name: 'ReadOnly', value: 1 },
                  { name: 'Enabled', value: 2 },
                  { name: 'Disabled', value: 3 },
                  { name: 'Hidden', value: 4 },
                ]}
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
