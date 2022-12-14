import {
  GridContainer,
  GridItem,
  TextField,
  DatePicker,
  NumberInput,
} from '@/components'
import { FastField, withFormik } from 'formik'
import Yup from '@/utils/yup'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import ContactLensPrescriptionModule from './components/ContactLensPrescriptionModule'
import { useTheme } from '@material-ui/core'
import CodeSelect from '@/components/Select/CodeSelect'
import moment from 'moment'
import { ableToViewByAuthority } from '@/utils/utils'
import AuthorizedContext from '@/components/Context/Authorized'
import CommonContactLensOrderForm from '@/pages/Widgets/ConsultationDocument/CommonContactLensOrderForm'

const _styles = withStyles(theme => ({}), { withTheme: true })

const _formik = withFormik({
  mapPropsToValues: ({
    consultationDocument,
    patient,
    user,
    corVisionRefraction,
    forDispense,
    consultation,
  }) => {
    if (consultationDocument.entity) return consultationDocument.entity
    const {
      entity: { name = '', patientReferenceNo = '' },
    } = patient
    let formVisionRefraction = corVisionRefraction || {}
    if (forDispense) {
      formVisionRefraction =
        consultation.entity?.latestCORVisionRefraction || {}
    }
    return {
      type: consultationDocument.type,
      dateOrdered: moment(),
      issuedByUserFK: user.data.clinicianProfile.userProfileFK,
      issuedByUser: user.data.clinicianProfile.name,
      issuedByUserTitle: user.data.clinicianProfile.title,
      /*  default left value */
      leftSPH: formVisionRefraction.subjectiveRefraction_LE_SPH,
      leftCYL: formVisionRefraction.subjectiveRefraction_LE_CYL,
      leftAXIS: formVisionRefraction.subjectiveRefraction_LE_AXIS,
      leftADD: formVisionRefraction.subjectiveRefraction_NearAddition_LE_Value,
      leftVA: `${formVisionRefraction.subjectiveRefraction_LE_VA ||
        ''}/${formVisionRefraction.subjectiveRefraction_LE_VA_Comments || ''}`,
      leftPH: formVisionRefraction.subjectiveRefraction_LE_PH,
      /*  default right value */
      rightSPH: formVisionRefraction.subjectiveRefraction_RE_SPH,
      rightCYL: formVisionRefraction.subjectiveRefraction_RE_CYL,
      rightAXIS: formVisionRefraction.subjectiveRefraction_RE_AXIS,
      rightADD: formVisionRefraction.subjectiveRefraction_NearAddition_RE_Value,
      rightVA: `${formVisionRefraction.subjectiveRefraction_RE_VA ||
        ''}/${formVisionRefraction.subjectiveRefraction_RE_VA_Comments || ''}`,
      rightPH: formVisionRefraction.subjectiveRefraction_RE_PH,
    }
  },
  validationSchema: Yup.object().shape({
    leftLensQuantity: Yup.number()
      .min(0, 'Quantity must be greater than or equal to 0')
      .integer('Quantity must be an integer'),
    rightLensQuantity: Yup.number()
      .min(0, 'Quantity must be greater than or equal to 0')
      .integer('Quantity must be an integer'),
  }),
  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, getNextSequence } = props
    const nextSequence = getNextSequence()
    dispatch({
      type: 'consultationDocument/upsertRow',
      payload: {
        subject: 'Contact Lens Order Form',
        sequence: nextSequence,
        ...values,
      },
    })
    if (onConfirm) onConfirm()
  },
})

const ContactLensOrderForm = props => {
  let { classes, footer, handleSubmit } = props
  let { spacing } = useTheme()
  let editEnable = ableToViewByAuthority(
    'queue.consultation.widgets.consultationdocument.contactlensorderform',
  )
  return (
    <>
      <AuthorizedContext.Provider
        value={{
          rights: editEnable ? 'enable' : 'disable',
        }}
      >
        <header>
          <GridContainer>
            <GridItem xs={6}>
              <FastField
                name='jobReferenceNo'
                render={args => {
                  return (
                    <TextField
                      label='Job Reference Number'
                      disabled
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={6}>
              <FastField
                name='dateOrdered'
                render={args => {
                  return <DatePicker label='Date Ordered' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={6}>
              <FastField
                name='supplierFK'
                render={args => {
                  return (
                    <CodeSelect
                      code='ctsupplier'
                      labelField='displayValue'
                      label='Supplier'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={6}>
              <FastField
                name='dateRequired'
                render={args => {
                  return <DatePicker label='Date Required' {...args} />
                }}
              />
            </GridItem>
          </GridContainer>
        </header>
        <div style={{ margin: '0px 8px' }}>
          <CommonContactLensOrderForm />
        </div>
      </AuthorizedContext.Provider>

      {footer &&
        footer({
          onConfirm: handleSubmit,
          confirmBtnText: 'Save',
          confirmProps: {
            disabled: !editEnable,
          },
        })}
    </>
  )
}
export default compose(_styles, _formik)(ContactLensOrderForm)
