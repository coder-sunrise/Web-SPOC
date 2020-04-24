import React, { PureComponent, useState, useCallback } from 'react'
import { Tooltip } from '@material-ui/core'
import { Delete, Edit, Print } from '@material-ui/icons'
import { formTypes, formStatus } from '@/utils/codes'
import { download } from '@/utils/request'
import { commonDataReaderTransform } from '@/utils/utils'
import {
  CommonTableGrid,
  Button,
  CommonModal,
  Popconfirm,
  notification,
  TextField,
  Danger,
} from '@/components'
import VoidWithPopover from '../FormDetail/VoidWithPopover'
import AddForm from '../FormDetail/AddForm'

export const printRow = async (row, props) => {
  const type = formTypes.find(
    (o) => o.value === row.type || o.name === row.type || o.code === row.type,
  )
  const { downloadConfig } = type
  if (!downloadConfig) {
    notification.error({ message: 'No configuration found' })
    return
  }
  // return
  if (row.id) {
    download(
      `/api/Reports/${downloadConfig.id}?ReportFormat=pdf&ReportParameters={${downloadConfig.key}:${row.id}}`,
      {
        subject: row.subject,
        type: 'pdf',
      },
    )
  } else {
    const { codetable, patient } = props
    const { clinicianprofile = [] } = codetable
    const { entity } = patient
    const obj =
      clinicianprofile.find(
        (o) =>
          o.userProfileFK ===
          (row.issuedByUserFK ? row.issuedByUserFK : row.referredByUserFK),
      ) || {}

    row.doctorName = (obj.title ? `${obj.title} ` : '') + obj.name
    row.doctorMCRNo = obj.doctorProfile.doctorMCRNo

    row.patientName = entity.name
    row.patientAccountNo = entity.patientAccountNo

    download(
      `/api/Reports/${downloadConfig.id}?ReportFormat=pdf`,
      {
        subject: row.subject,
        type: 'pdf',
      },
      {
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: {
          reportContent: JSON.stringify(
            commonDataReaderTransform(downloadConfig.draft(row)),
          ),
        },
      },
    )
  }
}

class CorFormGrid extends PureComponent {
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

    this.toggleModal = () => {
      const { formListing } = this.props
      const { showModal } = formListing
      this.props.dispatch({
        type: 'formListing/updateState',
        payload: {
          showModal: !showModal,
        },
      })
    }

    this.editRow = (row) => {
      if (row.statusFK === 3 || row.statusFK === 4) return
      this.props.dispatch({
        type: 'formListing/updateState',
        payload: {
          entity: row,
          type: row.type,
        },
      })
      this.toggleModal()
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
                      printRow(row, this.props)
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
                        this.editRow(row)
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
                      this.props.dispatch({
                        type: 'formListing/update',
                        payload: {
                          ...row,
                          isDeleted: true,
                        },
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
    const { formListing, overrideTableParas = {} } = this.props
    console.log('formListing', formListing)
    return (
      <React.Fragment>
        <CommonTableGrid
          // type='formListing'
          rows={formListing.list}
          onRowDoubleClick={this.editRow}
          {...this.tableParas}
          {...overrideTableParas}
        />
        <CommonModal
          open={formListing.showModal}
          title='Add Form'
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
          observe='AddForm'
          maxWidth='md'
          bodyNoPadding
        >
          <AddForm {...this.props} types={formTypes} />
        </CommonModal>
      </React.Fragment>
    )
  }
}

export default CorFormGrid
