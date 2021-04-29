import { Field } from 'formik'
import { GridContainer, GridItem, Select } from '@/components'

const permissionList = {
  Module: [
    'ReadWrite',
    'ReadOnly',
    'Hidden',
  ],
  Action: [
    'Enable',
    'Disable',
    'Hidden',
  ],
  Field: [
    'ReadWrite',
    'ReadOnly',
    'Hidden',
  ],
}

const permissionOption = ({ type, permission }) => {
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
  let result = permissionList[type].map((p) => {
    return { name: p, value: p }
  })
  return result
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
