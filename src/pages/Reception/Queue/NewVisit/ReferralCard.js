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

  onInstitutionChange = () => {
    const { values, setFieldValue } = this.props
    const { referralBy, referralInstitution, referralDate } = values
    if (referralBy && referralInstitution && !referralDate) {
      setFieldValue('referralDate', moment().formatUTC())
    }
  }

  onReferralByChange = (referralBy) => {
    const { values, setFieldValue } = this.props
    const { referralInstitution, referralDate } = values
    let _referralInstitution = referralInstitution

    if (Array.isArray(referralBy) && referralBy.length > 0) {
      const data = this.state.referralData.filter(
        (m) => m.name === referralBy[0],
      )

      if (data.length > 0 && !!data[0].institution) {
        _referralInstitution = data[0].institution
        setFieldValue('referralInstitution', data[0].institution)
      }

      // if have referralBy and referralInstitution, auto populate referralDate
      if (_referralInstitution && !referralDate) {
        setFieldValue('referralDate', moment().formatUTC())
      }
    }
  }

  render () {
    const { attachments, handleUpdateAttachments, isReadOnly } = this.props

    return (
      <CommonCard title='Referral'>
        <GridContainer>
          <GridItem xs md={4}>
            <Field
              name={FormField['referral.referralPersonFK']}
              render={(args) => (
                // <TextField
                //   {...args}
                //   //disabled={isReadOnly}
                //   label='Referred By'
                // />
                <Select
                  {...args}
                  label='Referred By'
                  options={this.state.referralList}
                  mode='tags'
                  maxSelected={1}
                  disableAll
                  // disabled={isReadOnly}
                  onChange={this.onReferralByChange}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={4}>
            <Field
              name={FormField['referral.referralDate']}
              render={(args) => (
                <DatePicker
                  {...args}
                  disabledDate={(d) => !d || d.isAfter(moment())}
                  // disabled={isReadOnly}
                  label='Referral Date'
                />
              )}
            />
          </GridItem>
          <GridItem xs md={4} />
          <GridItem xs md={4}>
            <Field
              name={FormField['referral.referralCompanyFK']}
              render={(args) => (
                <TextField
                  label='Institution'
                  // //disabled={isReadOnly}
                  onChange={this.onInstitutionChange}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={8} />
          <GridItem xs md={12}>
            <AttachmentWithThumbnail
              label='Attachment'
              attachmentType='VisitReferral'
              handleUpdateAttachments={handleUpdateAttachments}
              attachments={attachments}
              isReadOnly={isReadOnly}
              fieldName='visitAttachment'
            />
          </GridItem>
        </GridContainer>
      </CommonCard>
    )
  }
}

export default ReferralCard
