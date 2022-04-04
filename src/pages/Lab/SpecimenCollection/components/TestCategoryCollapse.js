import React, { useState, useEffect } from 'react'
import _, { head } from 'lodash'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Space, Collapse, Checkbox, InputNumber, Form } from 'antd'
import { useDispatch } from 'umi'
import { makeStyles } from '@material-ui/styles'
import { useCodeTable } from '@/utils/hooks'
import {
  dateFormatLongWithTimeNoSec,
  DatePicker,
  CommonModal,
  NumberInput,
  GridContainer,
  GridItem,
  Select,
} from '@/components'
import { LAB_WORKITEM_STATUS } from '@/utils/constants'

const { Panel } = Collapse

const TestCategoryPanel = ({
  workItems = [],
  checkedWorkitems = [],
  onAddWorkitem,
  onRemoveWorkitem,
}) => {
  const ctTestPanels = useCodeTable('cttestpanel')

  return (
    <GridContainer>
      {workItems.length > 0 &&
        workItems
          .map(item => ({
            ...item,
            testPanel: ctTestPanels.find(panel => panel.id === item.testPanelFK)
              ?.name,
          }))
          .sort(item => item.workitemFK)
          .map(item => (
            <GridItem md={4} key={item.id}>
              <Checkbox
                disabled={checkedWorkitems.find(
                  cur =>
                    cur.testPanelFK === item.testPanelFK &&
                    cur.id !== item.id &&
                    cur.statusFK === LAB_WORKITEM_STATUS.SPECIMENCOLLECTED,
                )}
                checked={checkedWorkitems.find(
                  cur =>
                    cur.id === item.id &&
                    cur.statusFK === LAB_WORKITEM_STATUS.SPECIMENCOLLECTED,
                )}
                onChange={e =>
                  e.target.checked
                    ? onAddWorkitem(item)
                    : onRemoveWorkitem(item)
                }
              />
              <span> {item.testPanel} </span>
            </GridItem>
          ))}
    </GridContainer>
  )
}

const TestCategoryCollapse = ({
  labSpecimenId,
  defaultActiveKey = [],
  testCategories = [],
  onChange,
  value,
}) => {
  const [checkedItems, setCheckedItems] = useState([])

  useEffect(() => {
    setCheckedItems(value)
  }, [value])

  const handleAdd = newItem => {
    const prev = [...checkedItems]
    const added =
      prev.findIndex(prevItem => prevItem.id === newItem.id) >= 0
        ? prev.map(prevItem =>
            newItem.id === prevItem.id
              ? {
                  ...prevItem,
                  labSpecimenFK: labSpecimenId,
                  statusFK: LAB_WORKITEM_STATUS.SPECIMENCOLLECTED,
                }
              : prevItem,
          )
        : [
            ...prev,
            {
              ...newItem,
              labSpecimenFK: labSpecimenId,
              statusFK: LAB_WORKITEM_STATUS.SPECIMENCOLLECTED,
            },
          ]
    onChange(added)
  }

  const handleRemove = removeItem => {
    const prev = [...checkedItems]

    const removed = prev.map(prevItem =>
      removeItem.id === prevItem.id
        ? {
            ...prevItem,
            labSpecimenFK: undefined,
            statusFK: LAB_WORKITEM_STATUS.NEW,
          }
        : prevItem,
    )
    onChange(removed)
  }

  return (
    <Collapse defaultActiveKey={defaultActiveKey}>
      {testCategories.map(item => (
        <Panel header={item.testCategory} key={item.testCategoryFK}>
          <TestCategoryPanel
            onAddWorkitem={handleAdd}
            onRemoveWorkitem={handleRemove}
            workItems={item.workItems}
            checkedWorkitems={checkedItems}
          />
        </Panel>
      ))}
    </Collapse>
  )
}

export default TestCategoryCollapse
