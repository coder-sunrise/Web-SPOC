import { status } from '@/utils/codes'

export const UserRoleTableConfig = {
  columns: [
    { name: 'code', title: 'Code' },
    { name: 'name', title: 'Name' },
    { name: 'description', title: 'Description' },
    { name: 'clinicalRoleName', title: 'Clinical Role' },
    { name: 'status', title: 'Status' },
    { name: 'action', title: 'Action' },
  ],
  columnExtensions: [
    {
      columnName: 'status',
      type: 'select',
      options: status,
      align: 'center',
      sortingEnabled: false,
      render: (row) => {
        // console.log(row)
        return (
          <span style={{ color: row.status === 'Active' ? 'green' : 'red' }}>
            {row.status}
          </span>
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
