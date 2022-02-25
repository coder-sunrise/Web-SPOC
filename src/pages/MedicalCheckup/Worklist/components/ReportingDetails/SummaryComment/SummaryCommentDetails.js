import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import { Button } from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import {
  CodeSelect,
  GridContainer,
  GridItem,
  MultipleTextField,
  IconButton,
  withFormikExtend,
  FastField,
  Field,
} from '@/components'
import { hasValue } from '@/pages/Widgets/PatientHistory/config'

@connect(({ medicalCheckupReportingDetails, user }) => ({
  medicalCheckupReportingDetails,
  user,
}))
@withFormikExtend({
  mapPropsToValues: ({ medicalCheckupReportingDetails }) => {
    return medicalCheckupReportingDetails.summaryCommentEntity || {}
  },
  validationSchema: Yup.object().shape({
    //comment: Yup.string().required(),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const {
      medicalCheckupReportingDetails,
      dispatch,
      onConfirm,
      saveComment = () => {},
      user,
    } = props
    const {
      medicalCheckupIndividualComment,
      medicalCheckupSummaryComment,
      medicalCheckupWorkitemDoctor,
      ...resetValue
    } = medicalCheckupReportingDetails.entity
    const newValue = {
      ...resetValue,
      medicalCheckupSummaryComment: [
        {
          commentDate: moment(),
          commentByUserFK: user.data.clinicianProfile.userProfile.id,
          sequence: medicalCheckupSummaryComment.length,
          ...values,
        },
      ],
    }
    dispatch({
      type: 'medicalCheckupReportingDetails/upsert',
      payload: { ...newValue },
    }).then(r => {
      if (r) {
        saveComment()
      }
    })
  },
  enableReinitialize: true,
  displayName: 'SummaryCommentDetails',
})
class SummaryCommentDetails extends PureComponent {
  state = { selectCategory: undefined, selectTemplate: undefined }
  onDiscard = () => {
    const { dispatch, setValues } = this.props
    dispatch({
      type: 'medicalCheckupReportingDetails/updateState',
      payload: { summaryCommentEntity: undefined },
    })
    setValues({})
  }

  onSelectComment = (val, option) => {
    if (option) {
      const { dispatch, setFieldValue, values } = this.props
      const englishComment = option.translationData
        .find(l => l.language === 'EN')
        ?.list?.find(l => (l.key = 'displayValue'))?.value
      const japaneseComment = option.translationData
        .find(l => l.language === 'JP')
        ?.list?.find(l => (l.key = 'displayValue'))?.value

      setFieldValue(
        'originalJapaneseComment',
        `${
          hasValue(values.originalJapaneseComment)
            ? `${values.originalJapaneseComment}, `
            : ``
        }${japaneseComment}`,
      )
      setFieldValue(
        'japaneseComment',
        `${
          hasValue(values.japaneseComment) ? `${values.japaneseComment}, ` : ``
        }${japaneseComment}`,
      )
      setFieldValue(
        'originalEnglishComment',
        `${
          hasValue(values.originalEnglishComment)
            ? `${values.originalEnglishComment}, `
            : ``
        }${englishComment}`,
      )
      setFieldValue(
        'englishComment',
        `${
          hasValue(values.englishComment) ? `${values.englishComment}, ` : ``
        }${englishComment}`,
      )
    }
  }
  render() {
    const { values, selectedLanguage, setFieldValue } = this.props
    return (
      <GridContainer>
        <GridItem
          md={5}
          container
          style={{ position: 'relative', paddingLeft: 80 }}
        >
          <div style={{ position: 'absolute', left: 8, bottom: 2 }}>
            Category:
          </div>
          <FastField
            name='selectCategory'
            render={args => (
              <CodeSelect
                valueField='id'
                code='CTSummaryCommentCategory'
                {...args}
                onChange={() => {
                  setFieldValue('selectComment', undefined)
                }}
              />
            )}
          />
        </GridItem>
        <GridItem
          md={7}
          container
          style={{ position: 'relative', paddingLeft: 80 }}
        >
          <div style={{ position: 'absolute', left: 8, bottom: 2 }}>
            Template:
          </div>
          <Field
            name='selectComment'
            render={args => (
              <CodeSelect
                code='CTSummaryComment'
                valueField='id'
                labelField='displayValue'
                localFilter={item =>
                  !values.selectCategory ||
                  item.summaryCommentCategoryFK === values.selectCategory
                }
                {...args}
                onChange={this.onSelectComment}
              />
            )}
          />
        </GridItem>
        <GridItem md={12}>
          <Field
            name={
              selectedLanguage === 'EN' ? 'englishComment' : 'japaneseComment'
            }
            render={args => (
              <MultipleTextField
                maxLength={2000}
                autoSize={{ minRows: 4, maxRows: 4 }}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem md={12} style={{ textAlign: 'right' }}>
          <Button size='small' type='danger' onClick={this.onDiscard}>
            Discard
          </Button>
          <Button
            size='small'
            type='primary'
            style={{ marginLeft: 10 }}
            onClick={e => {
              const { handleSubmit } = this.props
              if (handleSubmit) handleSubmit()
            }}
          >
            Save
          </Button>
        </GridItem>
      </GridContainer>
    )
  }
}
export default SummaryCommentDetails
