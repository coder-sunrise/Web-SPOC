import React, { useEffect, useReducer } from 'react'
import * as Yup from 'yup'
import moment from 'moment'
import numeral from 'numeral'
// formik
import { withFormik } from 'formik'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// devgrid
import { IntegratedSummary } from '@devexpress/dx-react-grid'
// common components
import {
  Accordion,
  CardContainer,
  GridContainer,
  GridItem,
  dateFormatLong,
} from '@/components'
// sub components
import FilterBar from './FilterBar'
import ReportLayoutWrapper from '../ReportLayout'
import { ReportDataGrid, AccordionTitle } from '@/components/_medisys'
// services
import { getRawData } from '@/services/report'
import dummyData from './sales.json'

const SalesSummaryDetailsColumns = [
  { name: 'doctorName', title: 'Doctor Name' },
  { name: 'salesDate', title: 'Sales Date' },
  { name: 'amount', title: 'Amount' },
  // { name: 'category', title: 'Category' },
  { name: 'visitNum', title: 'Visits' },
]

const SalesSummaryByDateColumns = [
  { name: 'salesDate', title: 'Sales Date' },
  { name: 'totalAmount', title: 'Total Amount' },
]

const CommonColumns = [
  { name: 'categoryCode', title: 'Code' },
  { name: 'categoryDisplayValue', title: 'Display Value' },
  { name: 'totalAmount', title: 'Total Amount' },
]

const initialState = {
  loaded: false,
  isLoading: false,
  activePanel: -1,
  salesSummaryData: [],
  tableGroupRows: [],
  tableSummaryRows: [
    { columnName: 'amount', type: 'sum' },
    { columnName: 'visitNum', type: 'sum' },
  ],
  columnExtensions: [
    {
      columnName: 'salesDate',
      render: (row) => moment(row.salesDate).format(dateFormatLong),
    },
    {
      columnName: 'amount',
      type: 'currency',
    },
    {
      columnName: 'visitNum',
      type: 'number',
    },
  ],
  dynamicColumns: [
    ...SalesSummaryDetailsColumns,
  ],
}
const reducer = (state, action) => {
  switch (action.type) {
    case 'toggleLoading':
      return { ...state, isLoading: !state.isLoading }
    case 'setActivePanel':
      return { ...state, activePanel: action.payload }
    case 'setLoaded':
      return { ...state, loaded: action.payload }
    case 'updateState': {
      return { ...state, ...action.payload }
    }
    case 'reset':
      return { ...initialState }
    default:
      throw new Error()
  }
}

const sumReducer = (p, n) => {
  return p + n
}
const summaryCalculator = (type, rows, getValue) => {
  // console.log(type, rows, getValue)

  if (type === 'gst') {
    return numeral(rows.map((o) => o.amount).reduce(sumReducer) * 0.07).value()
  }
  if (type === 'subTotal') {
    return IntegratedSummary.defaultCalculator('sum', rows, getValue)
  }
  if (type === 'total') {
    return numeral(rows.map((o) => o.amount).reduce(sumReducer) * 1.07).value()
  }
  return IntegratedSummary.defaultCalculator(type, rows, getValue)
}

const todayDate = moment().set({ hour: 0, minute: 0, second: 0 }).formatUTC()
const mergeData = (result, dynamicColumnsInitialData) => {
  const { SalesSummaryDetails } = result
  const groupedByDoctor = SalesSummaryDetails.reduce((grouped, data, index) => {
    const currentData = { ...data, salesDate: data.salesDate || todayDate }
    if (grouped[currentData.doctorName] === undefined) {
      return {
        ...grouped,
        [currentData.doctorName]: [
          {
            ...currentData,
            ...dynamicColumnsInitialData,
            [currentData.category.toLowerCase()]: currentData.amount || 0,
          },
        ],
      }
    }
    const allRows = grouped[currentData.doctorName]

    const sameDateData = allRows.find(
      (item) => item.salesDate === currentData.salesDate,
    )
    const tempResult = [
      ...allRows.filter((item) => item.salesDate !== currentData.salesDate),
      {
        id: `${currentData.doctorName}-${index}`,
        ...sameDateData,
        ...currentData,
        ...dynamicColumnsInitialData,

        [currentData.category.toLowerCase()]: currentData.amount || 0,
      },
    ]
    return {
      ...grouped,
      [data.doctorName]: sameDateData
        ? tempResult
        : [
            ...allRows,
            {
              id: `${currentData.doctorName}-${index}`,
              ...currentData,
              ...dynamicColumnsInitialData,

              [currentData.category.toLowerCase()]: currentData.amount || 0,
            },
          ],
    }
  }, {})

  const mergedData = Object.keys(groupedByDoctor).reduce((merged, key) => {
    const d = groupedByDoctor[key]
    return [
      ...merged,
      ...d,
    ]
  }, [])
  const groups = Object.keys(groupedByDoctor)
  return { mergedData, groups }
}

