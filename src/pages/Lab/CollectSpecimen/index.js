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
  CommonModal,
  NumberInput,
  GridContainer,
  GridItem,
  Select,
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
                    ? onAddWorkitem(item.id)
                    : onRemoveWorkitem(item.id)
                }
              />{' '}
              <span>{item.testPanel}</span>
            </GridItem>
          ))}
    </GridContainer>
  )
}

const CollectSpecimen = ({ visitId, onConfirm, onClose }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [workItems, setWorkItems] = useState([])
  const [workItemsByTestCategory, setWorkitemsByTestCategory] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [receivedSpecimen, setReceivedSpecimen] = useState(false)
  const ctTestCategory = useCodeTable('cttestcategory')
  const [form] = Form.useForm()

  function cleanUpStates() {
    setWorkItems([])
    setWorkitemsByTestCategory([])
    setShowModal(false)
    setReceivedSpecimen(false)
    form.resetFields()
  }

  useEffect(() => {
    if (visitId)
      dispatch({
        type: 'collectSpecimen/getVisitLabWorkitems',
        payload: { id: visitId },
      }).then(result => {
        if (result) {
          setWorkItems(result)
          setShowModal(true)
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
      open={showModal}
      title='Collect Specimen'
      onClose={() => {
        onClose && onClose()
        cleanUpStates()
      }}
      onConfirm={() => {
        form.submit()
      }}
      showFooter={true}
      maxWidth='md'
    >
      <Form
        form={form}
        initialValues={{
          specimenCollectionDate: moment(),
          dateReceived: undefined,
          specimenTypeFK: undefined,
          labWorkItemIds: [],
        }}
        onFinish={values => {
          const payload = {
            ...values,
            labWorkitems: workItems.filter(
              w => values.labWorkItemIds.findIndex(id => id === w.id) != -1,
            ),
          }

          dispatch({
            type: 'collectSpecimen/upsertSpecimen',
            payload,
          }).then(result => {
            if (result) {
              onConfirm && onConfirm()
              cleanUpStates()
            }
          })
        }}
      >
        <div>
          <Space align='start' style={{ display: 'flex', marginBottom: 12 }}>
            <Form.Item
              name='specimenTypeFK'
              rules={[{ required: true, message: 'Specimen type is reqired.' }]}
            >
              <Select
                label='Specimen Type'
                style={{ width: 160 }}
                options={[
                  { value: 1, name: 'Pure Blood' },
                  { value: 2, name: 'EDTA Blood' },
                ]}
              ></Select>
            </Form.Item>
            <Form.Item
              name='specimenCollectionDate'
              rules={[
                { required: true, message: 'Collection date is required.' },
              ]}
            >
              <DatePicker
                showTime
                style={{ width: 150 }}
                label='Collection Date'
                format={dateFormatLongWithTimeNoSec}
              />
            </Form.Item>
            <Form.Item name='dateReceived'>
              <DatePicker
                disabled={!receivedSpecimen}
                showTime
                style={{ width: 150 }}
                label='Date Received'
                format={dateFormatLongWithTimeNoSec}
              />
            </Form.Item>
            <Checkbox
              onChange={e => {
                form.setFieldsValue({
                  dateReceived: e.target.checked ? moment() : undefined,
                })
                setReceivedSpecimen(e.target.checked)
              }}
              style={{ marginTop: 30 }}
            >
              Receive Specimen
            </Checkbox>
          </Space>

          {workItemsByTestCategory.length > 0 && (
            <Form.Item name='labWorkItemIds' noStyle>
              <Collapse
                onChange={() => {}}
                defaultActiveKey={workItemsByTestCategory.map(
                  item => item.testCategoryFK,
                )}
              >
                {workItemsByTestCategory.map(item => (
                  <Panel header={item.testCategory} key={item.testCategoryFK}>
                    <TestCategoryPanel
                      onAddWorkitem={labWorkItemId => {
                        const prevWorkitems = form.getFieldValue(
                          'labWorkItemIds',
                        )
                        form.setFieldsValue({
                          labWorkItemIds: [...prevWorkitems, labWorkItemId],
                        })
                      }}
                      onRemoveWorkitem={labWorkItemId => {
                        const prevWorkitems = form.getFieldValue(
                          'labWorkItemIds',
                        )
                        form.setFieldsValue({
                          labWorkItemIds: [
                            ...prevWorkitems.filter(id => id !== labWorkItemId),
                          ],
                        })
                      }}
                      workItems={item.workItems}
                    />
                  </Panel>
                ))}
              </Collapse>
            </Form.Item>
          )}
        </div>
        <div
          style={{
            margin: '10px 0px',
            display: 'flex',
            alignItems: 'start',
            justifyContent: 'end',
          }}
        >
          <Checkbox>Print Label</Checkbox>
          <InputNumber
            size='small'
            min={1}
            max={10}
            style={{ width: '50px', textAlign: 'right' }}
          />
        </div>
      </Form>
    </CommonModal>
  )
}

export default CollectSpecimen
