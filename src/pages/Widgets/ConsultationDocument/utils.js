export const getClinicianProfile = (codetable, visitEntity) => {
  try {
    const { doctorprofile = [] } = codetable

    const visitDoctorProfileFK =
      visitEntity && visitEntity.visit
        ? visitEntity.visit.doctorProfileFK
        : undefined

    const visitDoctorProfile = doctorprofile.find(
      dp => dp.id === visitDoctorProfileFK,
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

export const PRODUCT_CATEGORY = {
  SPECTACLE_FRAMES: 1,
  OPHTHALMIC_LENS: 2,
  CONTACT_LENS: 3,
  OTHERS: 4,
}