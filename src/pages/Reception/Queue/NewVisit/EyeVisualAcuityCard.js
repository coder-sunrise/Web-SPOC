import React, { PureComponent } from 'react'
import moment from 'moment'
// formik
import { Field } from 'formik'
// custom components
import {
  CommonCard,
  DatePicker,
  TextField,
  GridContainer,
  GridItem,
  Select,
} from '@/components'
import { Attachment, AttachmentWithThumbnail } from '@/components/_medisys'
import FormField from './formField'
import EyeVisualAcuity from '@/pages/Widgets/EyeVisualAcuity'

class ReferralCard extends PureComponent {
  state = {
    referralData: [],
    referralList: [],
  }

  componentDidMount = () => {
    this.props
      .dispatch({
        type: 'visitRegistration/getReferralList',
      })
      .then((response) => {
        if (response) {
          const result = response.data.map((m) => {
            return { name: m.name, value: m.name }
          })
          this.setState({ referralData: response.data, referralList: result })
        }
      })
  }

  onReferralByAndInstitutionChange = (e) => {
    const { values, setFieldValue } = this.props
    const { referralBy, referralInstitution, referralDate } = values
    if (referralBy && referralInstitution && !referralDate) {
      setFieldValue('referralDate', moment().formatUTC())
    }
    if (e && e[0]) {
      const data = this.state.referralData.filter((m) => m.name === e[0])
      if (data.length > 0) {
        setFieldValue('referralInstitution', data[0].institution)
      }
    }
  }

  render () {
    const { attachments, handleUpdateAttachments, isReadOnly } = this.props

    return (
      <CommonCard title='Referral'>
        <EyeVisualAcuity prefix='visitEyeVisualAcuityTest.visitEyeVisualAcuityTestForm' />
      </CommonCard>
    )
  }
}

export default ReferralCard
