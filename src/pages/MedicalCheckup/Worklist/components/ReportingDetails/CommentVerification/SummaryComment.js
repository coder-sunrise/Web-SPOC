import React, { PureComponent } from 'react'
import moment from 'moment'
import Yup from '@/utils/yup'
import {
  Tabs,
  EditableTableGrid,
  Tooltip,
  Button,
  MultipleTextField,
} from '@/components'
import { CheckOutlined } from '@ant-design/icons'
import { hasValue } from '@/pages/Widgets/PatientHistory/config'

const SummaryComment = ({
  height: mainDivHeight = 700,
  setFieldValue,
  values,
  isEditEnable = true,
}) => {
  const commitSummaryCommentChanges = ({ rows, changed }) => {
    setFieldValue('medicalCheckupSummaryComment', rows)
  }
  let height = mainDivHeight - 180
  if (height < 300) height = 300
  return (
    <div>
      <EditableTableGrid
        TableProps={{
          height,
        }}
        rows={values.medicalCheckupSummaryComment}
        forceRender
        EditingProps={{
          showAddCommand: false,
          showCommandColumn: false,
          onCommitChanges: commitSummaryCommentChanges,
        }}
        columns={[
          { name: 'createBy', title: 'Created By' },
          { name: 'japaneseComment', title: 'Japanese Comment' },
          { name: 'englishComment', title: 'English Comment' },
          { name: 'isCustomized', title: 'Customized' },
          { name: 'isVerified', title: 'Verification' },
        ]}
        columnExtensions={[
          {
            columnName: 'createBy',
            width: 140,
            sortingEnabled: false,
            disabled: true,
            render: row => {
              const createBy = row.commentByUser || ''
              return (
                <Tooltip title={createBy}>
                  <span>{createBy}</span>
                </Tooltip>
              )
            },
          },
          {
            columnName: 'japaneseComment',
            sortingEnabled: false,
            isReactComponent: true,
            width: 465,
            render: rowProps => {
              const { row, columnConfig, cellProps } = rowProps
              const { control, error, validSchema } = columnConfig
              return isEditEnable ? (
                <MultipleTextField
                  value={row.japaneseComment}
                  maxLength={2000}
                  onChange={e => {
                    const { commitChanges } = control
                    commitChanges({
                      changed: {
                        [row.id]: {
                          japaneseComment: e.target.value,
                          isVerified: false,
                        },
                      },
                    })
                  }}
                />
              ) : (
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {row.japaneseComment}
                </div>
              )
            },
          },
          {
            columnName: 'englishComment',
            sortingEnabled: false,
            isReactComponent: true,
            width: 465,
            render: rowProps => {
              const { row, columnConfig, cellProps } = rowProps
              const { control, error, validSchema } = columnConfig
              return isEditEnable ? (
                <MultipleTextField
                  value={row.englishComment}
                  maxLength={2000}
                  onChange={e => {
                    const { commitChanges } = control
                    commitChanges({
                      changed: {
                        [row.id]: {
                          englishComment: e.target.value,
                          isVerified: false,
                        },
                      },
                    })
                  }}
                />
              ) : (
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {row.englishComment}
                </div>
              )
            },
          },
          {
            columnName: 'isCustomized',
            width: 90,
            sortingEnabled: false,
            disabled: true,
            align: 'center',
            render: row => {
              if (row.isCustomized)
                return <span style={{ color: 'red' }}> Yes</span>
              return <span style={{ color: 'green' }}> No</span>
            },
          },
          {
            columnName: 'isVerified',
            width: 86,
            sortingEnabled: false,
            disabled: true,
            align: 'center',
            isReactComponent: true,
            render: rowProps => {
              const { row, columnConfig, cellProps } = rowProps
              const { control, error, validSchema } = columnConfig
              if (row.isVerified)
                return (
                  <Tooltip title='Verified'>
                    <Button
                      color='success'
                      size='small'
                      justIcon
                      disabled={!isEditEnable}
                    >
                      <CheckOutlined />
                    </Button>
                  </Tooltip>
                )
              return (
                <Tooltip title='To do'>
                  <Button
                    color='primary'
                    size='small'
                    justIcon
                    disabled={!isEditEnable}
                    onClick={e => {
                      const { commitChanges } = control
                      commitChanges({
                        changed: {
                          [row.id]: {
                            isVerified: true,
                          },
                        },
                      })
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        lineHeight: '17px',
                        width: 17,
                        textAlign: 'center',
                      }}
                    >
                      TD
                    </span>
                  </Button>
                </Tooltip>
              )
            },
          },
        ]}
        FuncProps={{
          pager: false,
        }}
      />
    </div>
  )
}
export default SummaryComment