const reportID = 3
const fileName = 'Sales Summary'

const SalesSummary = ({ values, validateForm }) => {
  const [
    state,
    dispatch,
  ] = useReducer(reducer, initialState)

  const asyncGetData = async () => {
    dispatch({
      type: 'toggleLoading',
    })

    const result = dummyData
    if (result) {
      const newColumns = [
        ...SalesSummaryDetailsColumns,
        ...Object.keys(result.SalesSummaryCategories[0]).reduce(
          (columns, column) =>
            column !== 'salesSummaryCategories'
              ? [
                  ...columns,
                  {
                    name: column,
                    title: column.toUpperCase(),
                  },
                ]
              : [
                  ...columns,
                ],
          [],
        ),
      ]
      const initialData = Object.keys(result.SalesSummaryCategories[0]).reduce(
        (initial, item) => ({ ...initial, [item]: 0 }),
        {},
      )

      const { mergedData, groups } = mergeData(result, initialData)
      dispatch({
        type: 'updateState',
        payload: {
          activePanel: 0,
          loaded: true,
          isLoading: false,
          salesSummaryData: mergedData,
          tableGroupRows: groups,
          tableSummaryRows: [
            ...initialState.tableSummaryRows,
            ...Object.keys(result.SalesSummaryCategories[0]).map((item) => ({
              columnName: item,
              type: 'sum',
            })),
          ],
          columnExtensions: [
            ...initialState.columnExtensions,
            ...Object.keys(result.SalesSummaryCategories[0]).map((item) => ({
              columnName: item.toLowerCase(),
              type: 'currency',
            })),
          ],
          dynamicColumns: newColumns,
        },
      })
    } else {
      dispatch({
        type: 'updateState',
        payload: {
          loaded: false,
          isLoading: false,
        },
      })
    }
  }

  const onSubmitClick = async () => {
    dispatch({
      type: 'setLoaded',
      payload: false,
    })
    const errors = await validateForm()
    if (Object.keys(errors).length > 0) return
    asyncGetData()
  }

  useEffect(() => {
    /* 
    clean up function
    set data to empty array when leaving the page 
    */
    return () =>
      dispatch({
        type: 'reset',
      })
  }, [])

  const handleExpandedGroupsChange = (expandedGroups) => {
    dispatch({
      type: 'updateState',
      payload: {
        groups: expandedGroups,
      },
    })
  }

  return (
    <CardContainer hideHeader>
      <GridContainer>
        <GridItem md={12}>
          <FilterBar handleSubmit={onSubmitClick} />
        </GridItem>
        <GridItem md={12}>
          <ReportLayoutWrapper
            loading={state.isLoading}
            reportID={reportID}
            reportParameters={values}
            loaded={state.loaded}
            fileName={fileName}
          >
            <ReportDataGrid
              style={{ marginTop: 16 }}
              height='auto'
              data={state.salesSummaryData}
              columns={state.dynamicColumns}
              columnExtensions={state.columnExtensions}
              FuncProps={{
                pager: false,
                grouping: true,
                summary: true,
                groupingConfig: {
                  state: {
                    grouping: [
                      { columnName: 'doctorName' },
                    ],
                    expandedGroups: [
                      ...state.tableGroupRows,
                    ],
                    onExpandedGroupsChange: handleExpandedGroupsChange,
                  },
                },
                summaryConfig: {
                  state: {
                    totalItems: state.tableSummaryRows,
                    groupItems: state.tableSummaryRows,
                  },
                  integrated: {
                    calculator: summaryCalculator,
                  },
                  row: {
                    messages: {
                      sum: 'Total',
                      // subTotal: 'Sub Total',
                      // gst: 'GST',
                      // total: 'Total',
                    },
                  },
                },
              }}
            />
          </ReportLayoutWrapper>
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
}

const SalesSummaryWithFormik = withFormik({
  validationSchema: Yup.object().shape(
    {
      // patientCriteria: Yup.string().required(),
    },
  ),
  mapPropsToValues: () => ({
    dateFrom: moment().startOf('month').toDate(),
  }),
})(SalesSummary)

export default SalesSummaryWithFormik
