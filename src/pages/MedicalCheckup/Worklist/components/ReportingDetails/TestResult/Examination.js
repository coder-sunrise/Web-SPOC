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
import { Table, Button } from 'antd'
import { useDispatch } from 'dva'
import { DeleteFilled, EditFilled, CopyOutlined } from '@ant-design/icons'
import { getUniqueId } from '@/utils/utils'
import customtyles from '../../Style.less'
import IndividualCommentDetails from './IndividualCommentDetails'

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
  } = props
  const [selectRow, setSelectRow] = useState(undefined)
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
        isSelected: selectRow && !item.isGroup && item.id === selectRow,
      })),
    ])
  }, [selectRow])

  useEffect(() => {
    setData(medicalCheckupReportingDetails.individualCommentList)
  }, [medicalCheckupReportingDetails.individualCommentList])
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
          return (
            <div
              style={{
                padding: row.isGroup ? 4 : '4px 4px 4px 10px',
              }}
            >
              {text}
            </div>
          )
        },
        onCell: row => ({
          style: { backgroundColor: row.isSelected ? '#CCCCCC' : 'white' },
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
                      <div
                        style={{
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {showValue}
                      </div>
                    </Tooltip>
                    <div
                      style={{ position: 'absolute', right: '-4px', top: 0 }}
                    >
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
                    </div>
                  </div>
                )
              })}
            </div>
          )
        },
        onCell: row => ({
          style: { backgroundColor: row.isSelected ? '#CCCCCC' : 'white' },
        }),
      })
    })

    defaultColumns.push({
      dataIndex: 'action',
      title: '',
      width: '100%',
      onCell: row => ({
        style: { backgroundColor: row.isSelected ? '#CCCCCC' : 'white' },
      }),
    })
    setColumns(defaultColumns)
  }
  const getDataSource = () => {
    let defaultData = []
    ctexaminationcategory.forEach(category => {
      defaultData.push({
        id: category.id,
        examinationType: category.name,
        isGroup: true,
        selectedLanguage,
      })
      const examinationitems = ctexaminationitem.filter(
        item => item.examinationCategoryFK === category.id,
      )
      defaultData = defaultData.concat(
        examinationitems.map(item => ({
          id: item.id,
          examinationType: item.displayValue,
          isGroup: false,
          selectedLanguage,
          isSelected: selectRow && item.id === selectRow,
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
    setSelectRow(row.id)
  }

  const onSaveComment = () => {
    queryIndividualCommentHistory()
    refreshMedicalCheckup()

    setCommentGroupList([])
    dispatch({
      type: 'medicalCheckupReportingDetails/updateState',
      payload: {
        individualCommentEntity: undefined,
      },
    })
    setSelectRow(undefined)
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
        paddingRight: selectRow
          ? commentGroupList.length
            ? commentGroupList.length * 100
            : 400
          : 0,
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
            rowClassName={(record, index) => {
              //if (!record.isGroup && record.id === selectRow)
              //return customtyles.selectRow
              //return index % 2 === 0 ? customtyles.once : customtyles.two
            }}
            onRow={(record, rowIndex) => {
              return {
                onClick: event => {
                  if (record.isGroup) return
                  selectExamination(record)
                }, // click row
              }
            }}
            className={customtyles.table}
          ></Table>
        </GridItem>
      </GridContainer>
      {selectRow && (
        <div style={{ position: 'absolute', right: 0, top: 0 }}>
          <IndividualCommentDetails
            {...props}
            commentGroupList={commentGroupList}
            saveComment={onSaveComment}
          />
        </div>
      )}
    </div>
  )
}
export default Examination
