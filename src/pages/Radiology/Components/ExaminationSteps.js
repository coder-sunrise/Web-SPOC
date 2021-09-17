import { Steps } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons'
import { RADIOLOGY_WORKITEM_STATUS } from '@/utils/constants'
import { examinationSteps } from '@/utils/codes'
import { dateFormatLongWithTimeNoSec12h } from '@/components'
import styles from './ExaminationStep.less'

const { Step } = Steps

const showIcon = (statusFK, currentStatusFK) => {
  if (
    currentStatusFK === RADIOLOGY_WORKITEM_STATUS.COMPLETED ||
    statusFK <= currentStatusFK
  ) {
    return <CheckCircleFilled style={{ color: '#33CC33' }} />
  }
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
  console.log('item', statusHistory)
  console.log('currentStatusFK', currentStatusFK)
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

export const ExaminationSteps = ({ item }) => (
  <div className='order-steps'>
    <Steps
      className={styles.orderStatus}
      size='small'
      labelPlacement='vertical'
    >
      {item &&
        examinationSteps.map(status => {
          return getStatusStep(status, item, item.statusFK)
        })}
    </Steps>
  </div>
)
