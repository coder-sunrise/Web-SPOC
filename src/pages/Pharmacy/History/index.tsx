import {
  PageContainer,
  Select,
  TextField,
  DatePicker,
  Popper,
  CommonTableGrid,
  CodeSelect,
  Tooltip,
} from '@/components'
import { ProTable, Input, Button } from '@medisys/component'

import service from './services'
import { connect, history } from 'umi'
import { formatMessage } from 'umi'
import { getAppendUrl } from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import {
  PharmacyWorkitemStatus,
  VISIT_TYPE_NAME,
  VISIT_TYPE,
} from '@/utils/constants'
import { PrinterOutlined, UnorderedListOutlined } from '@ant-design/icons'
import moment from 'moment'
import WorklistContext, {
  WorklistContextProvider,
} from '@/pages/Radiology/Worklist/WorklistContext'
import { Fragment, useContext } from 'react'
import PharmacyDetails from '../Worklist/Details'
import { compose } from 'redux'
import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'dva'
import _ from 'lodash'
import LinkIcon from '@material-ui/icons/Link'
import IconButton from '@/components/Button/IconButton'
import { withStyles } from '@material-ui/core'

const { queryList, query } = service
const api = {
  remove: null,
  create: null,
  update: null,
  queryList,
  query,
}

const style = theme => ({})

const IsFullyDispensedStatus = {
  false: 'Partially',
  true: 'Completed',
}

const orderDateForm = moment()
  .add(-1, 'week')
  .toDate()
const orderDateTo = moment().toDate()

const saveColumnsSetting = (dispatch, columnsSetting) => {
  dispatch({
    type: 'pharmacyHisotry/saveUserPreference',
    payload: {
      userPreferenceDetails: {
        value: columnsSetting,
        Identifier: 'PharmacyHistoryColumnSetting',
      },
      itemIdentifier: 'PharmacyHistoryColumnSetting',
      type: '4', //grid setting type
    },
  }).then(result => {
    dispatch({
      type: 'pharmacyHisotry/updateState',
      payload: {
        pharmacyHistoryColumnSetting: columnsSetting,
      },
    })
  })
}

const defaultColumns = (codetable, setDetailsId) => {
  return [
    {
      key: 'patientName',
      title: 'Patient Name',
      dataIndex: 'patientName',
      sorter: true,
      search: false,
      fixed: 'left',
      width: 200,
      ellipsis: true,
    },
    {
      key: 'patientReferenceNo',
      title: 'Ref. No.',
      dataIndex: 'patientReferenceNo',
      sorter: true,
      search: false,
      width: 100,
    },
    {
      key: 'patientAccountNo',
      title: 'Acc. No.',
      dataIndex: 'patientAccountNo',
      sorter: true,
      search: false,
      width: 100,
    },
    {
      key: 'genderAge',
      title: 'Gender/Age',
      dataIndex: 'genderAge',
      sorter: false,
      search: false,
      render: (_dom: any, entity: any) =>
        `${entity.gender?.substring(0, 1)}/${Math.floor(
          entity.dob?.toDate()?.duration('year'),
        )}`,
      width: 100,
    },
    {
      key: 'orderBy',
      title: 'Ordered By',
      dataIndex: 'orderBy',
      sorter: true,
      search: false,
      width: 160,
    },
    {
      key: 'orderDate',
      title: 'Order Time',
      dataIndex: 'orderDate',
      defaultSortOrder: 'descend',
      sortBy: 'orderTime',
      valueType: 'dateTime',
      render: (_dom: any, entity: any) =>
        entity.orderTime?.format('DD MMM YYYY HH:mm') || '-',
      sorter: true,
      search: false,
      width: 145,
    },
    {
      key: 'preparedBy',
      title: 'Prepared By',
      dataIndex: 'preparedBy',
      sorter: true,
      search: false,
      width: 130,
    },
    {
      key: 'preparedTime',
      title: 'Prepared Time',
      dataIndex: 'preparedTime',
      valueType: 'dateTime',
      render: (_dom: any, entity: any) =>
        entity.preparedTime?.format('DD MMM YYYY HH:mm') || '-',
      sorter: true,
      search: false,
      width: 145,
    },
    {
      key: 'verifiedBy',
      title: 'Verified By',
      dataIndex: 'verifiedBy',
      sorter: true,
      search: false,
      width: 130,
    },
    {
      key: 'verifiedTime',
      title: 'Verified Time',
      dataIndex: 'verifiedTime',
      valueType: 'dateTime',
      render: (_dom: any, entity: any) =>
        entity.verifiedTime?.format('DD MMM YYYY HH:mm') || '-',
      sorter: true,
      search: false,
      width: 145,
    },
    {
      key: 'dispensedBy',
      title: 'Dispensed By',
      dataIndex: 'dispensedBy',
      sorter: true,
      search: false,
      width: 130,
    },
    {
      key: 'dispensedTime',
      title: 'Dispensed Time',
      dataIndex: 'dispensedTime',
      valueType: 'dateTime',
      render: (_dom: any, entity: any) =>
        entity.dispensedTime?.format('DD MMM YYYY HH:mm') || '-',
      sorter: true,
      search: false,
      width: 145,
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sorter: true,
      search: false,
      width: 100,
      fixed: 'right',
    },
    {
      key: 'action',
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      sorter: false,
      search: false,
      fixed: 'right',
      width: 80,
      render: (item, { type, defaultRender, ...rest }, form) => {
        return (
          <Button
            onClick={() => {
              setDetailsId(rest.id)
            }}
            type='primary'
            icon={<UnorderedListOutlined />}
          />
        )
      },
    },
    {
      // search: Patient Name/Acc. No./Ref. No.
      hideInTable: true,
      title: '',
      dataIndex: 'searchPatient',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null
        }
        return (
          <TextField
            style={{ width: 250 }}
            label={'Patient Name, Acc. No., Patient Ref. No.'}
          />
        )
      },
    },
    {
      // search: OrderDateFrom,
      hideInTable: true,
      title: '',
      dataIndex: 'searchOrderDateForm',
      initialValue: orderDateForm,
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return (
          <DatePicker
            style={{ width: 250 }}
            label='Order Date From'
            placeholder=''
          />
        )
      },
    },
    {
      // title: OrderDateTo
      hideInTable: true,
      title: '',
      dataIndex: 'searchOrderDateTo',
      initialValue: orderDateTo,
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return (
          <DatePicker
            style={{ width: 250 }}
            label='Order Date To'
            placeholder=''
          />
        )
      },
    },
    {
      // search: VisitDoctor
      hideInTable: true,
      title: '',
      dataIndex: 'searchOrderBy',
      // initialValue:[-99],
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        const visitDoctorOptions = (codetable.doctorprofile || []).map(x => {
          return {
            value: x.clinicianProfile.userProfileFK,
            name: x.clinicianProfile.name,
            doctorMCRNo: x.doctorMCRNo,
            clinicianProfile: x.clinicianProfile,
          }
        })
        return (
          <Select
            label='Order By'
            mode='multiple'
            options={visitDoctorOptions}
            placeholder=''
            style={{ width: 250 }}
            maxTagCount={0}
            maxTagPlaceholder='Doctors'
            // renderDropdown={(option) => <DoctorLabel doctor={option} />}
          />
        )
      },
    },
    {
      // title: Status
      hideInTable: true,
      title: '',
      dataIndex: 'searchStatus',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return (
          <Select
            label='Status'
            mode='multiple'
            options={Object.entries(IsFullyDispensedStatus).map(x => ({
              value: x[0],
              name: x[1],
            }))}
            placeholder=''
            style={{ width: 250 }}
            maxTagCount={0}
            maxTagPlaceholder='Statuses'
          />
        )
      },
    },
  ]
}

