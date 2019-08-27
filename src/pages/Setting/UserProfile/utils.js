export const constructUserProfile = (values, role) => {
  return {
    userName: values.userName,
    phoneNumber: values.phoneNumber,
    email: values.email,
    role: {
      ...role,
      concurrencyToken: values.concurrencyToken,
    },
    effectiveStartDate: values.effectiveDates[0],
    effectiveEndDate: values.effectiveDates[1],
    password: values.password,
    concurrencyToken: values.concurrencyToken,
    id: values.id,
  }
}
