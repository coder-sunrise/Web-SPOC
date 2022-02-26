import React, { PureComponent } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import Yup from '@/utils/yup'
import { Tabs, withFormikExtend } from '@/components'
import { Button } from 'antd'
import { withStyles } from '@material-ui/core'
import IndividualComment from './IndividualComment'
import SummaryComment from './SummaryComment'

const styles = theme => ({
  pendingVerifyCount: {
    marginLeft: 10,
    color: 'white',
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    display: 'inline-block',
  },
})
@connect(({ medicalCheckupReportingDetails, user }) => ({
  medicalCheckupReportingDetails,
  user,
}))
@withFormikExtend({
  mapPropsToValues: ({ medicalCheckupReportingDetails }) => {
    return medicalCheckupReportingDetails.entity || {}
  },
  validationSchema: Yup.object().shape({}),
  handleSubmit: (values, { props, resetForm }) => {
    const { dispatch, onConfirm } = props
    dispatch({
      type: 'medicalCheckupReportingDetails/upsert',
      payload: { ...values },
    }).then(r => {
      if (r) {
        onConfirm()
      }
    })
  },
  enableReinitialize: true,
  displayName: 'CommentVerification',
})
class CommentVerification extends PureComponent {
  getOptions = () => {
    const { values, classes } = this.props
    const {
      medicalCheckupIndividualComment = [],
      medicalCheckupSummaryComment = [],
    } = values
    const individualPendingVerifyCount = medicalCheckupIndividualComment.filter(
      item => !item.isVerified,
    ).length
    const summaryPendingVerifyCount = medicalCheckupSummaryComment.filter(
      item => !item.isVerified,
    ).length
    return [
      {
        id: 0,
        name: (
          <div>
            <span style={{ display: 'inline-block' }}>Individual Comment</span>
            <div className={classes.pendingVerifyCount}>
              {individualPendingVerifyCount}
            </div>
          </div>
        ),
        content: <IndividualComment {...this.props} />,
      },
      {
        id: 1,
        name: (
          <div>
            <span style={{ display: 'inline-block' }}>Summary Comment</span>
            <div className={classes.pendingVerifyCount}>
              {summaryPendingVerifyCount}
            </div>
          </div>
        ),
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
export default withStyles(styles, { name: 'CommentVerification' })(
  CommentVerification,
)
