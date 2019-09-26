import React, { useEffect, useReducer } from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
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

const todayDate = moment().set({ hour: 0, minute: 0, second: 0 }).formatUTC()
const mergeData = (result) => {
  const { SalesSummaryDetails } = result
  // const trimmedData = SalesSummaryDetails.slice(0, 200)
  const groupedByDoctor = SalesSummaryDetails.reduce((grouped, data, index) => {
    const currentData = { ...data, salesDate: data.salesDate || todayDate }
    if (grouped[currentData.doctorName] === undefined) {
      return {
        ...grouped,
        [currentData.doctorName]: [
          {
            ...currentData,
            [currentData.category.toLowerCase()]: currentData.amount,
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
        [currentData.category.toLowerCase()]: currentData.amount,
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
              [currentData.category.toLowerCase()]: currentData.amount,
            },
          ],
    }
  }, {})

  console.log({ groupedByDoctor })
  const mergedData = Object.keys(groupedByDoctor).map((key) => [
    ...groupedByDoctor[key],
  ])
  return mergedData
}

const reportID = 3
const fileName = 'Sales Summary'

const SalesSummary = ({ values, validateForm }) => {
  const [
    state,
    dispatch,
  ] = useReducer(reducer, initialState)

  const handleActivePanelChange = (event, panel) =>
    dispatch({
      type: 'setActivePanel',
      payload: state.activePanel === panel.key ? -1 : panel.key,
    })
  const asyncGetData = async () => {
    dispatch({
      type: 'toggleLoading',
    })
    // const result = await getRawData(reportID, values)

    // if (result) {
    //   dispatch({
    //     type: 'updateState',
    //     payload: {
    //       activePanel: 0,
    //       loaded: true,
    //       isLoading: false,
    //       salesSummaryData: result.SalesSummaryDetails.map(
    //         (item, index) => ({
    //           ...item,
    //           id: `salesSummary-${index}`,
    //         }),
    //         ),
    //       },
    //     })
    //   } else {
    //     dispatch({
    //       type: 'updateState',
    //       payload: {
    //         loaded: false,
    //         isLoading: false,
    //       },
    //     })
    //   }
    const result = dummyData
    if (result) {
      dispatch({
        type: 'updateState',
        payload: {
          activePanel: 0,
          loaded: true,
          isLoading: false,
          salesSummaryData: mergeData(result),
          dynamicColumns: [
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
          ],
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

  console.log({ dummyData })

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
              height='auto'
              data={state.salesSummaryData}
              columns={state.dynamicColumns}
              grouping={[
                { columnName: 'doctorName' },
              ]}
              columnExtensions={[
                {
                  columnName: 'salesDate',
                  render: (row) => moment(row.salesDate).format(dateFormatLong),
                },
              ]}
            />
            {/* <Accordion
              active={state.activePanel}
              onChange={handleActivePanelChange}
              leftIcon
              expandIcon={<SolidExpandMore fontSize='large' />}
              collapses={Object.keys(state.salesSummaryData).map((key) => ({
                title: <AccordionTitle title={key} />,
                content: (
                  <ReportDataGrid
                    height='auto'
                    data={state.salesSummaryData[key]}
                    columns={state.dynamicColumns}
                    grouping={[
                      { columnName: 'doctorName' },
                    ]}
                    columnExtensions={[
                      {
                        columnName: 'salesDate',
                        render: (row) =>
                          moment(row.salesDate).format(dateFormatLong),
                      },
                    ]}
                  />
                ),
              }))
              //   [
              //   {
              //     title: <AccordionTitle title='Patient Listing Summary' />,
              //     content: (
              //       <ReportDataGrid
              //         height={500}
              //         data={state.salesSummaryData}
              //         columns={state.dynamicColumns}
              //       />
              //     ),
              //   },
              // ]
              }
            /> */}
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
