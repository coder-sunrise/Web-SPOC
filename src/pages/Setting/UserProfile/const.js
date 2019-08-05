export const UserProfileTableConfig = {
  columns: [
    { name: 'userName', title: 'Login Account' },
    { name: 'name', title: 'Name' },
    {
      name: 'role',
      title: 'Role',
    },
    { name: 'status', title: 'Status' },
    { name: 'action', title: 'Action' },
  ],
  columnExtensions: [
    {
      columnName: 'role',
      render: (row) => {
        return row.role ? row.role.name : ''
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
      loginAccount: `dummy-${i}`,
      name: `dummy name - ${i}`,
      role: 'Admin',
      status: 'Active',
    }
    data.push(profileData)
  }
  return data
}

export const dummyData = generateDummyData()
