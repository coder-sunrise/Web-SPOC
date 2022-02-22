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
      queryIndividualCommentHistory(
        medicalCheckupReportingDetails.patientID,
        medicalCheckupReportingDetails.visitID,
      )
    }
  }, [
    medicalCheckupReportingDetails.visitID,
    medicalCheckupReportingDetails.patientID,
  ])
  const queryIndividualCommentHistory = (patientProfileFK, visitFK) => {
    dispatch({
      type: 'medicalCheckupReportingDetails/queryIndividualCommentHistory',
      payload: {
        apiCriteria: { patientProfileFK, visitFK },
      },
    }).then(response => {
      if (response && response.status === '200') {
        setData(response.data.data)
      }
    })
  }
  const setData = individualComment => {
    const defaultData = getDataSource()
    const data = _.orderBy(individualComment, ['visitDate'], ['desc'])
    let newData = defaultData.map(row => {
      let insertComment = {}
      data.forEach((item, index) => {
        let commentList = []
        if (!row.isGroup) {
          commentList = (item.individualComments || []).filter(
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
            <div style={{ padding: row.isGroup ? 4 : '4px 4px 4px 10px' }}>
              {text}
            </div>
          )
        },
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
            <div style={{ padding: 4 }}>
              {row[`valueColumn${index + 1}`].map(item => {
                return <div>11111</div>
              })}
            </div>
          )
        },
      })
    })

    defaultColumns.push({
      dataIndex: 'action',
      title: '',
      width: '100%',
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
      })
      const examinationitems = ctexaminationitem.filter(
        item => item.examinationCategoryFK === category.id,
      )
      defaultData = defaultData.concat(
        examinationitems.map(item => ({
          id: item.id,
          examinationType: item.displayValue,
          isGroup: false,
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
          editIndividualComment: [...row['valueColumn1']],
        },
      },
    })
    setSelectRow(row.id)
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
              if (!record.isGroup && record.id === selectRow)
                return customtyles.selectRow
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
          />
        </div>
      )}
    </div>
  )
}
export default Examination
