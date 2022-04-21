import { Steps } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import { Tooltip, Button, SizeContainer } from '@/components'
import { Divider } from '@material-ui/core'
import Close from '@material-ui/icons/Close'
import styles from './PharmacyStep.less'
const { Step } = Steps

export const JournalHistory = ({ journalHistoryList = [], onClose }) => {
  const orderJournalHistoryList = _.orderBy(
    journalHistoryList,
    ['actionDate'],
    ['desc'],
  )
  return (
    <div style={{ width: 350, padding: '10px' }}>
      <h4 style={{ display: 'inline-block' }}>Journal History</h4>
      <Tooltip title='Close Journal History'>
        <Button
          justIcon
          style={{ float: 'right', right: '-8px', top: 5 }}
          key='close'
          authority='none'
          aria-label='Close'
          color='transparent'
          onClick={onClose}
        >
          <Close />
        </Button>
      </Tooltip>
      <SizeContainer size='sm'>
        <Divider style={{ marginBottom: 8 }} />
        <Steps
          className={styles.journalHistory}
          size='small'
          direction='vertical'
          //current={orderJournalHistoryList.length - 1}
        >
          {orderJournalHistoryList.map(item => {
            return (
              <Step
                status='finish'
                title={
                  <div>
                    <p style={{ fontWeight: 600, lineHeight: '1rem' }}>
                      {`${moment(item.actionDate).format('DD MMM YYYY HH:mm')}`}
                    </p>
                    <p style={{ lineHeight: '1rem' }}>
                      {item.actionDescription}
                    </p>
                    <div
                      style={{ whiteSpace: 'pre-wrap', lineHeight: '1rem' }}
                    >
                      {item.remarks || ''}
                    </div>
                  </div>
                }
                description={`by ${
                  item.actionByUserTitle && item.actionByUserTitle.trim().length
                    ? `${item.actionByUserTitle}. `
                    : ''
                }${item.actionByUserName || ''}`}
                icon={
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      border: '2px solid #2A55FF',
                      margin: 1,
                    }}
                  />
                }
              ></Step>
            )
          })}
        </Steps>
      </SizeContainer>
    </div>
  )
}
