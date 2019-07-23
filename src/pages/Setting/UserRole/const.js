export const UserRoleTableConfig = {
  columns: [
    { name: 'name', title: 'Name' },
    { name: 'description', title: 'Description' },
    { name: 'status', title: 'Status' },
    { name: 'action', title: 'Action' },
  ],
  columnExtensions: [],
  FuncProps: {
    pager: false,
  },
}

const generateDummyData = () => {
  let data = []
  for (let i = 0; i < 5; i++) {
    const profileData = {
      id: `dummyid-${i}`,
      name: `dummy name - ${i}`,
      description: 'Access rights for ...',
      status: 'Active',
    }
    data.push(profileData)
  }
  return data
}

export const dummyData = generateDummyData()
