import { Steps } from 'antd'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import {
  RadiologyWorkitemStatus,
  RADIOLOGY_WORKITEM_STATUS,
} from '@/utils/constants'
import { examinationSteps } from '@/utils/codes'
import { dateFormatLongWithTimeNoSec12h } from '@/components'
import styles from './ExaminationStep.less'

const { Step } = Steps

const showIcon = (statusFK, currentStatusFK) => {
  if (
    currentStatusFK === RADIOLOGY_WORKITEM_STATUS.CANCELLED &&
    statusFK === currentStatusFK
  ) {
    return <CloseCircleFilled style={{ color: '#999999' }} />
  }

  if (
    currentStatusFK === RADIOLOGY_WORKITEM_STATUS.COMPLETED ||
    statusFK <= currentStatusFK
  ) {
    return <CheckCircleFilled style={{ color: '#33CC33' }} />
  }

  //Next Status
  if (statusFK === currentStatusFK + 1) {
    return (
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: '#33CC33',
        }}
      ></div>
    )
  }
  return (
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#999999',
      }}
    ></div>
  )
}

const getStatusStep = (status, statusHistory, currentStatusFK) => {
  // const lastStatus = _.orderBy(statusHistory, ['actionDate'], ['desc']).find(
  //   history => history.statusFK === status.statusFK,
  // )

  return (
    <Step
      title={<span style={{ fontWeight: 500 }}>{status.name}</span>}
      icon={showIcon(status.statusFK, currentStatusFK)}
      // subTitle={

      // lastStatus
      //   ? `${
      //       lastStatus.actionByUserTitle &&
      //       lastStatus.actionByUserTitle.trim().length
      //         ? `${lastStatus.actionByUserTitle}. `
      //         : ''
      //     }${lastStatus.actionByUser || ''}`
      //   : ''

      // }
      // description={

      // lastStatus
      //   ? `${moment(item.generateDate).format(
      //       dateFormatLongWithTimeNoSec12h,
      //     )}`
      //   : ''

      // }
    />
  )
}

export const ExaminationSteps = ({ item }) => {
  const validExaminationSteps =
    item && item.statusFK === RADIOLOGY_WORKITEM_STATUS.CANCELLED
      ? examinationSteps.filter(
          s =>
            s.statusFK === RADIOLOGY_WORKITEM_STATUS.NEW ||
            s.statusFK === RADIOLOGY_WORKITEM_STATUS.CANCELLED,
        )
      : examinationSteps.filter(
          s => s.statusFK !== RADIOLOGY_WORKITEM_STATUS.CANCELLED,
        )
  return (
    <div className='order-steps'>
      <Steps
        className={styles.orderStatus}
        size='small'
        labelPlacement='vertical'
      >
        {validExaminationSteps &&
          item &&
          validExaminationSteps.map(status => {
            return getStatusStep(status, null, item.statusFK)
          })}
      </Steps>
    </div>
  )
}
