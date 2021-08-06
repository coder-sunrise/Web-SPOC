import { Steps } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons'
import styles from './ExaminationStep.less'

const { Step } = Steps

export const ExaminationSteps = () => (
  <div className='order-steps'>
    <Steps
      className={styles.orderStatus}
      size='small'
      labelPlacement='vertical'
      current={2}
    >
      <Step title='Order' icon={<CheckCircleFilled />} />

      <Step
        title='Start Process'
        icon={<CheckCircleFilled />}
        subTitle={
          <div>
            <div>Dr. Nikaido Malaya Glian Stacy Neo Jerry White</div>
            <div>23 Apr 2021 10:13 AM</div>
          </div>
        }
      />
      <Step title='Modality Completed' />
      <Step title='Reporting' />
      <Step title='Completed' />
    </Steps>
  </div>
)
