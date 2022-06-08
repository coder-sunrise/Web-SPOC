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
      key: 'accessionNo',
      width: 100,
      columnId: 'accessionNo',
    },
    {
      title: 'Examination',
      dataIndex: 'itemDescription',
      key: 'itemDescription',
      columnId: 'itemDescription',
      width: 200,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      columnId: 'priority',
      width: 80,
      align: 'center',
    },
    {
      title: 'Instruction',
      dataIndex: 'instruction',
      key: 'instruction',
      columnId: 'instruction',
      width: 200,
      align: 'left',
    },
    {
      title: 'Remarks',
      dataIndex: 'remark',
      key: 'remark',
      columnId: 'remark',
      width: 180,
      align: 'left',
    },
    {
      title: 'Combine',
      key: 'combine',
      columnId: 'isCombine',
      align: 'center',
      width: 60,
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
              setHasChanged(true)
            }}
          />
        )
      },
    },
    {
      title: 'Primary',
      align: 'center',
      columnId: 'isPrimary',
      width: 50,
      render: (text, record, index) => {
        return (
          <Radio
            checked={record.radiologyWorkitemId === primaryId}
            onChange={e => {
              if (e.target.checked) setPrimaryId(record.radiologyWorkitemId)
              setHasChanged(true)
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
  const [primaryId, setPrimaryId] = useState(null)
  const [combinableWorkitems, setCombinableWorkitems] = useState([])
  const [hasChanged, setHasChanged] = useState(false)

  useEffect(() => {
    if (hasChanged) {
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
                return { ...w, primaryWorkitemFK: primaryId }
              }
              return { ...w, primaryWorkitemFK: null }
            })
      setHasChanged(false)
      onChange(newWorkItems)
    }
  }, [hasChanged])

  useEffect(() => {
    if (visitWorkitems) {
      const currentWorkitem = visitWorkitems.find(
        w => w.radiologyWorkitemId === currentWorkitemid,
      )

      if (currentWorkitem.statusFK === RADIOLOGY_WORKITEM_STATUS.NEW) {
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
          currentWorkitem,
          ...tmpConmbinableWorkitems.filter(
            w =>
              w.primaryWorkitemFK &&
              w.radiologyWorkitemId !== currentWorkitemid,
          ),
        ]

        setCombinedItems(combined.map(w => w.radiologyWorkitemId))

        if (combined && combined.length > 1)
          setPrimaryId(
            combined.filter(
              c =>
                c.primaryWorkitemFK !== null &&
                c.primaryWorkitemFK !== undefined,
            )[0].primaryWorkitemFK,
          )
        else setPrimaryId(currentWorkitemid)
      } else {
        const combined = visitWorkitems.filter(
          w => w.primaryWorkitemFK === currentWorkitem.primaryWorkitemFK,
        )

        setCombinedItems(combined.map(w => w.radiologyWorkitemId))
        setCombinableWorkitems(combined)

        if (combined && combined.length > 1)
          setPrimaryId(
            combined.filter(
              c =>
                c.primaryWorkitemFK !== null &&
                c.primaryWorkitemFK !== undefined,
            )[0].primaryWorkitemFK,
          )
        else setPrimaryId(currentWorkitemid)
      }
    }
  }, [visitWorkitems])

  return (
    <Table
      className={styles.myTable}
      bordered
      size='small'
      pagination={false}
      columns={(() => {
        const currentWorkitem = visitWorkitems.find(
          v => v.radiologyWorkitemId === currentWorkitemid,
        )
        if (currentWorkitem.statusFK !== RADIOLOGY_WORKITEM_STATUS.NEW)
          return columns.filter(c => c.columnId !== 'isCombine')
        return columns
      })()}
      dataSource={combinableWorkitems}
    />
  )
}
