import { status } from '@/utils/codes'

export const UserProfileTableConfig = {
  columns: [
    { name: 'userName', title: 'Login Account' },
    { name: 'name', title: 'Name' },
    {
      name: 'role',
      title: 'User Group',
    },
    { name: 'isActive', title: 'Status' },
    { name: 'action', title: 'Action' },
  ],
  columnExtensions: [
    {
      columnName: 'userName',
      sortBy: 'userProfileFKNavigation.userName',
      render: (row) => (row.userProfile ? row.userProfile.userName : ''),
    },
    {
      columnName: 'role',
      sortingEnabled: false,
      // sortBy: 'userProfileFKNavigation.UserRole.RoleNavigation.Description',
      render: (row) =>
        row.userProfile && row.userProfile.role
          ? row.userProfile.role.name
          : '',
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
