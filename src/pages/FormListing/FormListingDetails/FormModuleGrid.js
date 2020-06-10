import React, { PureComponent, useState, useCallback } from 'react'
import moment from 'moment'
import { Tooltip, withStyles } from '@material-ui/core'
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

const styles = (theme) => ({
  errorContainer: {
    textAlign: 'left',
    lineHeight: '1em',
    paddingBottom: theme.spacing(1),
    '& span': {
      fontSize: '.8rem',
    },
  },
})
class FormModuleGrid extends PureComponent {
  constructor (props) {
    super(props)

    this.editRow = (row) => {
      if (row.statusFK === 3 || row.statusFK === 4) return
      this.props.dispatch({
        type: 'formListing/updateState',
        payload: {
          showModal: true,
          entity: row,
          type: row.type,
          formCategory: this.props.formCategory,
          formFrom: this.props.formFrom,
          visitDetail: {
            visitID: row.visitID,
            currentCORId: row.clinicalObjectRecordFK,
            visitDate: row.visitDate,
          },
        },
      })
    }

    this.VoidForm = ({ classes, dispatch, row, user }) => {
      const [
        reason,
        setReason,
      ] = useState(undefined)

      const handleConfirmVoid = useCallback((i, voidVisibleChange) => {
        if (reason) {
          voidVisibleChange()
          dispatch({
            type: 'formListing/saveForm',
            payload: {
              visitID: row.visitID,
              currentCORId: row.clinicalObjectRecordFK,
              formType: 'CORForm',
              UpdateType: row.type,
              visitLetterOfCertification: [],
              corLetterOfCertification: [
                {
                  ...row,
                  formData: JSON.stringify(row.formData),
                  voidReason: reason,
                  statusFK: 4,
                  voidDate: moment(),
                  voidByUserFK: user.data.clinicianProfile.id,
                },
              ],
            },
          }).then(() => {
            this.props.queryFormListing()
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
          onConfirmDelete={handleConfirmVoid}
        />
      )
    }

    this.tableParas = {
      columns: [
        { name: 'type', title: 'Type' },
        { name: 'visitDate', title: 'Visit Date' },
        { name: 'patientID', title: 'Patient ID' },
        { name: 'patientName', title: 'Patient Name' },
        { name: 'doctor', title: 'From' },
        { name: 'createDate', title: 'Create Time' },
        { name: 'lastUpdateDate', title: 'Last Update Time' },
        { name: 'submissionDate', title: 'Submission Time' },
        { name: 'statusFK', title: 'Status' },
        { name: 'action', title: 'Action' },
      ],
      columnExtensions: [
        {
          columnName: 'patientID',
          width: 100,
        },
        {
          columnName: 'type',
          type: 'select',
          options: formTypes,
          width: 180,
        },
        {
          columnName: 'visitDate',
          type: 'date',
          width: 100,
        },
        {
          columnName: 'createDate',
          sortingEnabled: false,
          type: 'date',
          showTime: true,
          width: 180,
        },
        {
          columnName: 'lastUpdateDate',
          type: 'date',
          showTime: true,
          sortingEnabled: false,
          width: 180,
        },
        {
          columnName: 'submissionDate',
          type: 'date',
          showTime: true,
          sortingEnabled: false,
          width: 180,
        },
        {
          columnName: 'statusFK',
          type: 'select',
          options: formStatus,
          width: 80,
        },
        {
          columnName: 'action',
          align: 'center',
          sortingEnabled: false,
          render: (row) => {
            const { classes, dispatch, user } = props
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
                      this.props
                        .dispatch({
                          type: 'formListing/saveForm',
                          payload: {
                            visitID: row.visitID,
                            currentCORId: row.clinicalObjectRecordFK,
                            formType: 'CORForm',
                            UpdateType: row.type,
                            visitLetterOfCertification: [],
                            corLetterOfCertification: [
                              {
                                ...row,
                                formData: JSON.stringify(row.formData),
                                isDeleted: true,
                              },
                            ],
                          },
                        })
                        .then(() => {
                          this.props.queryFormListing()
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
                    user={user}
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
    const { overrideTableParas = {}, formListing } = this.props
    return (
      <React.Fragment>
        <CommonTableGrid
          type='formListing'
          rows={formListing.list}
          onRowDoubleClick={this.editRow}
          {...this.tableParas}
          {...overrideTableParas}
        />
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { name: 'FormModuleGrid' })(FormModuleGrid)