const PharmacyWorklistHistoryIndex = ({
  pharmacyHisotry: { pharmacyHistoryColumnSetting = [] },
  codetable,
  clinicSettings,
  classes,
}) => {
  const dispatch = useDispatch()
  const { detailsId, setDetailsId } = useContext(WorklistContext)
  const actionRef = useRef()

  useEffect(() => {
    dispatch({
      force: true,
      type: 'codetable/fetchCodes',
      payload: {
        code: 'doctorprofile',
        filter: {
          'clinicianProfile.isActive': true,
        },
      },
    })
  }, [])

  const refreshClick = () => {
    actionRef.current.reload()
  }

  const columns = defaultColumns(codetable, setDetailsId)

  return (
    <Fragment>
      <PageContainer pageHeaderRender={false}>
        <ProTable
          actionRef={actionRef}
          rowSelection={false}
          onRow={row => {
            return {
              onDoubleClick: () => {
                setDetailsId(row.id)
              },
            }
          }}
          columns={columns}
          api={api}
          search={{
            span: 8,
            collapsed: false,
            collapseRender: false,
            searchText: 'Search',
            resetText: 'Reset',
            optionRender: (searchConfig, formProps, dom) => {
              return (
                <div
                  style={{
                    display: 'inline',
                    float: 'right',
                    width: 200,
                    marginTop: 15,
                  }}
                >
                  {dom[1]} {dom[0]}
                </div>
              )
            },
          }}
          options={{ density: false, reload: false }}
          columnsStateMap={pharmacyHistoryColumnSetting}
          onColumnsStateChange={map => saveColumnsSetting(dispatch, map)}
          defaultColumns={[]}
          pagination={{ defaultPageSize: 20, showSizeChanger: true }}
          features={[
            {
              code: 'details',
              render: row => {
                return (
                  <Button
                    onClick={() => {
                      setDetailsId(row.id)
                    }}
                    type='primary'
                    icon={<UnorderedListOutlined />}
                  />
                )
              },
            },
          ]}
          beforeSearchSubmit={({
            searchPatient,
            searchOrderDateForm,
            searchOrderDateTo,
            searchOrderBy,
            searchStatus,
            ...values
          }) => {
            return {
              ...values,
              apiCriteria: {
                searchValue: searchPatient,
                orderDateForm: moment(searchOrderDateForm)
                  .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                  .formatUTC(false),
                orderDateTo: moment(searchOrderDateTo)
                  .set({ hour: 23, minute: 59, second: 59, millisecond: 0 })
                  .formatUTC(false),
                visitDoctor: searchOrderBy?.includes(-99)
                  ? null
                  : searchOrderBy?.join(),
                status: searchStatus?.includes(-99)
                  ? null
                  : searchStatus?.join(),
              },
            }
          }}
          scroll={{ x: 1100 }}
        />
      </PageContainer>
      <PharmacyDetails refreshClick={refreshClick} fromModule='History' />
    </Fragment>
  )
}

// @ts-ignore

const HistoryIndex = props => (
  <WorklistContextProvider>
    <PharmacyWorklistHistoryIndex {...props}></PharmacyWorklistHistoryIndex>
  </WorklistContextProvider>
)

const historyIndex = compose(
  connect(({ pharmacyHisotry, codetable, clinicSettings }) => ({
    pharmacyHisotry,
    codetable,
    clinicSettings: clinicSettings.settings || clinicSettings.default,
  })),
)(HistoryIndex)

export default withStyles(style, { name: 'PharmacyHistory' })(historyIndex)
