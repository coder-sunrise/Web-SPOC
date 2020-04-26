import React, { PureComponent, useState, useCallback } from 'react'
import { Tooltip } from '@material-ui/core'
import { Delete, Edit, Print } from '@material-ui/icons'
import { formTypes, formStatus } from '@/utils/codes'
import {
  CommonTableGrid,
  Button,
  Popconfirm,
  TextField,
  Danger,
} from '@/components'
import VoidWithPopover from './FormDetail/VoidWithPopover'

class FormModuleGrid extends PureComponent {
  constructor (props) {
    super(props)

    this.VoidForm = ({ classes, dispatch, row }) => {
      const [
        reason,
        setReason,
      ] = useState(undefined)

      const handleConfirmDelete = useCallback((i, voidVisibleChange) => {
        if (reason) {
          voidVisibleChange()
          dispatch({
            type: 'formListing/update',
            payload: {
              ...row,
              voidReason: reason,
              statusFK: 4,
            },
          }).then(() => {
            dispatch({
              type: 'formListing/query',
            })
          })
        }
      })
      return (
        <VoidWithPopover
          title='Void Form'
          contentText='Confirm to void this form?'
          tooltipText='Void Form'
          extraCmd={
            <div className={classes.errorContainer}>
              <TextField
                label='Void Reason'
                autoFocus
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value)
                }}
              />

              {!reason && (
                <Danger>
                  <span>Void reason is required</span>
                </Danger>
              )}
            </div>
          }
          onCancelClick={() => {
            setReason(undefined)
          }}
          onConfirmDelete={handleConfirmDelete}
        />
      )
    }

    this.tableParas = {
      columns: [
        { name: 'type', title: 'Type' },
        { name: 'visitDate', title: 'Visit Date' },
        { name: 'patientID', title: 'Patient ID' },
        { name: 'patientName', title: 'Patient Name' },
        { name: 'updateUserName', title: 'From' },
        { name: 'createDate', title: 'Create Time' },
        { name: 'lastUpdateDate', title: 'Last Update Time' },
        { name: 'submissionDate', title: 'Submission Time' },
        { name: 'statusFK', title: 'Status' },
        { name: 'action', title: 'Action' },
      ],
      columnExtensions: [
        {
          columnName: 'type',
          type: 'select',
          options: formTypes,
          sortingEnabled: false,
        },
        {
          columnName: 'visitDate',
          type: 'date',
          sortingEnabled: false,
        },
        {
          columnName: 'createDate',
          type: 'date',
          sortingEnabled: false,
        },
        {
          columnName: 'lastUpdateDate',
          type: 'date',
          sortingEnabled: false,
        },
        {
          columnName: 'submissionDate',
          type: 'date',
          sortingEnabled: false,
        },
        {
          columnName: 'statusFK',
          type: 'select',
          options: formStatus,
          sortingEnabled: false,
        },
        {
          columnName: 'action',
          align: 'center',
          sortingEnabled: false,
          render: (row) => {
            const { classes, dispatch } = props
            return (
              <React.Fragment>
                <Tooltip title='Print'>
                  <Button
                    size='sm'
                    onClick={() => {
                      this.props.printRow(row)
                    }}
                    justIcon
                    color='primary'
                    style={{ marginRight: 5 }}
                  >
                    <Print />
                  </Button>
                </Tooltip>
                {(row.statusFK === 1 || row.statusFK === 2) && (
                  <Tooltip title='Edit'>
                    <Button
                      size='sm'
                      onClick={() => {
                        this.props.editRow(row)
                      }}
                      justIcon
                      color='primary'
                      style={{ marginRight: 5 }}
                    >
                      <Edit />
                    </Button>
                  </Tooltip>
                )}
                {(row.statusFK === 1 || row.statusFK === 2) && (
                  <Popconfirm
                    onConfirm={() =>
                      this.props
                        .dispatch({
                          type: 'formListing/update',
                          payload: {
                            ...row,
                            isDeleted: true,
                          },
                        })
                        .then(() => {
                          dispatch({
                            type: 'formListing/query',
                          })
                        })}
                  >
                    <Tooltip title='Delete'>
                      <Button size='sm' color='danger' justIcon>
                        <Delete />
                      </Button>
                    </Tooltip>
                  </Popconfirm>
                )}
                {row.statusFK === 3 && (
                  <this.VoidForm
                    classes={classes}
                    dispatch={dispatch}
                    row={row}
                  />
                )}
              </React.Fragment>
            )
          },
        },
      ],
      FuncProps: {
        pager: true,
        filter: true,
      },
    }
  }

  render () {
    const { overrideTableParas = {} } = this.props
    return (
      <React.Fragment>
        <CommonTableGrid
          type='formListing'
          // rows={formListing.list}
          onRowDoubleClick={this.props.editRow}
          {...this.tableParas}
          {...overrideTableParas}
        />
      </React.Fragment>
    )
  }
}

export default FormModuleGrid
