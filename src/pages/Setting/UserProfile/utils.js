export const constructUserProfile = (values, role) => {
  return {
    ...values.userProfile,
    password: values.userProfile.password,
    phoneNumber: values.phoneNumber,
    email: values.email,
    role: {
      ...values.role,
      ...role,
    },
    effectiveStartDate: values.effectiveDates[0],
    effectiveEndDate: values.effectiveDates[1],
  }
}
