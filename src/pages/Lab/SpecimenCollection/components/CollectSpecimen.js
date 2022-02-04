import React, { useState, useEffect } from 'react'
import _ from 'lodash'
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

const useStyles = makeStyles(theme => ({
  modalBody: {
    '&:first-child': {
      paddingTop: '0',
    },
  },
}))

const TestCategoryPanel = ({
  workItems = [],
  curSpecimenLabWorkitems = [],
  onAddWorkitem,
  onRemoveWorkitem,
}) => {
  const ctTestPanels = useCodeTable('cttestpanel')

  console.log('TestCategoryPanel', curSpecimenLabWorkitems, workItems)
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
                checked={
                  curSpecimenLabWorkitems.find(
                    cur => cur.labWorkitemFK === item.id,
                  )?.isDeleted === false
                }
                onChange={e =>
                  e.target.checked
                    ? onAddWorkitem(item)
                    : onRemoveWorkitem(item)
                }
              />
              <span>{item.testPanel}</span>
            </GridItem>
          ))}
    </GridContainer>
  )
}

const MODE = { NEW: 'new', EDIT: 'edit' }

const CollectSpecimen = ({
  open,
  visitId,
  labSpecimenId,
  mode,
  onConfirm,
  onClose,
}) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [labWorkitems, setLabWorkitems] = useState([])
  const [workItemsByTestCategory, setWorkitemsByTestCategory] = useState([])
  const [curSelectedItems, setCurSelectedItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [receivedSpecimen, setReceivedSpecimen] = useState(false)
  const ctTestCategory = useCodeTable('cttestcategory')
  const [form] = Form.useForm()

  function cleanUpStates() {
    setCurSelectedItems([])
    setLabWorkitems([])
    setWorkitemsByTestCategory([])
    setShowModal(false)
    setReceivedSpecimen(false)
    form.resetFields()
  }

  useEffect(() => {
    setShowModal(open)

    if (open) {
      dispatch({
        type: 'specimenCollection/getVisitSpecimenCollection',
        payload: { id: visitId },
      }).then(visitData => {
        if (visitData) {
          if (mode === MODE.NEW) {
            setLabWorkitems(
              visitData.labWorkitems.filter(
                item => item.statusFK === LAB_WORKITEM_STATUS.NEW,
              ),
            )
            form.setFieldsValue({
              specimenCollectionDate: moment(),
              dateReceived: undefined,
              specimenTypeFK: undefined,
              labSpecimenWorkitems: [],
            })
          } else {
            dispatch({
              type: 'specimenCollection/getLabSpecimenById',
              payload: { id: labSpecimenId },
            }).then(labSpecimenData => {
              if (labSpecimenData) {
                const curSpecimenLabWorkitemsTemp = labSpecimenData.labSpecimenWorkitems.map(
                  item => item.labWorkitem,
                )
                setLabWorkitems([
                  ...visitData.labWorkitems.filter(
                    item => item.statusFK === LAB_WORKITEM_STATUS.NEW,
                  ),
                  ...curSpecimenLabWorkitemsTemp,
                ])
                form.setFieldsValue(labSpecimenData)
                setCurSelectedItems(labSpecimenData.labSpecimenWorkitems)
              }
            })
          }
        }
      })
    } else {
      cleanUpStates()
    }
  }, [open])

  useEffect(() => {
    setWorkitemsByTestCategory(
      _(
        labWorkitems.map(item => ({
          testCategoryFK: item.testCategoryFK,
          testCategory: ctTestCategory.find(c => c.id === item.testCategoryFK)
            .name,
          workItems: _.sortBy(
            labWorkitems.filter(w => w.testCategoryFK === item.testCategoryFK),
            'id',
          ),
        })),
      )
        .uniqBy('testCategoryFK')
        .sortBy('testCategory')
        .value(),
    )
  }, [labWorkitems])

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
        onFinish={() => {
          var values = form.getFieldsValue(true)
          const payload = {
            id: mode === MODE.EDIT ? labSpecimenId : undefined,
            ...values,
          }

          dispatch({
            type: 'specimenCollection/upsert',
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
                options={[{ value: 1, name: 'EDTA' }]}
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
            <Form.Item name='labSpecimenWorkitems' noStyle>
              <Collapse
                onChange={() => {}}
                defaultActiveKey={workItemsByTestCategory.map(
                  item => item.testCategoryFK,
                )}
              >
                {workItemsByTestCategory.map(item => (
                  <Panel header={item.testCategory} key={item.testCategoryFK}>
                    <TestCategoryPanel
                      onAddWorkitem={newItem => {
                        const prev = form.getFieldValue('labSpecimenWorkitems')

                        const added =
                          prev.findIndex(
                            prevItem => prevItem.labWorkitemFK === newItem.id,
                          ) >= 0
                            ? prev.map(prevItem =>
                                newItem.id === prevItem.labWorkitemFK
                                  ? {
                                      ...prevItem,
                                      labWorkitem: {
                                        ...prevItem.labWorkitem,
                                        statusFK:
                                          LAB_WORKITEM_STATUS.SPECIMENCOLLECTED,
                                      },
                                      isDeleted: false,
                                    }
                                  : prevItem,
                              )
                            : [
                                ...prev,
                                {
                                  labWorkitemFK: newItem.id,
                                  labSpecimenFK: labSpecimenId,
                                  labWorkitem: {
                                    ...newItem,
                                    statusFK:
                                      LAB_WORKITEM_STATUS.SPECIMENCOLLECTED,
                                  },
                                  isDeleted: false,
                                },
                              ]

                        form.setFieldsValue({ labSpecimenWorkitems: added })
                        setCurSelectedItems(added)
                      }}
                      onRemoveWorkitem={removeItem => {
                        const prev = form.getFieldValue('labSpecimenWorkitems')
                        const removed = prev.map(prevItem =>
                          removeItem.id === prevItem.labWorkitemFK
                            ? {
                                ...prevItem,
                                labWorkitem: {
                                  ...prevItem.labWorkitem,
                                  statusFK: LAB_WORKITEM_STATUS.NEW,
                                },
                                isDeleted: true,
                              }
                            : prevItem,
                        )

                        form.setFieldsValue({ labSpecimenWorkitems: removed })
                        setCurSelectedItems(removed)
                      }}
                      workItems={item.workItems}
                      curSpecimenLabWorkitems={curSelectedItems}
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
            justifyContent: 'start',
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

CollectSpecimen.propTypes = {
  id: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['new', 'edit']).isRequired,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
}

export default CollectSpecimen
