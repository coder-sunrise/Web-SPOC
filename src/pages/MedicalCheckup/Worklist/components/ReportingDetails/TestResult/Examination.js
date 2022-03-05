import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import {
  Tabs,
  Switch,
  Tooltip,
  IconButton,
  GridContainer,
  GridItem,
  dateFormatLong,
} from '@/components'
import moment from 'moment'
import { Table, Button, Popover } from 'antd'
import { useDispatch } from 'dva'
import { DeleteFilled, EditFilled, CopyOutlined } from '@ant-design/icons'
import { getUniqueId, navigateDirtyCheck } from '@/utils/utils'
import { EXAMINATION_STATUS } from '@/utils/constants'
import customtyles from '../../Style.less'
import IndividualCommentDetails from './IndividualCommentDetails'

const getStatusIcon = status => {
  if (!status) return ''

  if (status === EXAMINATION_STATUS.NEW) {
    return (
      <Tooltip title='New'>
        <div
          style={{
            borderRadius: 8,
            height: 16,
            width: 16,
            border: '2px solid #4876FF',
          }}
        ></div>
      </Tooltip>
    )
  }

  return (
    <Tooltip title={status}>
      <div
        style={{
          borderRadius: 8,
          height: 16,
          width: 16,
          backgroundColor:
            status === EXAMINATION_STATUS.INPROGRESS ? '#1890FF' : '#009900',
        }}
      ></div>
    </Tooltip>
  )
}

