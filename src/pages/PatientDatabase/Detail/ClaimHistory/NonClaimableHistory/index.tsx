import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'dva'
import { Link } from 'umi'
import moment from 'moment'
import { Edit, Info } from '@material-ui/icons'
import Authorized from '@/utils/Authorized'
import {
  Tooltip,
  Button,
  CommonModal,
  dateFormatLongWithTimeNoSec,
  Popconfirm,
} from '@/components'
import { ProTable } from '@medisys/component'
import { ActionType } from '@ant-design/pro-table'
import Delete from '@material-ui/icons/Delete'
import service from './services'
import Details from './Details'

const NonClaimableHistory = ({
  dispatch,
  mainDivHeight = 700,
  patientProfileFK,
  values,
}) => {
  const [
    showEditNonClaimableHistoryDetails,
    setShowEditNonClaimableHistoryDetails,
  ] = useState(false)
  const [isEditClaim, setIsEditClaim] = useState(false)
  const myRef = useRef<ActionType>()

  const getColumns = () => {
    const confirmDelete = id => {
      dispatch({
        type: 'nonClaimableHistory/delete',
        payload: { id },
      }).then(() => {
        myRef?.current?.reload()
      })
    }

    const editNonClaimableHistoryDetailsRight = Authorized.check(
      'patientdatabase.patientprofiledetails.claimhistory.viewnonclaimablehistory.edit',
    ) || { rights: 'hidden' }

    const deleteNonClaimableHistoryDetailsRight = Authorized.check(
      'patientdatabase.patientprofiledetails.claimhistory.viewnonclaimablehistory.delete',
    ) || { rights: 'hidden' }

    let columns = [
      {
        key: 'details',
        title: 'Reason',
        dataIndex: 'details',
        sorter: false,
        search: false,
        render: (_dom, row) => {
          return (
            <div style={{ whiteSpace: 'pre-wrap' }}>{row.details || ''}</div>
          )
        },
      },
      {
        key: 'remarks',
        title: 'Remarks',
        dataIndex: 'remarks',
        sorter: false,
        search: false,
        width: 400,
        render: (_dom, row) => {
          return (
            <div style={{ whiteSpace: 'pre-wrap' }}>{row.remarks || ''}</div>
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
              <div>{updateUser}</div>
            </Tooltip>
          )
        },
      },
      {
        key: 'lastUpdateDate',
        title: 'Updated Date',
        dataIndex: 'lastUpdateDate',
        width: 140,
        sorter: false,
        search: false,
        render: (_dom, row) => {
          const updateDate = moment(row.lastUpdateDate).format(
            dateFormatLongWithTimeNoSec,
          )
          return (
            <Tooltip title={updateDate}>
              <div>{updateDate}</div>
            </Tooltip>
          )
        },
      },
      {
        key: 'action',
        title: 'Action',
        dataIndex: 'action',
        width: 80,
        sorter: false,
        search: false,
        align: 'center',
        fixed: 'right',
        render: (_dom, row) => {
          return (
            <div>
              {editNonClaimableHistoryDetailsRight.rights === 'enable' && (
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
              )}
              {deleteNonClaimableHistoryDetailsRight.rights === 'enable' && (
                <Popconfirm
                  title='Are you sure?'
                  onConfirm={() => {
                    confirmDelete(row.id)
                  }}
                >
                  <Button size='sm' justIcon color='danger'>
                    <Delete />
                  </Button>
                </Popconfirm>
              )}
            </div>
          )
        },
      },
    ]

    if (!values.isActive) {
      columns = columns.filter(c => c.dataIndex !== 'action')
    }

    return columns
  }

  const closeForm = () => {
    dispatch({
      type: 'nonClaimableHistory/updateState',
      payload: {
        entity: undefined,
      },
    })
    setIsEditClaim(false)
    setShowEditNonClaimableHistoryDetails(false)
  }

  const editCick = row => {
    setIsEditClaim(true)
    dispatch({
      type: 'nonClaimableHistory/queryOne',
      payload: {
        id: row.id,
      },
    }).then(r => {
      if (r) {
        setShowEditNonClaimableHistoryDetails(true)
      }
    })
  }

  const { queryList } = service
  const api = {
    remove: null,
    create: null,
    update: null,
    queryList: payload => {
      return queryList({
        ...payload,
        sort: [
          {
            sortby: 'sequence',
            order: 'asc',
          },
        ],
        patientProfileFK: patientProfileFK,
      })
    },
    query: null,
  }

  const addNonClaimableHistoryDetailsRight = Authorized.check(
    'patientdatabase.patientprofiledetails.claimhistory.viewnonclaimablehistory.add',
  ) || { rights: 'hidden' }

  return (
    <div>
      <ProTable
        actionRef={myRef}
        rowSelection={false}
        options={false}
        columns={getColumns()}
        api={api}
        defaultColumns={[]}
        search={false}
        scroll={{ x: 1200, y: mainDivHeight - 340 }}
        pagination={{ defaultPageSize: 20, showSizeChanger: true }}
      />
      {addNonClaimableHistoryDetailsRight.rights === 'enable' &&
        values.isActive && (
          <Link>
            <span
              style={{
                textDecoration: 'underline',
                marginLeft: 12,
              }}
              onClick={() => {
                setShowEditNonClaimableHistoryDetails(true)
              }}
            >
              + New
            </span>
          </Link>
        )}

      <CommonModal
        open={showEditNonClaimableHistoryDetails}
        title={
          isEditClaim
            ? 'Edit Non Claimable Details'
            : 'Add Non Claimable Details'
        }
        onClose={closeForm}
        maxWidth='sm'
        overrideLoading
        observe='NonClaimableHistoryDetails'
        showFooter={false}
        onConfirm={() => {
          closeForm()
          myRef?.current?.reload()
        }}
      >
        <Details patientProfileFK={patientProfileFK} />
      </CommonModal>
    </div>
  )
}

export default connect(({ clinicSettings, global }) => ({
  clinicSettings: clinicSettings.settings,
  mainDivHeight: global.mainDivHeight,
}))(NonClaimableHistory)
