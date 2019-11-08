import React, { useEffect, useReducer } from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import { Accordion, CardContainer, GridContainer, GridItem, DateFormatter } from '@/components'
// sub components
import FilterBar from './FilterBar'
import ReportLayoutWrapper from '../ReportLayout'
import {
  IntegratedSummary,
} from '@devexpress/dx-react-grid'
import {
  Table,
} from '@devexpress/dx-react-grid-material-ui'
import { ReportDataGrid, AccordionTitle } from '@/components/_medisys'

// services
import { getRawData } from '@/services/report'

const PatientListingColumns = [
  { name: 'patientReferenceNo', title: 'Reference No.' },
  { name: 'patientAccountNo', title: 'Acc. No.' },
  { name: 'patientName', title: 'Patient Name' },
  { name: 'doctorName', title: 'Last Visit Doctor' },
  { name: 'lastVisitDate', title: 'Last Visit Date' },
  { name: 'vC_Gender', title: 'Gender' },
  { name: 'vC_AgeInYear', title: 'Age' },
  { name: 'vC_Nationality', title: 'Nationality' },
  { name: 'vC_MobileNo', title: 'Mobile No.' },
  { name: 'vC_EmailAddress', title: 'Email Address' },
  { name: 'startDateTime', title: 'Next Appt.' },
]

const PatientListingColumnsExtensions = [
  { columnName: 'lastVisitDate', type: 'date' },
  {
    columnName: 'startDateTime',
    width: 180,
    render: (row) =>
      DateFormatter({
        value: row.startDateTime,
        full: true,
      }),
  },
]

const initialState = {
  loaded: false,
  isLoading: false,
  activePanel: -1,
  patientListingData: [],
  patientListDetails: [],
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

const reportID = 2
const fileName = 'Patient Listing Report'

const PatientListing = ({ values, validateForm }) => {
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
    const result = await getRawData(reportID, values)

    if (result) {
      dispatch({
        type: 'updateState',
        payload: {
          activePanel: 0,
          loaded: true,
          isLoading: false,
          patientListingData: result.PatientListSummary.map((item, index) => ({
            ...item,
            id: `patientListSummary-${index}-${item.patientReferenceNo}`,
          })),
          patientListDetails: result.PatientListDetails,
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
  const SummaryRow = (p) => {
    const {children}=p 
    let countCol = children.find((c)=>{
      return c.props.tableColumn.column.name === 'patientReferenceNo';
    })
    console.log({countCol})
    if (countCol) {
      const newChildren = [
        {
          ...countCol,
          props: {
            ...countCol.props,
            colSpan: 3,
          },
          key:1111,
        },
      ]
      return <Table.Row {...p}>{newChildren}</Table.Row>
    }
    return <Table.Row {...p}>{children}</Table.Row>
  }

  let FuncProps = {
    pager: false,
    summary: true,
    summaryConfig: {
      state: {
        totalItems: [
          { columnName: 'patientReferenceNo', type: 'patientCount' },
        ],
      },
      integrated: {
        calculator: (type, rows, getValue) => {
          console.log({ type, rows, getValue })
          let patientIds = []
          if (type === 'patientCount') {
            if (rows && rows.length > 0) {
              for (let p of rows) {
                if (!patientIds.includes(p.patientProfileID)) {
                  patientIds.push(p.patientProfileID)
                }
              }
            }
            return patientIds.length;
          }
          return IntegratedSummary.defaultCalculator(type, rows, getValue)
        },
      },
      row: {
        totalRowComponent: SummaryRow,
        messages: {
          patientCount: 'Total Number of Patient',
        },
      },
    },
  }

  if (state.patientListDetails && state.patientListDetails.length > 0 && state.patientListDetails[0].isGroupByDoctor) {
    FuncProps = {
      ...FuncProps,
      summary: true,
      summaryConfig: {
        state: {
          totalItems: [
            { columnName: 'patientReferenceNo', type: 'patientCount' },
          ],
          groupItems: [
            { columnName: 'patientReferenceNo', type: 'groupCount' },
          ],
        },
        integrated: {
          calculator: (type, rows, getValue) => {
            console.log({ type, rows, getValue })
            let patientIds = []
            if (type === 'patientCount' || type === 'groupCount') {
              if (rows && rows.length > 0) {
                for (let p of rows) {
                  if (!patientIds.includes(p.patientProfileID)) {
                    patientIds.push(p.patientProfileID)
                  }
                }
              }
              return patientIds.length;
            }
            return IntegratedSummary.defaultCalculator(type, rows, getValue)
          },
        },
        row: {
          totalRowComponent: SummaryRow,
          groupRowComponent: SummaryRow,
          messages: {
            groupCount: 'Total Number of Patient',
            patientCount: 'Grand Total Number of Patient',
          },
        },
      },
      grouping: true,
      groupingConfig: {
        state: {
          grouping: [
            { columnName: 'doctorName' },
          ],
        },
      },
    }
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
            <Accordion
              active={state.activePanel}
              onChange={handleActivePanelChange}
              leftIcon
              expandIcon={<SolidExpandMore fontSize='large' />}
              collapses={[
                {
                  title: <AccordionTitle title='Patient Listing Summary' />,
                  content: (
                    <ReportDataGrid
                      height={500}
                      data={state.patientListingData}
                      columns={PatientListingColumns}
                      columnExtensions={PatientListingColumnsExtensions}
                      FuncProps={FuncProps}
                    />
                  ),
                },
              ]}
            />
          </ReportLayoutWrapper>
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
}

const PatientListingWithFormik = withFormik({
  validationSchema: Yup.object().shape(
    {
      // patientCriteria: Yup.string().required(),
    },
  ),
  mapPropsToValues: () => ({
    patientCriteria: '',
    dateFrom: moment(new Date()).add(-1, 'year').toDate(),
    dateTo: moment(new Date()).toDate(),
    ageFrom: 0,
    ageTo: 0,
  }),
})(PatientListing)

export default PatientListingWithFormik
