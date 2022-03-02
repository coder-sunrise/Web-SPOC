import React, { PureComponent, useState, useEffect } from 'react'
import { compose } from 'redux'
import Yup from '@/utils/yup'
import { Button } from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import { useCodeTable } from '@/utils/hooks'
import {
  CodeSelect,
  GridContainer,
  GridItem,
  MultipleTextField,
  IconButton,
  withFormikExtend,
  FastField,
  Field,
  notification,
} from '@/components'
import { hasValue } from '@/pages/Widgets/PatientHistory/config'

const SummaryCommentDetails = props => {
  const {
    values,
    selectedLanguage,
    setFieldValue,
    dispatch,
    setValues,
    isEditEnable = true,
    medicalCheckupReportingDetails,
    handleSubmit,
  } = props

  useEffect(() => {
    if (medicalCheckupReportingDetails.isNeedToClearSummaryComment) {
      setValues({})
      dispatch({
        type: 'medicalCheckupReportingDetails/updateState',
        payload: {
          isNeedToClearSummaryComment: false,
        },
      })
    }
  }, [medicalCheckupReportingDetails.isNeedToClearSummaryComment])

  const onDiscard = () => {
    dispatch({
      type: 'medicalCheckupReportingDetails/updateState',
      payload: { summaryCommentEntity: undefined },
    })
    setValues({})
  }

  const onSelectComment = (val, option) => {
    if (option) {
      setFieldValue(
        'originalJapaneseComment',
        `${
          hasValue(values.originalJapaneseComment)
            ? `${values.originalJapaneseComment}, `
            : ``
        }${option.japaneseDisplayValue}`,
      )
      setFieldValue(
        'japaneseComment',
        `${
          hasValue(values.japaneseComment) ? `${values.japaneseComment}, ` : ``
        }${option.japaneseDisplayValue}`,
      )
      setFieldValue(
        'originalEnglishComment',
        `${
          hasValue(values.originalEnglishComment)
            ? `${values.originalEnglishComment}, `
            : ``
        }${option.englishDisplayValue}`,
      )
      setFieldValue(
        'englishComment',
        `${
          hasValue(values.englishComment) ? `${values.englishComment}, ` : ``
        }${option.englishDisplayValue}`,
      )
    }
  }

  const getCommentOptions = () => {
    const ctsummaryComment = useCodeTable('ctsummarycomment')
    return ctsummaryComment.map(item => {
      const englishComment = item.translationData
        .find(l => l.language === 'EN')
        ?.list?.find(l => (l.key = 'displayValue'))?.value
      const japaneseComment = item.translationData
        .find(l => l.language === 'JP')
        ?.list?.find(l => (l.key = 'displayValue'))?.value
      return {
        ...item,
        englishDisplayValue: englishComment,
        japaneseDisplayValue: japaneseComment,
      }
    })
  }

  const commentOptions = getCommentOptions()

  const onSave = () => {
    const { japaneseComment, englishComment } = values
    if (
      (!hasValue(japaneseComment) || !japaneseComment.trim().length) &&
      (!hasValue(englishComment) || !englishComment.trim().length)
    ) {
      notification.warning({
        message: 'Please input comment.',
      })
      return
    }
    if (handleSubmit) handleSubmit()
  }
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
              disabled={!isEditEnable}
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
              options={commentOptions}
              valueField='id'
              disabled={!isEditEnable}
              labelField={
                selectedLanguage === 'EN'
                  ? 'englishDisplayValue'
                  : 'japaneseDisplayValue'
              }
              localFilter={item =>
                !values.selectCategory ||
                item.summaryCommentCategoryFK === values.selectCategory
              }
              {...args}
              onChange={onSelectComment}
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
              disabled={!isEditEnable}
              autoSize={{ minRows: 4, maxRows: 4 }}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={12} style={{ textAlign: 'right' }}>
        <Button
          size='small'
          type='danger'
          onClick={onDiscard}
          disabled={!isEditEnable}
        >
          Discard
        </Button>
        <Button
          size='small'
          type='primary'
          style={{ marginLeft: 10 }}
          disabled={!isEditEnable}
          onClick={onSave}
        >
          Save
        </Button>
      </GridItem>
    </GridContainer>
  )
}
export default compose(
  connect(({ medicalCheckupReportingDetails, user }) => ({
    medicalCheckupReportingDetails,
    user,
  })),
  withFormikExtend({
    mapPropsToValues: ({ medicalCheckupReportingDetails }) => {
      return medicalCheckupReportingDetails.summaryCommentEntity || {}
    },
    validationSchema: Yup.object().shape({
      //comment: Yup.string().required(),
    }),
    handleSubmit: (values, { props, resetForm, setValues }) => {
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
      if (
        values.originalJapaneseComment !== values.japaneseComment ||
        values.originalEnglishComment !== values.englishComment
      ) {
        values.isCustomized = true
      }
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
          setValues({})
          saveComment()
        }
      })
    },
    enableReinitialize: true,
    displayName: 'SummaryCommentDetails',
  }),
)(SummaryCommentDetails)
