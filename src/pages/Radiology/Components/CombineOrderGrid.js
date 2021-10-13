import React, { useEffect, useState, useContext } from 'react'
import { Typography, Input, Table, Radio, Checkbox } from 'antd'
import { RADIOLOGY_WORKITEM_STATUS } from '@/utils/constants'
import styles from './CombineOrderGrid.less'

export const CombineOrderGrid = ({
  visitWorkitems = [],
  currentWorkitemid,
  onChange,
  readonly,
}) => {
  const columns = [
    {
      title: 'Accession No.',
      dataIndex: 'accessionNo',
      key: 'name',
      width: 100,
    },
    {
      title: 'Examination',
      dataIndex: 'itemDescription',
      key: 'itemDescription',
      width: 200,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      align: 'center',
    },
    {
      title: 'Instruction',
      dataIndex: 'instruction',
      key: 'instruction',
      width: 200,
      align: 'center',
    },
    {
      title: 'Remarks',
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
      align: 'center',
    },
    {
      title: 'Combine',
      dataIndex: 'itemDescription',
      key: 'itemDescription',
      align: 'center',
      width: 40,
      render: (text, record, index) => {
        if (
          record.radiologyWorkitemId === currentWorkitemid ||
          record.radiologyWorkitemId === primaryId
        )
          return <Checkbox checked={true} disabled={true} />

        return (
          <Checkbox
            checked={combinedItems.includes(record.radiologyWorkitemId)}
            onChange={e => {
              const radiologyWorkitemId = record.radiologyWorkitemId
              if (
                e.target.checked &&
                !combinedItems.includes(radiologyWorkitemId)
              ) {
                setCombinedItems([...combinedItems, radiologyWorkitemId])
              }

              if (
                !e.target.checked &&
                combinedItems.includes(radiologyWorkitemId)
              ) {
                setCombinedItems(
                  combinedItems.filter(i => i !== radiologyWorkitemId),
                )
              }
            }}
          />
        )
      },
    },
    {
      title: 'Primary',
      dataIndex: 'itemDescription',
      key: 'itemDescription',
      align: 'center',
      width: 40,
      render: (text, record, index) => {
        return (
          <Radio
            checked={record.radiologyWorkitemId === primaryId}
            onChange={e => {
              if (e.target.checked) setPrimaryId(record.radiologyWorkitemId)
            }}
            disabled={
              readonly
                ? true
                : !combinedItems.includes(record.radiologyWorkitemId) &&
                  record.radiologyWorkitemId !== currentWorkitemid
            }
          />
        )
      },
    },
  ]

  const [combinedItems, setCombinedItems] = useState([])
  const [primaryId, setPrimaryId] = useState()
  const [combinableWorkitems, setCombinableWorkitems] = useState([])

  useEffect(() => {
    const newWorkItems =
      combinedItems.length === 1
        ? visitWorkitems.map(w => {
            if (
              combinableWorkitems.findIndex(
                item => item.radiologyWorkitemId === w.radiologyWorkitemId,
              ) === -1
            ) {
              return w
            }
            return { ...w, primaryWorkitemFK: null }
          })
        : visitWorkitems.map(w => {
            if (
              combinableWorkitems.findIndex(
                item => item.radiologyWorkitemId === w.radiologyWorkitemId,
              ) === -1
            ) {
              return w
            }

            if (combinedItems.includes(w.radiologyWorkitemId)) {
              console.log(w.radiologyWorkitemId)
              return { ...w, primaryWorkitemFK: primaryId }
            }
            return { ...w, primaryWorkitemFK: null }
          })

    onChange(newWorkItems)

    //Check if only current work item is in the combinedItems
  }, [combinedItems, primaryId])

  useEffect(() => {
    if (visitWorkitems) {
      const tmpConmbinableWorkitems = visitWorkitems.filter(
        w =>
          w.statusFK === RADIOLOGY_WORKITEM_STATUS.NEW &&
          (!w.primaryWorkitemFK ||
            w.primaryWorkitemFK ===
              visitWorkitems.find(
                w => w.radiologyWorkitemId === currentWorkitemid,
              ).primaryWorkitemFK),
      )
      setCombinableWorkitems(tmpConmbinableWorkitems)

      //Prepare combined list, always include the current workitem.
      //If only current workitem is in the combinedItems, it will consider as - not combined
      const combined = [
        ...visitWorkitems.filter(
          w => w.radiologyWorkitemId === currentWorkitemid,
        ),
        ...tmpConmbinableWorkitems.filter(
          w =>
            w.primaryWorkitemFK && w.radiologyWorkitemId !== currentWorkitemid,
        ),
      ]

      setCombinedItems(combined.map(w => w.radiologyWorkitemId))

      if (combined && combined.length > 1)
        setPrimaryId(
          combined.filter(
            c =>
              c.primaryWorkitemFK !== null && c.primaryWorkitemFK !== undefined,
          )[0].primaryWorkitemFK,
        )
      else setPrimaryId(currentWorkitemid)
    }
  }, [visitWorkitems])

  return (
    <Table
      className={styles.myTable}
      bordered
      size='small'
      pagination={false}
      columns={columns}
      dataSource={combinableWorkitems.sort((a, b) => a.remark > b.remark)}
    />
  )
}