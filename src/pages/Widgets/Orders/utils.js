import { Table } from 'antd'
import moment from 'moment'
import { Divider } from '@material-ui/core'
import Authorized from '@/utils/Authorized'
import { htmlDecodeByRegExp } from '@/utils/utils'
import { tagList } from '@/utils/codes'
import { ORDER_TYPE_TAB } from '@/utils/constants'
import tablestyles from '@/pages/Widgets/PatientHistory/PatientHistoryStyle.less'

const getCautionAlertContent = (removeItems = []) => () => {
  return (
    <div
      style={{
        minHeight: 80,
        display: 'grid',
        alignItems: 'center',
      }}
    >
      <div style={{ margin: 5 }}>
        {removeItems.length > 0 && (
          <div>
            <p>
              <h4
                style={{ fontWeight: 400, textAlign: 'left', marginBottom: 10 }}
              >
                Item(s) will not to be added.
              </h4>
            </p>
            <Table
              size='small'
              bordered
              pagination={false}
              columns={[
                {
                  dataIndex: 'type',
                  title: 'Type',
                  width: 100,
                  render: (_, row) => {
                    return row.type
                  },
                },
                {
                  dataIndex: 'subject',
                  title: 'Name',
                },
              ]}
              dataSource={removeItems}
              rowClassName={(record, index) => {
                return index % 2 === 0 ? tablestyles.once : tablestyles.two
              }}
              className={tablestyles.table}
            />
          </div>
        )}
      </div>
    </div>
  )
}

const openCautionAlertPrompt = (removeItems = [], onClose) => {
  window.g_app._store.dispatch({
    type: 'global/updateAppState',
    payload: {
      openConfirm: true,
      isInformType: true,
      customWidth: 'md',
      openConfirmContent: getCautionAlertContent(removeItems),
      openConfirmText: 'OK',
      onConfirmClose: onClose,
    },
  })
}

const GetOrderItemAccessRight = (from = 'Consultation', accessRight) => {
  let editAccessRight = accessRight
  let strOrderAccessRight = ''
  if (from === 'EditOrder') {
    strOrderAccessRight = 'queue.dispense.editorder'
  } else if (from === 'Consultation') {
    strOrderAccessRight = 'queue.consultation.widgets.order'
  }
  const orderAccessRight = Authorized.check(strOrderAccessRight)
  if (!orderAccessRight || orderAccessRight.rights !== 'enable') {
    editAccessRight = strOrderAccessRight
  }
  return editAccessRight
}

export {
  getCautionAlertContent,
  openCautionAlertPrompt,
  GetOrderItemAccessRight,
}
