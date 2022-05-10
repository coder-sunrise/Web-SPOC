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
  RADIOLOGY_WORKITEM_STATUS_TITLE,
  VISIT_TYPE_NAME,
  VISIT_TYPE,
  CLINICAL_ROLE,
} from '@/utils/constants'
import { PrinterOutlined, UnorderedListOutlined } from '@ant-design/icons'
import moment from 'moment'
import WorklistContext, {
  WorklistContextProvider,
} from '../Worklist/WorklistContext'
import { Fragment, useContext } from 'react'
import RadiologyDetails from '../Worklist/Details'
import { compose } from 'redux'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'dva'
import _ from 'lodash'
import LinkIcon from '@material-ui/icons/Link'
import IconButton from '@/components/Button/IconButton'
import { withStyles } from '@material-ui/core'
import { CommonSeriesSettingsHoverStyle } from 'devextreme-react/chart'

const { queryList, query } = service
const api = {
  remove: null,
  create: null,
  update: null,
  queryList,
  query,
}

const style = theme => ({})

const orderDateForm = moment(moment().add(-1, 'week').toDate()).formatUTC()
const orderDateTo = moment().endOf('day').formatUTC(false)

const saveColumnsSetting = (dispatch, columnsSetting) => {
  dispatch({
    type: 'radiologyHisotry/saveUserPreference',
    payload: {
      userPreferenceDetails: {
        value: columnsSetting,
        Identifier: 'RadiologyHistoryColumnSetting',
      },
      itemIdentifier: 'RadiologyHistoryColumnSetting',
      type: '4', //grid setting type
    },
  }).then(result => {
    dispatch({
      type: 'radiologyHisotry/updateState',
      payload: {
        radiologyHistoryColumnSetting: columnsSetting,
      },
    })
  })
}

