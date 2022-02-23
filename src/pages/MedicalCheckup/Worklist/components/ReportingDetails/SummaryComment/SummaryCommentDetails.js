import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
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
import { Button } from 'antd'
import { connect } from 'dva'

@connect(({ medicalCheckupReportingDetails }) => ({
  medicalCheckupReportingDetails,
}))
@withFormikExtend({
  mapPropsToValues: ({ medicalCheckupReportingDetails }) => {
    return medicalCheckupReportingDetails.summaryCommentEntity || {}
  },
  validationSchema: Yup.object().shape({
    comment: Yup.string().required(),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { dispatch, onConfirm } = props
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
    setValues({
      comment: undefined,
      selectCategory: undefined,
      selectTemplate: undefined,
    })
  }
  render() {
    const { values } = this.props
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
              />
            )}
          />
        </GridItem>
        <GridItem md={12}>
          <FastField
            name='comment'
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
