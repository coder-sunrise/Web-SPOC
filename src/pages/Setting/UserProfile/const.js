import { status } from '@/utils/codes'

export const UserProfileTableConfig = {
  columns: [
    { name: 'userName', title: 'Login Account' },
    { name: 'name', title: 'Name' },
    {
      name: 'role',
      title: 'Role',
    },
    { name: 'isActive', title: 'Status' },
    { name: 'action', title: 'Action' },
  ],
  columnExtensions: [
    {
      columnName: 'userName',
      sortBy: 'userProfileNavigation.userName',
      render: (row) => row.userProfile.userName,
    },
    {
      columnName: 'role',
      render: (row) => (row.userProfile.role ? row.userProfile.role.name : ''),
    },
    {
      columnName: 'isActive',
      type: 'select',
      options: status,
      align: 'center',
      sortingEnabled: false,
    },
  ],
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
