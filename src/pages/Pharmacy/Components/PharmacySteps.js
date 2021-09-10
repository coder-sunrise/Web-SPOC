import { Steps } from 'antd'
import moment from 'moment'
import _ from 'lodash'
import { CheckCircleFilled } from '@ant-design/icons'
import { pharmacyStatus } from '@/utils/codes'
import { PHARMACY_STATUS } from '@/utils/constants'
import styles from './PharmacyStep.less'

const { Step } = Steps

const showIcon = (statusFK, currentStatusFK) => {
  if (
    currentStatusFK === PHARMACY_STATUS.DISPENSED ||
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
  const lastStatus = _.orderBy(statusHistory, ['actionDate'], ['desc']).find(
    history => history.statusFK === status.statusFK,
  )
  return (
    <Step
      title={<span style={{ fontWeight: 500 }}>{status.name}</span>}
      icon={showIcon(status.statusFK, currentStatusFK)}
      subTitle={
        lastStatus
          ? `${
              lastStatus.actionByUserTitle &&
              lastStatus.actionByUserTitle.trim().length
                ? `${lastStatus.actionByUserTitle}. `
                : ''
            }${lastStatus.actionByUser || ''}`
          : ''
      }
      description={
        lastStatus
          ? `${moment(lastStatus.actionDate).format('HH:mm, DD MMM YYYY')}`
          : ''
      }
    />
  )
}

export const PharmacySteps = ({ statusHistory, currentStatusFK }) => {
  return (
    <div className='order-steps'>
      <Steps
        className={styles.orderStatus}
        size='small'
        labelPlacement='vertical'
        current={currentStatusFK}
      >
        {pharmacyStatus.map(status => {
          return getStatusStep(status, statusHistory, currentStatusFK)
        })}
      </Steps>
    </div>
  )
}
