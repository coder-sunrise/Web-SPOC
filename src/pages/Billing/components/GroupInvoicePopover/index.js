import React, { useState } from 'react'
import { useDispatch } from 'dva'
import { history,Link } from 'umi'
// material ui
import { withStyles } from '@material-ui/core'
import CheckCircleSharpIcon from '@material-ui/icons/CheckCircleSharp'
// common components
import {
  GridContainer,
  GridItem,
  Button,
  Tooltip,
  Icon,
  Popover,
  CommonTableGrid,
} from '@/components'
import { getAppendUrl } from '@/utils/utils'

const styles = theme => ({
  billingHyperLink: {
    textDecoration: 'underline',
    fontStyle: 'italic',
    paddingLeft: 0,
    color: 'darkblue',
    cursor: 'pointer',
  },
})

const GroupInvoicesPopover = ({ classes, visitGroup, patientID }) => {
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const [visitGroupStatusDetails, setVisitGroupStatusDetails] = useState([])

  const groupIconButtonClick = () => {
    if (!show) {
      dispatch({
        type: 'groupInvoice/fetchVisitGroupStatusDetails',
        payload: { visitGroup },
      }).then(r => {
        if (r) {
          var filterOutSelf = r.filter(x=> x.patientProfileFK !== patientID)
          // var sorted = _.orderBy(filterOutSelf,['queueNo'],['asc'])
          setVisitGroupStatusDetails(filterOutSelf)
        }
      })
      setShow(true)
    }
  }

  const getVisitBillingUrl = row => {
    const parameters = {
      v: Date.now(),
      vid: row.visitFK,
      pid: row.patientProfileFK,
      qid: row.queueFK,
    }
    return getAppendUrl(parameters, '/reception/queue/billing')
  }

  return (
    <Popover
      icon={null}
      trigger='click'
      placement='top'
      visible={show}
      onVisibleChange={() => setShow(!show)}
      content={
        <div className={classes.popoverContainer} style={{ width: 581 }}>
          <div>
            <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
              Visit Group:
            </span>
            {` ${visitGroup}`}
          </div>
          <div className={classes.listContainer}>
            <CommonTableGrid
              size='sm'
              forceRender
              getRowId={r => r.visitFK}
              rows={visitGroupStatusDetails}
              columns={[
                { name: 'queueNo', title: 'Q. No.' },
                { name: 'name', title: 'Name' },
                { name: 'gender', title: 'Gender' },
                { name: 'age', title: 'Age' },
                { name: 'status', title: 'Status' },
                { name: 'statusIcon', title: ' ', sortingEnabled: false },
              ]}
              columnExtensions={[
                { columnName: 'queueNo', type: 'text', width: 50 },
                { columnName: 'name', type: 'text', width: 200 },
                { columnName: 'gender', type: 'text', width: 90 },
                { columnName: 'age', type: 'text', width: 80 },
                {
                  columnName: 'status',
                  width: 120,
                  render: row => {
                    if (row.status != 'Billing')
                      return (
                        <span style={{ fontStyle: 'italic' }}>
                          {row.status}
                        </span>
                      )
                    return (
                      <span
                        className={classes.billingHyperLink}
                        onClick={() => {
                          dispatch({
                            type: 'global/updateAppState',
                            payload: {
                              openConfirm: true,
                              openConfirmContent: `Confirm to switch to ${row.name}'s billing page ?`,
                              onConfirmSave: () => {
                                history.push(getVisitBillingUrl(row))
                              },
                            },
                          })
                        }}
                      >
                        {row.status}
                      </span>
                    )
                  },
                },
                {
                  columnName: 'statusIcon',
                  width: 40,
                  align: 'center',
                  render: r => (
                    <Tooltip
                      title={
                        r.isBillingSaved ? 'Billing Saved' : 'Billing not Saved'
                      }
                    >
                      <CheckCircleSharpIcon
                        className={
                          r.isBillingSaved ? 'e-success' : 'e-disabled'
                        }
                      />
                    </Tooltip>
                  ),
                },
              ]}
              FuncProps={{
                pager: false,
                sort: true,
                sortConfig: {
                  defaultSorting: [
                    { columnName: 'queueFK', direction: 'asc' },
                  ],
                },
              }}
            />
          </div>
        </div>
      }
    >
      <Button
        justIcon
        title='Visit Group'
        color='transparent'
        onClick={groupIconButtonClick}
      >
        <Icon style={{ fontSize: 20, color: '#cf1322' }} type='family' />
      </Button>
    </Popover>
  )
}

export default withStyles(styles)(GroupInvoicesPopover)
