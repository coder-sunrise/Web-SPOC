export const constructUserProfile = (values, role) => {
  return {
    password: values.userProfile.password,
    phoneNumber: values.phoneNumber,
    email: values.email,
    role: {
      ...role,
      concurrencyToken: values.concurrencyToken,
    },
    effectiveStartDate: values.effectiveDates[0],
    effectiveEndDate: values.effectiveDates[1],
    concurrencyToken: values.concurrencyToken,
    ...values.userProfile,
  }
}
