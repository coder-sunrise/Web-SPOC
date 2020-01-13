export const getClinicianProfile = (codetable, visitEntity) => {
  try {
    const { doctorprofile = [] } = codetable

    const visitDoctorProfileFK =
      visitEntity && visitEntity.visit
        ? visitEntity.visit.doctorProfileFK
        : undefined

    const visitDoctorProfile = doctorprofile.find(
      (dp) => dp.id === visitDoctorProfileFK,
    )

    const {
      clinicianProfile = { userProfileFK: undefined },
    } = visitDoctorProfile
    return clinicianProfile
  } catch (error) {
    console.error({ error })
    return { userProfileFK: undefined }
  }
}
