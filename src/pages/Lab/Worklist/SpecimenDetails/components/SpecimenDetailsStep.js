import { Steps } from 'antd'
import moment from 'moment'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { LAB_SPECIMEN_DETAILS_STEP } from '@/utils/constants'
import { examinationSteps } from '@/utils/codes'
import { dateFormatLongWithTimeNoSec } from '@/components'
import styles from './SpecimenDetailsStep.less'

const { Step } = Steps

const showIcon = (statusFK, currentStatusFK) => {
  if (
    currentStatusFK === LAB_SPECIMEN_DETAILS_STEP.CANCELLED &&
    statusFK === currentStatusFK
  ) {
    return <CloseCircleFilled style={{ color: '#999999' }} />
  }

  if (
    currentStatusFK === LAB_SPECIMEN_DETAILS_STEP.COMPLETED ||
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

const getStep = status => {
  return (
    <Step
      title={<span style={{ fontWeight: 500 }}>{status.name}</span>}
      icon={
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#33CC33',
          }}
        ></div>
      }
      subTitle={''}
      description={''}
    />
  )
}

console.log('lab-module logs: examinationSteps', examinationSteps)

export const SpecimenDetailsStep = ({ item }) => {
  return (
    <div>
      <Steps
        className={styles.specimenDetailsStep}
        size='small'
        labelPlacement='vertical'
      >
        {examinationSteps &&
          examinationSteps.map(status => {
            return getStep(status)
          })}
      </Steps>
    </div>
  )
}
