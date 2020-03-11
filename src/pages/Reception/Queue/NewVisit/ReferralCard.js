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

  handleSelect = (e) => {
    if (e && e[0]) {
      const data = this.state.referralData.filter((m) => m.name === e[0])
      if (data.length > 0) {
        const { setFieldValue } = this.props
        setFieldValue('referralInstitution', data[0].institution)
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
                //   disabled={isReadOnly}
                //   label='Referred By'
                // />
                <Select
                  {...args}
                  label='Referred By'
                  options={this.state.referralList}
                  mode='tags'
                  maxSelected={1}
                  disableAll
                  disabled={isReadOnly}
                  onChange={this.handleSelect}
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
                  disabled={isReadOnly}
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
                  disabled={isReadOnly}
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
            />
          </GridItem>
        </GridContainer>
      </CommonCard>
    )
  }
}

export default ReferralCard
