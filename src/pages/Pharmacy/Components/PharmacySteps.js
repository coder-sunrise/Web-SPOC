import { Steps } from 'antd'
import moment from 'moment'
import _ from 'lodash'
import { CheckCircleFilled } from '@ant-design/icons'
import { pharmacyStatus } from '@/utils/codes'
import styles from './PharmacyStep.less'

const { Step } = Steps

const showIcon = (statusFK, currentStatusFK) => {
  if (currentStatusFK === 4 || statusFK <= currentStatusFK) {
    return <CheckCircleFilled style={{ color: '#33CC33' }} />
  }
  return <div style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#999999' }}></div>
}

const getStatusStep = (status, statusHistory, currentStatusFK) => {
  const lastStatus = _.orderBy(
    statusHistory,
    [
      'actionDate',
    ],
    [
      'desc',
    ],
  ).find(history => history.statusFK === status.statusFK)
  return <Step title={status.name} icon={showIcon(status.statusFK, currentStatusFK)}
    subTitle={lastStatus ? `${lastStatus.actionByUserTitle && lastStatus.actionByUserTitle.trim().length
      ? `${lastStatus.actionByUserTitle}. `
      : ''}${lastStatus.actionByUser || ''}`
      : ''}
    description={lastStatus ? `${moment(lastStatus.actionDate).format('HH:mm, DD MMMM YYYY')}` : ''}
  />
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