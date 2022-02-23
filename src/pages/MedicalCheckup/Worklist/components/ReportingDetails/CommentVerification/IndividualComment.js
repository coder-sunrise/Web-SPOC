import React, { PureComponent } from 'react'
import moment from 'moment'
import {
  Tabs,
  EditableTableGrid,
  withFormikExtend,
  Tooltip,
  Button,
  MultipleTextField,
} from '@/components'
import { CheckOutlined } from '@ant-design/icons'

const IndividualComment = ({
  height: mainDivHeight = 700,
  setFieldValue,
  values,
}) => {
  const commitIndividualCommentChanges = ({ rows, changed }) => {
    setFieldValue('individualComment', rows)
  }
  let height = mainDivHeight - 180
  if (height < 300) height = 300
  return (
    <div>
      <EditableTableGrid
        TableProps={{
          height,
        }}
        rows={values.individualComment}
        forceRender
        EditingProps={{
          showAddCommand: false,
          showCommandColumn: false,
          onCommitChanges: commitIndividualCommentChanges,
        }}
        columns={[
          { name: 'examinationType', title: 'Examination' },
          { name: 'createBy', title: 'Create By' },
          { name: 'japaneseComment', title: 'Japanese Comment' },
          { name: 'englishComment', title: 'English Comment' },
          { name: 'isCustomized', title: 'Customized' },
          { name: 'isVerified', title: 'Verification' },
        ]}
        columnExtensions={[
          {
            columnName: 'examinationType',
            width: 140,
            sortingEnabled: false,
            disabled: true,
          },
          {
            columnName: 'createBy',
            width: 140,
            sortingEnabled: false,
            disabled: true,
          },
          {
            columnName: 'japaneseComment',
            sortingEnabled: false,
            isReactComponent: true,
            width: 395,
            render: rowProps => {
              const { row, columnConfig, cellProps } = rowProps
              const { control, error, validSchema } = columnConfig
              return (
                <MultipleTextField
                  value={row.japaneseComment}
                  maxLength={2000}
                  onChange={e => {
                    const { commitChanges } = control
                    commitChanges({
                      changed: {
                        [row.id]: {
                          japaneseComment: e.target.value,
                        },
                      },
                    })
                  }}
                />
              )
            },
          },
          {
            columnName: 'englishComment',
            sortingEnabled: false,
            isReactComponent: true,
            width: 395,
            render: rowProps => {
              const { row, columnConfig, cellProps } = rowProps
              const { control, error, validSchema } = columnConfig
              return (
                <MultipleTextField
                  value={row.englishComment}
                  maxLength={2000}
                  onChange={e => {
                    const { commitChanges } = control
                    commitChanges({
                      changed: {
                        [row.id]: {
                          englishComment: e.target.value,
                        },
                      },
                    })
                  }}
                />
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
                    <Button color='success' size='small' justIcon>
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
export default IndividualComment
