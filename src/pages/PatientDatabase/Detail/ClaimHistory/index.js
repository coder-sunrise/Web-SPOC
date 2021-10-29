import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Edit, Info } from '@material-ui/icons'
import Authorized from '@/utils/Authorized'
import { Tooltip, Button, CommonModal, dateFormatLong } from '@/components'
import { ProTable } from '@medisys/component'
import service from './services'
import Details from './Details'

const ClaimHistory = ({ values, dispatch, height, clinicSettings }) => {
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
      {
        key: 'visitDate',
        title: 'Visit Date',
        dataIndex: 'visitDate',
        sorter: false,
        search: false,
        render: (_dom, row) => {
          const visitDate = moment(row.visitDate).format(dateFormatLong)
          return (
            <Tooltip title={visitDate}>
              <div>{visitDate}</div>
            </Tooltip>
          )
        },
        width: 100,
      },
      {
        key: 'doctor',
        title: 'Doctor',
        dataIndex: 'doctor',
        width: 120,
        sorter: false,
        search: false,
        render: (_dom, row) => {
          const doctor = `${
            row.doctorTitle && row.doctorTitle.trim().length
              ? `${row.doctorTitle}. `
              : ''
          }${row.doctorName || ''}`
          return (
            <Tooltip title={doctor}>
              <div
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  width: 104,
                }}
              >
                {doctor}
              </div>
            </Tooltip>
          )
        },
      },
      {
        key: 'diagnosis',
        title: 'Diagnosis',
        dataIndex: 'diagnosis',
        width: 150,
        sorter: false,
        search: false,
        render: (_dom, row) => {
          const diagnosis =
            diagnosisDataSource === 'Snomed'
              ? row.diagnosisFK
                ? row.diagnosisDescription
                : '-'
              : row.icD10DiagnosisFK
              ? row.icD10DiagnosisDescription
              : '-'
          return (
            <Tooltip title={diagnosis}>
              <div
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  width: 134,
                }}
              >
                {diagnosis}
              </div>
            </Tooltip>
          )
        },
      },
      {
        key: 'diagnosisJP',
        title: 'Diagnosis (JP)',
        dataIndex: 'diagnosisJP',
        width: 150,
        sorter: false,
        search: false,
        render: (_dom, row) => {
          return (
            <Tooltip title={row.icD10JpnDiagnosisDescription}>
              <div
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  width: 134,
                }}
              >
                {row.icD10JpnDiagnosisFK
                  ? row.icD10JpnDiagnosisDescription
                  : '-'}
              </div>
            </Tooltip>
          )
        },
      },
      {
        key: 'internationalCode',
        title: 'Int. Code',
        dataIndex: 'internationalCode',
        width: 80,
        align: 'center',
        sorter: false,
        search: false,
        render: (_dom, row) => {
          return (
            <Tooltip title={row.internationalCode}>
              <div
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  width: 64,
                }}
              >
                {row.internationalCode || '-'}
              </div>
            </Tooltip>
          )
        },
      },
      {
        key: 'diagnosisType',
        title: 'Type',
        dataIndex: 'diagnosisType',
        width: 80,
        sorter: false,
        search: false,
        render: (_dom, row) => {
          return (
            <Tooltip title={row.diagnosisType}>
              <div>{row.diagnosisType || '-'}</div>
            </Tooltip>
          )
        },
      },
      {
        key: 'isClaimable',
        title: 'Claimable',
        dataIndex: 'isClaimable',
        width: 80,
        align: 'center',
        sorter: false,
        search: false,
        render: (_dom, row) => {
          const claimable = row.isClaimable ? 'Yes' : 'No'
          return (
            <Tooltip title={claimable}>
              <div>{claimable}</div>
            </Tooltip>
          )
        },
      },
      {
        key: 'onsetDate',
        title: 'Onset Date',
        dataIndex: 'onsetDate',
        width: 100,
        sorter: false,
        search: false,
        render: (_dom, row) => {
          const onsetDate = row.onsetDate
            ? moment(row.onsetDate).format(dateFormatLong)
            : '-'
          return (
            <Tooltip title={onsetDate}>
              <div>{onsetDate}</div>
            </Tooltip>
          )
        },
      },
      {
        key: 'firstVisitDate',
        title: 'First Visit Date',
        dataIndex: 'firstVisitDate',
        width: 110,
        sorter: false,
        search: false,
        render: (_dom, row) => {
          const firstVisitDate = row.firstVisitDate
            ? moment(row.firstVisitDate).format(dateFormatLong)
            : '-'
          return (
            <Tooltip title={firstVisitDate}>
              <div>{firstVisitDate}</div>
            </Tooltip>
          )
        },
      },
      {
        key: 'validityDays',
        title: (
          <div>
            <p style={{ height: 16 }}>Validity</p>
            <p style={{ height: 16 }}>(Days)</p>
          </div>
        ),
        dataIndex: 'validityDays',
        width: 80,
        align: 'center',
        sorter: false,
        search: false,
        render: (_dom, row) => {
          return (
            <Tooltip tirle={row.validityDays}>
              <div>{row.validityDays || '-'}</div>
            </Tooltip>
          )
        },
      },
      {
        key: 'balanceDays',
        title: (
          <div>
            <p style={{ height: 16 }}>Balance</p>
            <p style={{ height: 16 }}>
              (Days)
              <Tooltip
                title={
                  <div>
                    <p>i.e.,</p>
                    <p>Due Date (-) Today's Date = Balance (days)</p>
                  </div>
                }
              >
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
        dataIndex: 'balanceDays',
        width: 80,
        align: 'center',
        sorter: false,
        search: false,
        render: (_dom, row) => {
          const balanceDays = row.dueDate
            ? Math.floor(
                (moment(row.dueDate).startOf('day') - moment().startOf('day')) /
                  (24 * 3600 * 1000),
              )
            : undefined
          return (
            <Tooltip
              title={balanceDays || balanceDays === 0 ? row.balanceDays : '-'}
            >
              <div>{balanceDays || balanceDays === 0 ? balanceDays : '-'}</div>
            </Tooltip>
          )
        },
      },
      {
        key: 'dueDate',
        title: (
          <div>
            Due Date
            <Tooltip
              title={
                <div>
                  <p>i.e.,</p>
                  <p>
                    <span style={{ textDecoration: 'underline' }}>
                      Sickness:
                    </span>{' '}
                    First Visit Date (+) Validity = Due Date
                  </p>
                  <p>
                    <span style={{ textDecoration: 'underline' }}>Injury:</span>{' '}
                    Onset Visit Date (+) Validity = Due Date
                  </p>
                </div>
              }
            >
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
        dataIndex: 'dueDate',
        width: 100,
        sorter: false,
        search: false,
        render: (_dom, row) => {
          const dueDate = row.dueDate
            ? moment(row.dueDate).format(dateFormatLong)
            : '-'
          return (
            <Tooltip title={dueDate}>
              <div>{dueDate}</div>
            </Tooltip>
          )
        },
      },
      {
        key: 'diagnosisRemarks',
        title: 'Diagnosis Remarks',
        dataIndex: 'diagnosisRemarks',
        sorter: false,
        search: false,
        width: 200,
        render: (_dom, row) => {
          return (
            <Tooltip title={row.diagnosisRemarks}>
              <div
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  width: 184,
                }}
              >
                {row.diagnosisRemarks || '-'}
              </div>
            </Tooltip>
          )
        },
      },
      {
        key: 'updateUser',
        title: 'Updated By',
        dataIndex: 'updateUser',
        width: 110,
        sorter: false,
        search: false,
        render: (_dom, row) => {
          const updateUser = `${
            row.updateUserTitle && row.updateUserTitle.trim().length
              ? `${row.updateUserTitle}. `
              : ''
          }${row.updateUserName || ''}`
          return (
            <Tooltip title={updateUser}>
              <div
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  width: 94,
                }}
              >
                {updateUser}
              </div>
            </Tooltip>
          )
        },
      },
      {
        key: 'updateDate',
        title: 'Updated Date',
        dataIndex: 'updateDate',
        width: 100,
        sorter: false,
        search: false,
        render: (_dom, row) => {
          const updateDate = moment(row.updateDate).format(dateFormatLong)
          return (
            <Tooltip title={updateDate}>
              <div>{updateDate}</div>
            </Tooltip>
          )
        },
      },
      {
        key: 'remarks',
        title: 'Remarks',
        dataIndex: 'remarks',
        sorter: false,
        search: false,
        width: 200,
        render: (_dom, row) => {
          return (
            <Tooltip title={row.remarks}>
              <div
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  width: 184,
                }}
              >
                {row.remarks || '-'}
              </div>
            </Tooltip>
          )
        },
      },
      {
        key: 'action',
        title: 'Action',
        dataIndex: 'action',
        width: 60,
        sorter: false,
        search: false,
        align: 'center',
        fixed: 'right',
        render: (_dom, row) => {
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

    if (diagnosisDataSource === 'Snomed' || !isEnableJapaneseICD10Diagnosis) {
      columns = columns.filter(c => c.dataIndex !== 'diagnosisJP')
    }

    if (editClaimHistoryRight.rights !== 'enable') {
      columns = columns.filter(c => c.dataIndex !== 'action')
    }
    return columns
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

  const { queryList, query } = service
  const api = {
    remove: null,
    create: null,
    update: null,
    queryList,
    query: null,
  }
  return (
    <div>
      <ProTable
        rowSelection={false}
        options={false}
        columns={getColumns()}
        api={api}
        defaultColumns={[]}
        search={false}
        scroll={{ x: 2000, y: height - 260 }}
        pagination={{ pageSize: 100 }}
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

export default connect(({ clinicSettings }) => ({
  clinicSettings: clinicSettings.settings,
}))(ClaimHistory)
