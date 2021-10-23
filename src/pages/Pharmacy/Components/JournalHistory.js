import { Steps } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import { pharmacyStatus } from '@/utils/codes'
import { Tooltip } from '@/components'
const { Step } = Steps

export const JournalHistory = ({ statusHistory = [] }) => {
  const orderStatusHistory = _.orderBy(
    statusHistory,
    ['actionDate'],
    ['statusFK'],
    ['desc'],
  ).map(item => {
    return {
      ...item,
      name: pharmacyStatus.find(s => s.statusFK === item.statusFK).name,
    }
  })
  return (
    <div style={{ width: 400, padding: '10px 6px' }}>
      <div style={{ fontSize: '1.2rem', marginBottom: 10 }}>
        Journal History
      </div>
      <Steps
        size='small'
        direction='vertical'
        current={orderStatusHistory.length - 1}
      >
        {orderStatusHistory.map((status, index) => {
          return (
            <Step
              title={<span style={{ fontWeight: 600 }}>{status.name}</span>}
              subTitle={`${
                status.actionByUserTitle &&
                status.actionByUserTitle.trim().length
                  ? `${status.actionByUserTitle}. `
                  : ''
              }${status.actionByUser || ''}`}
              description={
                <div>
                  {`${moment(status.actionDate).format('DD MMM YYYY HH:mm')}`}
                </div>
              }
              icon={
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: '#33CC33',
                    textAlign: 'center',
                    fontSize: '0.7rem',
                    color: 'white',
                  }}
                >
                  {index}
                </div>
              }
            ></Step>
          )
        })}
      </Steps>
    </div>
  )
}
