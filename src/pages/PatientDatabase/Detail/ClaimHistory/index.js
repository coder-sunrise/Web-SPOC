import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Edit, Info } from '@material-ui/icons'
import Authorized from '@/utils/Authorized'
import { Tooltip, CommonTableGrid, Button, CommonModal } from '@/components'
import Details from './Details'

const ClaimHistory = ({ values, dispatch, claimHistory, clinicSettings }) => {
  const [showEditClaimDetails, setShowEditClaimDetails] = useState(false)
  const {
    diagnosisDataSource = 'Snomed',
    isEnableJapaneseICD10Diagnosis = false,
  } = clinicSettings

  const getColumns = () => {
    const editClaimHistoryRight = Authorized.check(
      'patientdatabase.patientprofiledetails.viewclaimhistory.editclaimdetails',
    ) || { rights: 'hidden' }

    let columns = [
      { name: 'visitDate', title: 'Visit Date' },
      { name: 'doctor', title: 'Doctor' },
      { name: 'diagnosis', title: 'Diagnosis' },
      { name: 'diagnosisJP', title: 'Diagnosis (JP)' },
      { name: 'internationalCode', title: 'Int. Code' },
      { name: 'diagnosisType', title: 'Type' },
      { name: 'isClaimable', title: 'Claimable' },
      { name: 'onsetDate', title: 'Onset Date' },
      { name: 'firstVisitDate', title: 'First Visit Date' },
      {
        name: 'validityDays',
        title: (
          <div>
            <p style={{ height: 16 }}>Validity</p>
            <p style={{ height: 16 }}>(Days)</p>
          </div>
        ),
      },
      {
        name: 'balanceDays',
        title: (
          <div>
            <p style={{ height: 16 }}>Balance</p>
            <p style={{ height: 16 }}>
              (Days)
              <Tooltip title='Order has been amended, please retrieve latest order from Details link'>
                <Info
                  style={{
                    color: 'red',
                    marginLeft: 2,
                    position: 'relative',
                    bottom: '-4px',
                    fontSize: '1rem',
                  }}
                />
              </Tooltip>
            </p>
          </div>
        ),
      },
      {
        name: 'dueDate',
        title: (
          <div>
            Due Date
            <Tooltip title='Order has been amended, please retrieve latest order from Details link'>
              <Info
                style={{
                  color: 'red',
                  marginLeft: 2,
                  position: 'relative',
                  bottom: '-4px',
                  fontSize: '1rem',
                }}
              />
            </Tooltip>
          </div>
        ),
      },
      { name: 'diagnosisRemarks', title: 'Diagnosis Remarks' },
      { name: 'updateUser', title: 'Updated By' },
      { name: 'updateDate', title: 'Updated Date' },
      { name: 'remarks', title: 'Remarks' },
      { name: 'action', title: 'Action' },
    ]

    if (diagnosisDataSource === 'Snomed' || !isEnableJapaneseICD10Diagnosis) {
      columns = columns.filter(c => c.name !== 'diagnosisJP')
    }

    if (editClaimHistoryRight.rights !== 'enable') {
      columns = columns.filter(c => c.name !== 'action')
    }
    return columns
  }

  const columnExtensions = diagnosisType => {
    return [
      {
        columnName: 'visitDate',
        width: 100,
        sortingEnabled: false,
        render: row => {
          const visitDate = moment(row.visitDate).format('DD MMM YYYY')
          return (
            <Tooltip title={visitDate}>
              <div>{visitDate}</div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'doctor',
        width: 120,
        sortingEnabled: false,
        render: row => {
          const doctor = `${
            row.doctorTitle && row.doctorTitle.trim().length
              ? `${row.doctorTitle}. `
              : ''
          }${row.doctorName || ''}`
          return (
            <Tooltip title={doctor}>
              <div>{doctor}</div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'diagnosis',
        width: 150,
        sortingEnabled: false,
        render: row => {
          const diagnosis =
            diagnosisType === 'Snomed'
              ? row.diagnosisFK
                ? row.diagnosisDescription
                : '-'
              : row.icd10JpnDiagnosisFK
              ? row.icd10DiagnosisDescription
              : '-'
          return (
            <Tooltip title={diagnosis}>
              <div>{diagnosis}</div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'diagnosisJP',
        width: 150,
        sortingEnabled: false,
        render: row => {
          return (
            <Tooltip title={row.icd10JpnDiagnosisDescription}>
              <div>
                {row.icd10JpnDiagnosisFK
                  ? row.icd10JpnDiagnosisDescription
                  : '-'}
              </div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'internationalCode',
        width: 80,
        align: 'center',
        sortingEnabled: false,
        render: row => {
          return (
            <Tooltip title={row.internationalCode}>
              <div>{row.internationalCode || '-'}</div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'diagnosisType',
        width: 80,
        sortingEnabled: false,
        render: row => {
          return (
            <Tooltip title={row.diagnosisType}>
              <div>{row.diagnosisType || '-'}</div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'isClaimable',
        width: 80,
        align: 'center',
        sortingEnabled: false,
        render: row => {
          const claimable = row.isClaimable ? 'Yes' : 'No'
          return (
            <Tooltip title={claimable}>
              <div>{claimable}</div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'onsetDate',
        width: 100,
        sortingEnabled: false,
        render: row => {
          const onsetDate = row.onsetDate
            ? moment(row.onsetDate).format('DD MMM YYYY')
            : '-'
          return (
            <Tooltip title={onsetDate}>
              <div>{onsetDate}</div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'firstVisitDate',
        width: 110,
        sortingEnabled: false,
        render: row => {
          const firstVisitDate = row.firstVisitDate
            ? moment(row.firstVisitDate).format('DD MMM YYYY')
            : '-'
          return (
            <Tooltip title={firstVisitDate}>
              <div>{firstVisitDate}</div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'validityDays',
        width: 70,
        align: 'center',
        sortingEnabled: false,
        render: row => {
          return (
            <Tooltip tirle={row.validityDays}>
              <div>{row.validityDays || '-'}</div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'balanceDays',
        width: 70,
        align: 'center',
        sortingEnabled: false,
        render: row => {
          return (
            <Tooltip
              title={
                row.balanceDays || row.balanceDays === 0 ? row.balanceDays : '-'
              }
            >
              <div>
                {row.balanceDays || row.balanceDays === 0
                  ? row.balanceDays
                  : '-'}
              </div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'dueDate',
        width: 100,
        sortingEnabled: false,
        render: row => {
          const dueDate = row.dueDate
            ? moment(row.dueDate).format('DD MMM YYYY')
            : '-'
          return (
            <Tooltip title={dueDate}>
              <div>{dueDate}</div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'diagnosisRemarks',
        sortingEnabled: false,
        width: 200,
        render: row => {
          return (
            <Tooltip title={row.diagnosisRemarks}>
              <div
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {row.diagnosisRemarks || '-'}
              </div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'updateUser',
        width: 110,
        sortingEnabled: false,
        render: row => {
          const updateUser = `${
            row.updateUserTitle && row.updateUserTitle.trim().length
              ? `${row.updateUserTitle}. `
              : ''
          }${row.updateUserName || ''}`
          return (
            <Tooltip title={updateUser}>
              <div>{updateUser}</div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'updateDate',
        width: 100,
        sortingEnabled: false,
        render: row => {
          const updateDate = moment(row.updateDate).format('DD MMM YYYY')
          return (
            <Tooltip title={updateDate}>
              <div>{updateDate}</div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'remarks',
        sortingEnabled: false,
        width: 200,
        render: row => {
          return (
            <Tooltip title={row.remarks}>
              <div
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {row.remarks || '-'}
              </div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'action',
        width: 60,
        sortingEnabled: false,
        align: 'center',
        render: row => {
          return (
            <Button
              size='sm'
              onClick={() => {
                editCick(row)
              }}
              justIcon
              color='primary'
              style={{ marginRight: 5 }}
            >
              <Edit />
            </Button>
          )
        },
      },
    ]
  }
  useEffect(() => {
    if (values.id) {
      dispatch({
        type: 'claimHistory/query',
        payload: {
          pagesize: 100,
          sorting: [
            {
              columnName: 'visitDate',
              sortBy: 'visitFKNavigation.visitDate',
              direction: 'desc',
            },
          ],
          patientProfileFK: values.id,
        },
      })
    }
  }, [])

  const closeForm = () => {
    dispatch({
      type: 'claimHistory/updateState',
      payload: {
        entity: undefined,
      },
    })
    setShowEditClaimDetails(false)
  }

  const editCick = row => {
    dispatch({
      type: 'claimHistory/queryOne',
      payload: {
        id: row.id,
      },
    }).then(r => {
      if (r) {
        setShowEditClaimDetails(true)
      }
    })
  }
  return (
    <div>
      <CommonTableGrid
        getRowId={row => row.id}
        size='sm'
        forceRender
        type='claimHistory'
        //rows={claimHistory.list || []}
        columns={getColumns()}
        columnExtensions={columnExtensions(diagnosisDataSource)}
      />

      <CommonModal
        open={showEditClaimDetails}
        title='Edit Claim Details'
        onClose={() => {
          closeForm()
        }}
        maxWidth='sm'
        overrideLoading
        observe='ClaimDetails'
        showFooter={false}
        onConfirm={() => {
          closeForm()
        }}
      >
        <Details />
      </CommonModal>
    </div>
  )
}

export default connect(({ claimHistory, clinicSettings }) => ({
  claimHistory: claimHistory || {},
  clinicSettings: clinicSettings.settings,
}))(ClaimHistory)