const Examination = props => {
  const {
    selectedLanguage,
    height,
    medicalCheckupReportingDetails,
    ctexaminationcategory,
    ctexaminationitem,
    ctindividualcomment,
    queryIndividualCommentHistory,
    refreshMedicalCheckup,
    isEditEnable = true,
  } = props
  const [selectExaminationItemId, setSelectExaminationItemId] = useState(
    undefined,
  )
  const [commentGroupList, setCommentGroupList] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [columns, setColumns] = useState([])
  const dispatch = useDispatch()
  useEffect(() => {
    if (
      medicalCheckupReportingDetails.patientID &&
      medicalCheckupReportingDetails.visitID
    ) {
      queryIndividualCommentHistory()
    }
  }, [
    medicalCheckupReportingDetails.visitID,
    medicalCheckupReportingDetails.patientID,
  ])
  useEffect(() => {
    setDataSource([
      ...dataSource.map(item => ({
        ...item,
        selectedLanguage,
      })),
    ])
  }, [selectedLanguage])

  useEffect(() => {
    setDataSource([
      ...dataSource.map(item => ({
        ...item,
        isSelected:
          selectExaminationItemId &&
          !item.isGroup &&
          item.id === selectExaminationItemId,
      })),
    ])
  }, [selectExaminationItemId])

  useEffect(() => {
    setData(medicalCheckupReportingDetails.individualCommentList)
    setCommentGroupList([])
    setSelectExaminationItemId(undefined)
  }, [medicalCheckupReportingDetails.individualCommentList, isEditEnable])

  useEffect(() => {
    if (!medicalCheckupReportingDetails.individualCommentEntity) {
      setCommentGroupList([])
      setSelectExaminationItemId(undefined)
    }
  }, [medicalCheckupReportingDetails.individualCommentEntity])

  const renderExaminationType = row => {
    return (
      <div style={{ position: 'relative' }}>
        <div
          style={{
            padding: row.isGroup ? 4 : '4px 24px 4px 10px',
          }}
        >
          {row.examinationType}
        </div>
        <div style={{ position: 'absolute', right: 4, top: 6 }}>
          {getStatusIcon(row.status)}
        </div>
      </div>
    )
  }

  const renderExaminationItems = examinationItemService => {
    return (
      <div style={{ width: 300 }}>
        <Table
          size='small'
          bordered
          pagination={false}
          dataSource={examinationItemService}
          columns={[
            {
              dataIndex: 'serviceName',
              title: <div style={{ padding: 4 }}>Examination</div>,
              render: (text, row) => {
                return <div style={{ padding: 4 }}>{text}</div>
              },
            },
            {
              dataIndex: 'status',
              title: <div style={{ padding: 4 }}>Status</div>,
              width: 100,
              render: (text, row) => {
                return (
                  <div
                    style={{
                      padding: 4,
                      color:
                        row.status === EXAMINATION_STATUS.COMPLETED
                          ? '#009900'
                          : 'black',
                    }}
                  >
                    {text}
                  </div>
                )
              },
            },
          ]}
          scroll={{ y: 600 }}
          rowClassName={(record, index) => {
            return index % 2 === 0 ? customtyles.once : customtyles.two
          }}
          className={customtyles.table}
        ></Table>
      </div>
    )
  }

  const setData = individualComment => {
    const { classes } = props
    const defaultData = getDataSource()
    const data = _.orderBy(individualComment, ['visitDate'], ['desc'])
    let newData = defaultData.map(row => {
      let insertComment = {}
      data.forEach((item, index) => {
        let commentList = []
        if (!row.isGroup) {
          commentList = (item.medicalCheckupIndividualComment || []).filter(
            c => c.examinationItemFK === row.id,
          )
        }
        insertComment = {
          ...insertComment,
          [`valueColumn${index + 1}`]: commentList,
        }
      })
      return { ...row, ...insertComment }
    })
    setDataSource(newData)

    let defaultColumns = [
      {
        dataIndex: 'examinationType',
        title: <div style={{ padding: 4 }}>Examination</div>,
        fixed: 'left',
        width: 120,
        render: (text, row) => {
          return row.isGroup || !row.examinationItemService.length ? (
            renderExaminationType(row)
          ) : (
            <Popover
              placement='right'
              content={renderExaminationItems(row.examinationItemService)}
            >
              {renderExaminationType(row)}
            </Popover>
          )
        },
        onCell: row => ({
          style: {
            backgroundColor: row.isSelected
              ? '#CCCCCC'
              : row.isGroup
              ? '#daecf5'
              : 'white',
            cursor:
              !isEditEnable ||
              row.isGroup ||
              row.status !== EXAMINATION_STATUS.COMPLETED
                ? 'default'
                : 'pointer',
          },
        }),
      },
    ]

    data.forEach((item, index) => {
      defaultColumns.push({
        dataIndex: `valueColumn${index + 1}`,
        title: (
          <div style={{ padding: 4 }}>
            {index === 0
              ? 'Current'
              : moment(data.visitDate).format(dateFormatLong)}
          </div>
        ),
        width: 200,
        render: (text, row) => {
          return (
            <div
              style={{
                padding: 4,
              }}
            >
              {row[`valueColumn${index + 1}`].map(item => {
                const showValue =
                  item[
                    `${
                      row.selectedLanguage === 'EN'
                        ? 'englishComment'
                        : 'japaneseComment'
                    }`
                  ]
                return (
                  <div
                    style={{ position: 'relative' }}
                    className={classes.commentContainer}
                  >
                    <Tooltip title={showValue}>
                      <div>{showValue}</div>
                    </Tooltip>
                    <div
                      style={{ position: 'absolute', right: '-4px', top: 0 }}
                    >
                      {isEditEnable && index !== 0 ? (
                        <Tooltip title='Copy Comment'>
                          <IconButton
                            size='small'
                            color='primary'
                            onClick={() => {
                              copyComment(item.id)
                            }}
                          >
                            <CopyOutlined />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        },
        onCell: row => ({
          style: {
            backgroundColor: row.isSelected
              ? '#CCCCCC'
              : row.isGroup
              ? '#daecf5'
              : 'white',
            cursor:
              !isEditEnable ||
              row.isGroup ||
              row.status !== EXAMINATION_STATUS.COMPLETED
                ? 'default'
                : 'pointer',
          },
        }),
      })
    })

    defaultColumns.push({
      dataIndex: 'action',
      title: '',
      width: '100%',
      onCell: row => ({
        style: {
          backgroundColor: row.isSelected
            ? '#CCCCCC'
            : row.isGroup
            ? '#daecf5'
            : 'white',
          cursor:
            !isEditEnable ||
            row.isGroup ||
            row.status !== EXAMINATION_STATUS.COMPLETED
              ? 'default'
              : 'pointer',
        },
      }),
    })
    setColumns(defaultColumns)
  }

  const getDataSource = () => {
    let defaultData = []
    const { examinationItem = [] } = medicalCheckupReportingDetails.entity
    ctexaminationcategory.forEach(category => {
      defaultData.push({
        id: category.id,
        examinationType: category.name,
        isGroup: true,
        selectedLanguage,
      })
      const examinationitems = examinationItem.filter(
        item => item.examinationCategoryFK === category.id,
      )
      defaultData = defaultData.concat(
        examinationitems.map(item => ({
          id: item.id,
          examinationType: item.displayValue,
          isGroup: false,
          selectedLanguage,
          isSelected:
            selectExaminationItemId && item.id === selectExaminationItemId,
          status: item.status,
          examinationItemService: item.examinationItemService,
        })),
      )
    })
    return defaultData
  }

  const getCTIndividualComment = async () => {
    if (ctIndividualComment.length) return ctIndividualComment
    else {
      const response = await ctIndividualCommentService.queryList({
        pagesize: 9999,
      })
      if (response && response.status === '200') {
        setCTIndividualComment(response.data.data)
        return response.data.data
      } else {
        setCTIndividualComment([])
        return []
      }
    }
  }

  const selectExamination = async row => {
    const filterComment = ctindividualcomment.filter(
      x => x.examinationItemFK === row.id,
    )
    const groupList = _.uniqBy(filterComment, 'groupNo').map(
      group => group.groupNo,
    )

    for (let index = 1; index <= 6; index++) {
      if (groupList.indexOf(index) < 0) {
        groupList.push(index)
      }
    }
    setCommentGroupList(
      _.orderBy(
        groupList.map(group => ({
          groupNo: group,
          list: filterComment.filter(item => item.groupNo === group),
        })),
      ),
      ['groupNo'],
      ['asc'],
    )
    dispatch({
      type: 'medicalCheckupReportingDetails/updateState',
      payload: {
        individualCommentEntity: {
          selectExaminationItemId: row.id,
          medicalCheckupIndividualComment: [
            ...medicalCheckupReportingDetails.entity.medicalCheckupIndividualComment
              .filter(c => c.examinationItemFK === row.id)
              .map(c => ({ ...c, uid: getUniqueId() })),
          ],
        },
      },
    })
    setSelectExaminationItemId(row.id)
  }

  const onSaveComment = () => {
    queryIndividualCommentHistory()
    refreshMedicalCheckup()
    clearEditComment()
  }

  const clearEditComment = () => {
    dispatch({
      type: 'medicalCheckupReportingDetails/updateState',
      payload: {
        individualCommentEntity: undefined,
      },
    })
    dispatch({
      type: 'medicalCheckupReportingDetails/updateState',
      payload: {
        individualCommentEntity: undefined,
      },
    })
  }

  const copyComment = id => {
    dispatch({
      type: 'medicalCheckupReportingDetails/copyComment',
      payload: {
        medicalCheckupWorkitemFK: medicalCheckupReportingDetails.entity.id,
        sourceCommentFK: id,
        commentType: 'Individual',
      },
    }).then(r => {
      queryIndividualCommentHistory()
      refreshMedicalCheckup()
    })
  }

  return (
    <div
      style={{
        position: 'relative',
        paddingRight: selectExaminationItemId ? 610 : 0,
        height: height - 48,
        border: '1px solid #CCCCCC',
      }}
    >
      <GridContainer>
        <GridItem md={12} style={{ padding: 0 }}>
          <Table
            size='small'
            bordered
            pagination={false}
            dataSource={dataSource}
            columns={columns}
            scroll={{ y: height - 90 }}
            onRow={(record, rowIndex) => {
              return {
                onClick: event => {
                  if (
                    !isEditEnable ||
                    record.isGroup ||
                    record.status !== EXAMINATION_STATUS.COMPLETED
                  )
                    return
                  navigateDirtyCheck({
                    displayName: 'IndividualCommentDetails',
                    onProceed: () => {
                      selectExamination(record)
                    },
                    onConfirm: () => {
                      selectExamination(record)
                    },
                  })(event)
                }, // click row
              }
            }}
            className={customtyles.table}
          ></Table>
        </GridItem>
      </GridContainer>
      {selectExaminationItemId && (
        <div style={{ position: 'absolute', right: 0, top: 0 }}>
          <IndividualCommentDetails
            {...props}
            commentGroupList={commentGroupList}
            saveComment={onSaveComment}
            clearEditComment={clearEditComment}
          />
        </div>
      )}
    </div>
  )
}
export default Examination
