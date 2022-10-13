import { useEffect, useState } from 'react'
import ListAlt from '@material-ui/icons/ListAlt'
import { Button, Popover } from '@/components'
import { ORDER_TYPES } from '@/utils/constants'
import { Tooltip } from '@/components'
import { withStyles } from '@material-ui/core'
import { Tag } from 'antd'
import { hasValue } from '../PatientHistory/config'
const styles = theme => ({
  tag: {
    cursor: 'pointer',
    border: `1px solid lightGreen`,
    maxWidth: 145,
    margin: '1px 8px 1px 0px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: '2px 6px',
    fontSize: 14,
    display: 'inline-block',
  },
  mainPanel: {
    width: 600,
    maxHeight: 700,
    overflow: 'auto',
  },
})
const OrderText = ({ orders, classes, onSelectItem }) => {
  const [orderList, setOrderList] = useState([])
  const getOrderList = () => {
    let newOrderList = []
    const activeRows = (orders.rows || []).filter(row => !row.isDeleted)
    const service = activeRows.filter(row => row.type === ORDER_TYPES.SERVICE)
    if (consumable.length) {
      newOrderList.push({
        type: 'Consumable',
        items: consumable.map(row => row.subject),
      })
    }

    if (service.length) {
      newOrderList.push({
        type: 'Service',
        items: service.map(row =>
          hasValue(row.newServiceName) && row.newServiceName.trim() !== ''
            ? row.newServiceName
            : row.subject,
        ),
      })
    }
 
    setOrderList(newOrderList)
  }
  return (
    <Popover
      icon={null}
      trigger='click'
      placement='right'
      title={
        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
          Ordered Items
        </div>
      }
      content={
        <div>
          <div className={classes.mainPanel}>
            {orderList.map(o => {
              return (
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                    {o.type}
                  </div>
                  <div>
                    {o.items.map(x => (
                      <Tooltip title={x}>
                        <Tag
                          className={classes.tag}
                          onClick={e => {
                            onSelectItem(x)
                          }}
                        >
                          {x}
                        </Tag>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 6 }}>
            Note: Click item to insert into remarks.
          </div>
        </div>
      }
    >
      <Button size='sm' justIcon color='transparent' onClick={getOrderList}>
        <ListAlt />
      </Button>
    </Popover>
  )
}
export default withStyles(styles, { name: 'OrderText' })(OrderText)
