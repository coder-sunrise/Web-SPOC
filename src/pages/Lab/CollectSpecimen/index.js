import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import moment from 'moment'
import { Space, Collapse, Checkbox, InputNumber, Form } from 'antd'
import { useDispatch } from 'umi'
import { makeStyles } from '@material-ui/styles'
import { useCodeTable } from '@/utils/hooks'
import {
  dateFormatLongWithTimeNoSec,
  DatePicker,
  Select,
  CommonModal,
  NumberInput,
  GridContainer,
  GridItem,
} from '@/components'

const { Panel } = Collapse

const useStyles = makeStyles(theme => ({
  modalBody: {
    '&:first-child': {
      paddingTop: '0',
    },
  },
}))

const TestCategoryPanel = ({
  workItems = [],
  onAddWorkitem,
  onRemoveWorkitem,
}) => {
  const ctTestPanels = useCodeTable('cttestpanel')

  console.log('lab-module logs: ', workItems)

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
            <GridItem md={4}>
              <Checkbox
                defaultChecked={false}
                onChange={e =>
                  e.target.checked
                    ? onAddWorkitem(item.workitemFK)
                    : onRemoveWorkitem(item.workitemFK)
                }
              />{' '}
              <span>{item.testPanel}</span>
            </GridItem>
          ))}
    </GridContainer>
  )
}

const CollectSpecimen = ({ visitId, onClose }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [workItems, setWorkItems] = useState([])
  const [workItemsByTestCategory, setWorkitemsByTestCategory] = useState([])
  const ctTestCategory = useCodeTable('cttestcategory')
  const [form] = Form.useForm()

  function cleanUpStates() {
    setWorkItems([])
    setWorkitemsByTestCategory([])
  }

  useEffect(() => {
    if (visitId)
      dispatch({
        type: 'collectSpecimen/getVisitLabWorkitems',
        payload: { id: visitId },
      }).then(result => {
        if (result) {
          setWorkItems(result)
        }
      })
    else {
      cleanUpStates()
    }
  }, [visitId])

  useEffect(() => {
    if (workItems && workItems.length > 0)
      setWorkitemsByTestCategory(
        _.uniqBy(
          workItems.map(item => ({
            testCategoryFK: item.testCategoryFK,
            testCategory: ctTestCategory.find(c => c.id === item.testCategoryFK)
              .name,
            workItems: workItems.filter(
              w => w.testCategoryFK === item.testCategoryFK,
            ),
          })),
          'testCategoryFK',
        ),
      )
  }, [workItems])

  return (
    <CommonModal
      classes={classes}
      open={visitId && visitId > 0}
      title='Collect Specimen'
      onClose={onClose}
      onConfirm={() => {
        console.log('lab-module logs', form.getFieldsValue(true))
      }}
      showFooter={true}
      maxWidth='sm'
    >
      <Form
        form={form}
        initialValues={{
          collectionDate: moment.now(),
          specimenType: undefined,
          workItems: [],
        }}
      >
        <div style={{ minHeight: 400 }}>
          <Space style={{ display: 'flex', marginBottom: 12 }}>
            <Form.Item name='collectionDate' noStyle>
              <DatePicker
                showTime
                style={{ width: 150 }}
                label='Collection Date'
                format={dateFormatLongWithTimeNoSec}
              />
            </Form.Item>
            <Form.Item name='specimenType' noStyle>
              <Select
                label='Specimen Type'
                style={{ width: 160 }}
                options={[
                  { value: 1, name: 'Pure Blood' },
                  { value: 2, name: 'EDTA Blood' },
                ]}
              ></Select>
            </Form.Item>
          </Space>
          {workItemsByTestCategory.length > 0 && (
            <Form.Item name='workitems' noStyle>
              <Collapse
                onChange={() => {}}
                defaultActiveKey={workItemsByTestCategory.map(
                  item => item.testCategoryFK,
                )}
              >
                {workItemsByTestCategory.map(item => (
                  <Panel header={item.testCategory} key={item.testCategoryFK}>
                    <TestCategoryPanel
                      onAddWorkitem={workItemFK => {
                        const prevWorkitems = form.getFieldValue('workItems')
                        form.setFieldsValue({
                          workItems: [...prevWorkitems, workItemFK],
                        })
                        console.log(
                          'lab-module logs: added workitem',
                          workItemFK,
                        )
                      }}
                      onRemoveWorkitem={workitemFK =>
                        console.log(
                          'lab-module logs: removed workitem',
                          workitemFK,
                        )
                      }
                      workItems={item.workItems}
                    />
                  </Panel>
                ))}
              </Collapse>
            </Form.Item>
          )}
        </div>
      </Form>
    </CommonModal>
  )
}

export default CollectSpecimen