const defaultColumns = (codetable, setDetailsId, visitPurpose) => {
  return [
    {
      key: 'accessionNo',
      title: 'Accession No.',
      dataIndex: 'accessionNo',
      defaultSortOrder: 'descend',
      sorter: true,
      search: false,
      width: 120,
      fixed: 'left',
      render: (_dom: any, entity: any) => {
        return (
          <span>
            <span>{entity.accessionNo}</span>
            {entity.isCombinedOrder && (
              <Popper
                overlay={
                  <div style={{ width: 381, padding: 5 }}>
                    <CommonTableGrid
                      rows={entity.combinedOrders.map((o, i) => {
                        return { no: i + 1, ...o }
                      })}
                      columns={[
                        { name: 'no', title: 'No.' },
                        { name: 'accessionNo', title: 'Accession No.' },
                        { name: 'examination', title: 'Examination' },
                        { name: 'isPrimary', title: 'Primary' },
                      ]}
                      columnExtensions={[
                        { columnName: 'no', width: 60, sortingEnabled: false },
                        {
                          columnName: 'accessionNo',
                          width: 110,
                          sortingEnabled: false,
                        },
                        {
                          columnName: 'examination',
                          width: 120,
                          sortingEnabled: false,
                        },
                        {
                          columnName: 'isPrimary',
                          width: 80,
                          sortingEnabled: false,
                          render: r => {
                            return r.isPrimary ? 'Yes' : 'No'
                          },
                        },
                      ]}
                      FuncProps={{
                        pager: false,
                      }}
                    />
                  </div>
                }
              >
                <IconButton color='transparent' style={{ marginTop: -2 }}>
                  <LinkIcon color='primary' />
                </IconButton>
              </Popper>
            )}
          </span>
        )
      },
    },
    {
      key: 'orderDate',
      title: 'Order Date',
      dataIndex: 'orderDate',
      valueType: 'dateTime',
      render: (_dom: any, entity: any) =>
        entity.orderTime?.format('DD MMM YYYY HH:mm') || '-',
      sortBy: 'WorkitemFKNavigation.GenerateDate',
      sorter: true,
      search: false,
      width: 145,
      fixed: 'left',
    },
    {
      key: 'examination',
      title: 'Examination',
      dataIndex: 'examination',
      sorter: false,
      search: false,
      fixed: 'left',
      width: 160,
    },
    {
      key: 'patientName',
      title: 'Patient Name',
      dataIndex: 'patientName',
      sorter: false,
      search: false,
      fixed: 'left',
      width: 200,
    },
    {
      key: 'patientReferenceNo',
      title: 'Ref. No.',
      dataIndex: 'patientReferenceNo',
      sorter: false,
      search: false,
      width: 100,
    },
    {
      key: 'patientAccountNo',
      title: 'Acc. No.',
      dataIndex: 'patientAccountNo',
      sorter: false,
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
      key: 'priority',
      title: 'Priority',
      dataIndex: 'priority',
      sorter: false,
      search: false,
      width: 85,
      render: (_dom: any, entity: any) => {
        return (
          <span style={{ color: entity.priority === 'Urgent' ? 'red' : '' }}>
            {entity.priority}
          </span>
        )
      },
    },
    {
      key: 'visitType',
      title: 'Visit Type',
      dataIndex: 'visitType',
      sorter: false,
      search: false,
      width: 85,
      render: (_dom: any, entity: any) => {
        const vt = (visitPurpose || []).find(x => x.id === entity.visitType)
        return vt?.code
      },
    },
    {
      key: 'visitDoctor',
      title: 'Visit Doctor',
      dataIndex: 'visitDoctor',
      sorter: false,
      search: false,
      width: 130,
    },
    {
      key: 'radiographer',
      title: 'Radiology Technologist',
      dataIndex: 'radiographer',
      sorter: false,
      search: false,
      width: 130,
    },
    {
      key: 'modality',
      title: 'Modality',
      dataIndex: 'modality',
      sorter: false,
      search: false,
      width: 130,
    },
    {
      key: 'completedDate',
      title: 'Completed Date',
      dataIndex: 'completedDate',
      valueType: 'dateTime',
      render: (_dom: any, entity: any) =>
        entity.completedDate?.format('DD MMM YYYY HH:mm') || '-',
      sorter: false,
      search: false,
      width: 145,
    },
    {
      key: 'cancelledDate',
      title: 'Cancelled Date',
      dataIndex: 'cancelledDate',
      valueType: 'dateTime',
      render: (_dom: any, entity: any) =>
        entity.cancelledDate?.format('DD MMM YYYY HH:mm') || '-',
      sorter: false,
      search: false,
      width: 145,
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sorter: false,
      search: false,
      renderText: (item, { type, defaultRender, ...rest }, form) =>
        Object.values(RADIOLOGY_WORKITEM_STATUS_TITLE)[item - 1],
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
      hideInTable: true,
      title: '',
      dataIndex: 'searchAccessionNo',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return <TextField style={{ width: 250 }} label='Accession No.' />
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
      // title: Visit Type
      hideInTable: true,
      title: '',
      dataIndex: 'searchVisitType',
      initialValue: [-99],
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        const visitPurposeOptions = (visitPurpose || []).map(x => ({
          value: x.id,
          name: x.name,
          customTooltipField: x.customTooltipField,
        }))
        return (
          <Select
            label='Visit Type'
            mode='multiple'
            options={visitPurposeOptions}
            placeholder=''
            style={{ width: 250 }}
            maxTagCount={0}
            maxTagPlaceholder='Visit Types'
          />
        )
      },
    },
    {
      // search: Modality
      hideInTable: true,
      title: '',
      dataIndex: 'searchModality',
      initialValue: [-99],
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        const modalityOptions = codetable.ctmodality || []
        return (
          <Select
            label='Modality'
            mode='multiple'
            options={modalityOptions}
            valueField='id'
            placeholder=''
            style={{ width: 250 }}
            maxTagCount={0}
            maxTagPlaceholder='Modalities'
          />
        )
      },
    },
    {
      // search: Examination
      hideInTable: true,
      title: '',
      dataIndex: 'searchExamination',
      initialValue: [-99],
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        const service = (codetable.ctservice || []).filter(
          x => x.serviceCenterCategoryFK === 3,
        )
        const serviceOptions = Object.values(
          _.groupBy(service, 'serviceId'),
        ).map(x => {
          return { value: x[0].serviceId, name: x[0].displayValue }
        })
        return (
          <Select
            label='Examination'
            mode='multiple'
            options={serviceOptions}
            placeholder=''
            style={{ width: 250 }}
            maxTagCount={0}
            maxTagPlaceholder='Examinations'
          />
        )
      },
    },
    {
      // search: VisitDoctor
      hideInTable: true,
      title: '',
      dataIndex: 'searchVisitDoctor',
      initialValue: [-99],
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        const visitDoctorOptions = (codetable.doctorprofile || []).map(x => {
          return {
            value: x.id,
            name: x.clinicianProfile.name,
            doctorMCRNo: x.doctorMCRNo,
            clinicianProfile: x.clinicianProfile,
          }
        })
        return (
          <Select
            label='Visit Doctor'
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
      // search: Priority
      hideInTable: true,
      title: '',
      dataIndex: 'searchPriority',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return (
          <Select
            label='Priority'
            options={[
              {
                value: 'Normal',
                name: 'Normal',
              },
              {
                value: 'Urgent',
                name: 'Urgent',
              },
            ]}
            placeholder=''
            style={{ width: 250 }}
          />
        )
      },
    },
    {
      // search: Radiographer
      hideInTable: true,
      title: '',
      dataIndex: 'searchRadiographer',
      initialValue: [-99],
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        const radiographer = (codetable.clinicianprofile || []).filter(
          x => x.userProfile.role.clinicRoleFK === CLINICAL_ROLE.RADIOGRAPHER,
        )
        const radiographerOptions = radiographer.map(x => {
          return { value: x.userProfile.id, name: x.name }
        })
        return (
          <Select
            label='Radiology Technologist'
            mode='multiple'
            options={radiographerOptions}
            placeholder=''
            style={{ width: 250 }}
            maxTagCount={0}
            maxTagPlaceholder='Radiology Technologist'
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
            options={[
              { value: 4, name: 'Completed' },
              { value: 5, name: 'Cancelled' },
            ]}
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

const RadiologyWorklistHistoryIndex = ({
  radiologyHisotry: { radiologyHistoryColumnSetting = [] },
  codetable,
  clinicSettings,
  classes,
}) => {
  const dispatch = useDispatch()
  const { detailsId, setDetailsId } = useContext(WorklistContext)

  useEffect(() => {
    dispatch({
      force: true,
      type: 'codetable/fetchCodes',
      payload: { code: 'ctservice' },
      filter: {
        'serviceFKNavigation.IsActive': true,
        'serviceCenterFKNavigation.ServiceCenterCategoryFK': 4,
        combineCondition: 'and',
      },
    })
    dispatch({
      force: true,
      type: 'codetable/fetchCodes',
      payload: { code: 'ctmodality' },
    })
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
    dispatch({
      force: true,
      type: 'codetable/fetchCodes',
      payload: {
        code: 'clinicianprofile',
        filter: {
          isActive: true,
        },
      },
    })
    dispatch({
      force: true,
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctvisitpurpose',
      },
    })
  }, [])

  let visitTypeSettingsObj = undefined
  let visitPurpose = undefined

  if (clinicSettings.visitTypeSetting) {
    try {
      visitTypeSettingsObj = JSON.parse(clinicSettings.visitTypeSetting)
    } catch {}
  }

  const mapVisitType = (visitpurpose, visitTypeSettingsObj) => {
    return visitpurpose
      .map((item, index) => {
        const { name, code, sortOrder, ...rest } = item
        const vstType = visitTypeSettingsObj
          ? visitTypeSettingsObj[index]
          : undefined
        return {
          ...rest,
          name: vstType?.displayValue || name,
          code: vstType?.code || code,
          isEnabled: vstType?.isEnabled || 'true',
          sortOrder: vstType?.sortOrder || 0,
          customTooltipField: `Code: ${vstType?.code ||
            code}\nName: ${vstType?.displayValue || name}`,
        }
      })
      .sort((a, b) => (a.sortOrder >= b.sortOrder ? 1 : -1))
  }

  if ((codetable?.ctvisitpurpose || []).length > 0) {
    visitPurpose = mapVisitType(
      codetable.ctvisitpurpose,
      visitTypeSettingsObj,
    ).filter(
      vstType =>
        vstType.id != VISIT_TYPE.OTC && vstType['isEnabled'] === 'true',
    )
  }

  const columns = defaultColumns(codetable, setDetailsId, visitPurpose)

  return (
    <Fragment>
      <PageContainer pageHeaderRender={false}>
        <ProTable
          onRow={row => {
            return {
              onDoubleClick: () => {
                setDetailsId(row.id)
              },
            }
          }}
          rowSelection={false}
          columns={columns}
          api={api}
          search={{
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
          columnsStateMap={radiologyHistoryColumnSetting}
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
            searchAccessionNo,
            searchOrderDateForm,
            searchOrderDateTo,
            searchPatient,
            searchVisitType,
            searchStatus,
            searchVisitDoctor,
            searchExamination,
            searchPriority,
            searchRadiographer,
            searchModality,
            ...values
          }) => {
            return {
              ...values,
              apiCriteria: {
                accessionNo: searchAccessionNo,
                orderDateForm: searchOrderDateForm ? moment(moment(searchOrderDateForm).toDate()).formatUTC(): undefined ,
                orderDateTo: searchOrderDateTo ? moment(searchOrderDateTo).endOf('day').formatUTC(false) : undefined ,
                searchValue: searchPatient,
                visitType:
                  searchVisitType?.indexOf(-99) > -1
                    ? null
                    : searchVisitType?.join(),
                modality:
                  searchModality?.indexOf(-99) > -1
                    ? null
                    : searchModality?.join(),
                examination:
                  searchExamination?.indexOf(-99) > -1
                    ? null
                    : searchExamination?.join(),
                visitDoctor:
                  searchVisitDoctor?.indexOf(-99) > -1
                    ? null
                    : searchVisitDoctor?.join(),
                priority: searchPriority,
                radiographer:
                  searchRadiographer?.indexOf(-99) > -1
                    ? null
                    : searchRadiographer?.join(),
                status:
                  searchStatus?.indexOf(-99) > -1 ? null : searchStatus?.join(),
              },
            }
          }}
          scroll={{ x: 1100 }}
        />
      </PageContainer>
      <RadiologyDetails />
    </Fragment>
  )
}

// @ts-ignore

const HistoryIndex = props => (
  <WorklistContextProvider>
    <RadiologyWorklistHistoryIndex {...props}></RadiologyWorklistHistoryIndex>
  </WorklistContextProvider>
)

const historyIndex = compose(
  connect(({ radiologyHisotry, codetable, clinicSettings }) => ({
    radiologyHisotry,
    codetable,
    clinicSettings: clinicSettings.settings || clinicSettings.default,
  })),
)(HistoryIndex)

export default withStyles(style, { name: 'RadiologyHistory' })(historyIndex)
