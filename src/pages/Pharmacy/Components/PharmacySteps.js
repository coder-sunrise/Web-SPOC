import { Steps } from 'antd'
import moment from 'moment';
import { CheckCircleFilled } from '@ant-design/icons'
import styles from './PharmacyStep.less'

const { Step } = Steps

const showIcon = (status, currentStatus) => {
  if (status <= currentStatus) {
    return <CheckCircleFilled style={{ color: '#33CC33' }} />
  }
  return <div style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#999999' }}></div>
}

export const PharmacySteps = () => (
  <div className='order-steps'>
    <Steps
      className={styles.orderStatus}
      size='small'
      labelPlacement='vertical'
      current={0}
    >
      <Step title='Order' icon={showIcon(1, 1)}
        subTitle='Dr. ttttt'
        description={`${moment().format('hh:mm A, DD MMMM YYYY')}`}
      />
      <Step title='Prepared' icon={showIcon(2, 1)} />
      <Step title='Verified' icon={showIcon(3, 1)} />
      <Step title='Dispensed' icon={showIcon(4, 1)} />
      <Step title='Completed' icon={showIcon(5, 1)} />
    </Steps>
  </div>
)
