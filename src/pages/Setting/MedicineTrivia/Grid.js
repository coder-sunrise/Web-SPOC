import React, { Fragment, PureComponent } from 'react'
import { CommonTableGrid, Button, Tooltip } from '@/components'
import { status } from '@/utils/codes'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
import { Tag } from 'antd'

class Grid extends PureComponent {
  editRow = (row, e) => {
    const { dispatch, settingMedicineTrivia } = this.props
    const { list } = settingMedicineTrivia
    dispatch({
      type: 'settingMedicineTrivia/updateState',
      payload: {
        showModal: true,
        entity: list.find(o => o.id === row.id),
      },
    })
  }

  confirmDelete = id => {
    const { dispatch } = this.props
    dispatch({
      type: 'settingMedicineTrivia/delete',
      payload: { id },
    }).then(() => {
      dispatch({
        type: 'settingMedicineTrivia/query',
      })
    })
  }

  deleteTrivia = (row, e) => {
    const { dispatch, settingMedicineTrivia } = this.props
    const { list } = settingMedicineTrivia
    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmContent: 'Delete this medicine trivia?',
        onConfirmSave: () => this.confirmDelete(row.id),
      },
    })
  }

  render() {
    const { height, clinicSettings } = this.props
    const {
      primaryPrintoutLanguage = 'EN',
      secondaryPrintoutLanguage = '',
    } = clinicSettings
    const isUseSecondLanguage = secondaryPrintoutLanguage !== ''
    let columns = [
      { name: 'code', title: 'Code' },
      {
        name: 'displayValue',
        title: `Display Value${
          isUseSecondLanguage ? ` (${primaryPrintoutLanguage})` : ''
        }`,
      },
      {
        name: 'translatedDisplayValue',
        title: `Display Value (${secondaryPrintoutLanguage})`,
      },
      {
        name: 'action',
        title: 'Action',
      },
    ]

    if (!isUseSecondLanguage) {
      columns = columns.filter(c => c.name !== 'translatedDisplayValue')
    }
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingMedicineTrivia'
        onRowDoubleClick={this.editRow}
        TableProps={{
          height,
        }}
        columns={columns}
        columnExtensions={[
          {
            columnName: 'translatedDisplayValue',
            sortingEnabled: false,
          },
          {
            columnName: 'code',
            width: 200,
            sortingEnabled: true,
            render: row => {
              let width = row.isDefault ? 128 : 190
              return (
                <div style={{ position: 'relative', top: '5px' }}>
                  <div
                    style={{
                      display: 'inline-block',
                      width: width,
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.code}
                  </div>
                  {row.isDefault ? (
                    <span style={{ position: 'relative', top: '-5px' }}>
                      <Tag color='#87d068'>Current</Tag>
                    </span>
                  ) : (
                    <span></span>
                  )}
                </div>
              )
            },
          },
          {
            columnName: 'action',
            sortingEnabled: false,
            align: 'center',
            render: row => {
              return (
                <Fragment>
                  <Tooltip title='Edit Medicine Trivia' placement='bottom'>
                    <Button
                      size='sm'
                      onClick={() => {
                        this.editRow(row)
                      }}
                      justIcon
                      color='primary'
                    >
                      <Edit />
                    </Button>
                  </Tooltip>
                  <Tooltip title='Delete Medicine Trivia'>
                    <Button
                      className='noPadding'
                      color='danger'
                      size='sm'
                      id={row.id}
                      justIcon
                      rounded
                      onClick={() => {
                        this.deleteTrivia(row)
                      }}
                    >
                      <Delete />
                    </Button>
                  </Tooltip>
                </Fragment>
              )
            },
          },
        ]}
      />
    )
  }
}

export default Grid
