import { Steps } from 'antd'
import moment from 'moment'
import _ from 'lodash'
import { CheckCircleFilled } from '@ant-design/icons'
import { pharmacyStatus } from '@/utils/codes'
import { PHARMACY_STATUS } from '@/utils/constants'
import { Tooltip } from '@/components'
import styles from './PharmacyStep.less'

const { Step } = Steps

const showIcon = (statusFK, currentStatusFK, isPartialDispense) => {
  if (isPartialDispense && statusFK === PHARMACY_STATUS.COMPLETED)
    return <CheckCircleFilled style={{ color: 'orange' }} />

  if (
    currentStatusFK === PHARMACY_STATUS.COMPLETED ||
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

const getStatusStep = (
  status,
  statusHistory,
  currentStatusFK,
  isPartialDispense,
) => {
  const lastStatus = _.orderBy(statusHistory, ['actionDate'], ['desc']).find(
    history => history.statusFK === status.statusFK,
  )

  let updateTimeTooltip
  if (lastStatus) {
    if (lastStatus.statusFK === PHARMACY_STATUS.NEW) {
      updateTimeTooltip = 'Order create/update time'
    } else if (lastStatus.statusFK === PHARMACY_STATUS.PREPARED) {
      updateTimeTooltip = 'Order prepared time'
    } else if (lastStatus.statusFK === PHARMACY_STATUS.VERIFIED) {
      updateTimeTooltip = 'Order verified time'
    } else {
      updateTimeTooltip = 'Order completed time'
    }
  }
  return (
    <Step
      title={
        <span style={{ fontWeight: 500 }}>
          {isPartialDispense && status.statusFK === PHARMACY_STATUS.COMPLETED
            ? `${status.name} (Partial Dispense)`
            : status.name}
        </span>
      }
      icon={showIcon(status.statusFK, currentStatusFK, isPartialDispense)}
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
        <Tooltip title={updateTimeTooltip}>
          <div>
            {lastStatus
              ? `${moment(lastStatus.actionDate).format('DD MMM YYYY HH:mm')}`
              : ''}
          </div>
        </Tooltip>
      }
    />
  )
}

export const PharmacySteps = ({
  statusHistory,
  currentStatusFK,
  isPartialDispense,
}) => {
  return (
    <div className='order-steps'>
      <Steps
        className={styles.orderStatus}
        size='small'
        labelPlacement='vertical'
        current={currentStatusFK}
      >
        {pharmacyStatus.map(status => {
          return getStatusStep(
            status,
            statusHistory,
            currentStatusFK,
            isPartialDispense,
          )
        })}
        {isPartialDispense && (
          <Step
            title={<span style={{ fontWeight: 500 }}>Completed</span>}
            icon={
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: 'gray',
                }}
              ></div>
            }
          />
        )}
      </Steps>
    </div>
  )
}
