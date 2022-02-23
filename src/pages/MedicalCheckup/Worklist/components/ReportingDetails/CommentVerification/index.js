import React, { PureComponent } from 'react'
import moment from 'moment'
import Yup from '@/utils/yup'
import { Tabs, withFormikExtend } from '@/components'
import { Button } from 'antd'
import IndividualComment from './IndividualComment'
import SummaryComment from './SummaryComment'

@withFormikExtend({
  mapPropsToValues: ({}) => {
    return {
      individualComment: [
        {
          id: 1,
          examinationType: 'Lab',
          createBy: 'Dr. Lim',
          japaneseComment: 'Japanese Comment',
          englishComment: 'English Comment',
          isCustomized: false,
          isVerified: false,
        },
        {
          id: 2,
          examinationType: 'Lab',
          createBy: 'Dr. Lim',
          isCustomized: true,
          isVerified: true,
        },
      ],
      summaryComment: [{ id: 1, createBy: 'Dr. Lim' }],
    }
  },
  validationSchema: Yup.object().shape({}),
  handleSubmit: (values, { props, resetForm }) => {
    const { dispatch, onConfirm } = props
  },
  enableReinitialize: true,
  displayName: 'CommentVerification',
})
class CommentVerification extends PureComponent {
  getOptions = () => {
    return [
      {
        id: 0,
        name: 'Individual Comment',
        content: <IndividualComment {...this.props} />,
      },
      {
        id: 1,
        name: 'Summary Comment',
        content: <SummaryComment {...this.props} />,
      },
    ]
  }

  render() {
    const { footer, values, handleSubmit, calendarResource } = this.props
    return (
      <React.Fragment>
        <Tabs options={this.getOptions()} defaultActiveKey='0' />
        {footer &&
          footer({
            onConfirm: handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}
export default CommentVerification
