import Yup from '@/utils/yup'
import moment from 'moment'
import { notification } from '@/components'

import { getCodes } from '@/utils/codes'

let schemeTypes = []
getCodes('ctSchemeType').then((codetableData) => {
  schemeTypes = codetableData
})

// prettier-ignore
const _multiples = [2,7,6,5,4,3,2]
Yup.addMethod(Yup.string, 'NRIC', function (message) {
  return this.test('isValidNRIC', message, function (value = '') {
    const { parent, createError } = this
    const { patientAccountNoTypeFK, dob } = parent

    const firstChar = value[0] || ''
    const lastChar = value[value.length - 1] || ''
    let outputChars = []
    switch (patientAccountNoTypeFK) {
      case 1: // fin
        if (firstChar === 'F')
          // prettier-ignore
          outputChars = ['X','W','U','T','R','Q','P','N','M','L','K']
        else if (firstChar === 'G')
          // prettier-ignore
          outputChars = ['R','Q','P','N','M','L','K','X','W','U','T']
        break
      case 5:
      case 6:
      case 10:
      case 11:
      case 12:
      case 13:
        // nric
        if (firstChar === 'S')
          // prettier-ignore
          outputChars = ['J','Z','I','H','G','F','E','D','C','B','A']
        else if (firstChar === 'T')
          // prettier-ignore
          outputChars = ['G','F','E','D','C','B','A','J','Z','I','H']
        break

      default:
        return true
    }
    if (value.length !== 9)
      return createError({
        message: 'Account number must be 9 digits',
      })
    value = value.toUpperCase()

    const numericNRICString = value.substring(1, value.length - 1)

    if (!new RegExp(/^\d+$/).test(numericNRICString))
      return createError({
        message: ' Invalid account number structure',
      })
    let numberNRIC = Number(numericNRICString)
    let total = 0
    let count = 0
    while (numberNRIC !== 0) {
      total += (numberNRIC % 10) * _multiples[_multiples.length - (1 + count++)]
      numberNRIC /= 10
      numberNRIC = Math.floor(numberNRIC)
    }
    if (
      total % 11 > outputChars.length - 1 ||
      lastChar !== outputChars[total % 11]
    )
      return createError({
        message: ' Invalid account number structure',
      })

    if (dob) {
      const mDob = moment(dob)

      switch (patientAccountNoTypeFK) {
        case 5:
        case 6:
        case 10:
        case 11:
        case 12:
        case 13:
          // nric
          if (mDob.year() >= 2000) {
            if (firstChar !== 'T') {
              return createError({
                message: 'Invalid date of birth',
              })
            }
          } else if (firstChar !== 'S') {
            return createError({
              message: 'Invalid date of birth',
            })
          }
          if (
            patientAccountNoTypeFK === 13 &&
            Math.abs(mDob.diff(moment(), 'year')) >= 15
          ) {
            return createError({
              message:
                'For Singaporean age 15 and above, please choose others than SG Birth Cert',
            })
          }
          break

        default:
          return true
      }
    }
    return true
  })
})

const schemaDemographic = {
  name: Yup.string().required(),
  dob: Yup.date().required(),
  patientAccountNoTypeFK: Yup.number().required(),
  patientAccountNo: Yup.string().NRIC().required(),
  genderFK: Yup.number().required(),

  referredBy: Yup.string(),
  referralRemarks: Yup.string().when('referredBy', {
    is: 'Company',
    then: Yup.string().required(),
  }),
  referralCompanyReferenceNo: Yup.string().when('referredBy', {
    is: 'Company',
    then: Yup.string().required(),
  }),
  referredByPatientFK: Yup.number().when('referredBy', {
    is: 'Patient',
    then: Yup.number().required(),
  }),
  // dialect: Yup.string().required(),
  // contact.mobileContactNumber.number:Yup.string().render(),
  contact: Yup.object().shape({
    // contactAddress: Yup.array().compact((v) => v.isDeleted).of(
    //   Yup.object().shape({
    //     postcode: Yup.number().required(),
    //     countryFK: Yup.string().required(),
    //   }),
    // ),
    contactEmailAddress: Yup.object().shape({
      emailAddress: Yup.string().email(),
    }),
    mobileContactNumber: Yup.object().shape({
      number: Yup.string().required(),
    }),
  }),
}

const pecValidationSchema = Yup.object().shape({
  accountNoTypeFK: Yup.string().required(),
  accountNo: Yup.string().NRIC().required(),
  name: Yup.string().required(),
  relationshipFK: Yup.number().required(),
})
const schemaEmergencyContact = {
  patientEmergencyContact: Yup.array()
    .compact((v) => v.isDeleted)
    .of(pecValidationSchema),
}

const schemaAllergies = {
  patientAllergyMetaData: Yup.array().compact((v) => v.isDeleted).of(
    Yup.object().shape({
      noAllergies: Yup.boolean(),
      g6PDFK: Yup.number(),
    }),
  ),
  patientAllergy: Yup.array().compact((v) => v.isDeleted).of(
    Yup.object().shape({
      type: Yup.string().required(),
      allergyFK: Yup.number().required(),
      allergyName: Yup.string().required(),
      allergyReaction: Yup.string().required(),
      patientAllergyStatusFK: Yup.number().required(),
      adverseReaction: Yup.string(),
      onsetDate: Yup.date(),
    }),
  ),
}

const schemaSchemes = {
  patientScheme: Yup.array()
    .compact((v) => v.isDeleted)
    .unique((v) => `${v.schemeTypeFK}-${v.coPaymentSchemeFK}`, 'error', () => {
      notification.error({
        message: 'The Schemes record already exists in the system',
      })
    })
    .of(
      Yup.object().shape({
        schemeTypeFK: Yup.number().required(),
        coPaymentSchemeFK: Yup.number().when('schemeTypeFK', {
          is: (val) =>
            val === schemeTypes.find((o) => o.code === 'Corporate').id,
          then: Yup.number().required(),
        }),
        validRange: Yup.array().when('schemeTypeFK', {
          is: (val) => val <= 10, // val === undefined,
          then: Yup.array().of(Yup.date()).required().min(2),
          // otherwise: null,
          // otherwise: Yup.array().of(Yup.date().min(2)),
        }),
      }),
    ),
  schemePayer: Yup.array().compact((v) => v.isDeleted).of(
    Yup.object().shape({
      payerName: Yup.string().required(),
      payerID: Yup.string().required(),
      relationshipFK: Yup.number().required(),
      // scheme: Yup.string().required(),
      dob: Yup.date().required(),
    }),
  ),
}
const schema = Yup.object().shape({
  ...schemaDemographic,
  ...schemaEmergencyContact,
  ...schemaAllergies,
  ...schemaSchemes,
})

schema.demographic = schemaDemographic
schema.schemes = schemaSchemes
schema.allergies = schemaAllergies
schema.emergencyContact = schemaEmergencyContact

export default schema
