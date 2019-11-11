import React, { useEffect, useReducer } from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import { Accordion, CardContainer, GridContainer, GridItem } from '@/components'
// sub components
import FilterBar from './FilterBar'
import ReportLayoutWrapper from '../ReportLayout'
import { ReportDataGrid, AccordionTitle } from '@/components/_medisys'
// services
import { getRawData } from '@/services/report'

const DiagnosisDetailsColumns = [
  // { name: 'groupName', title: 'Group Name' },
  { name: 'diagnosisCode', title: 'Diagnosis Code' },
  { name: 'diagnosisName', title: 'Diagnosis Name' },
  { name: 'patientCount', title: 'Patients' },
  { name: 'visitCount', title: 'Visits' },
]

const initialState = {
  loaded: false,
  isLoading: false,
  activePanel: -1,
  diagnosisDetailsData: {},
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

const reportID = 6
const fileName = 'Diagnosis Trending'

const DiagnosisTrending = ({ values, validateForm }) => {
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
      const groupedData = result.DiagnosisDetails.reduce(
        (grouped, data, index) =>
          grouped[data.groupName] === undefined
            ? {
              ...grouped,
              [data.groupName]: [
                { ...data, id: `${data.groupName}-${index}` },
              ],
            }
            : {
              ...grouped,
              [data.groupName]: [
                ...grouped[data.groupName],
                { ...data, id: `${data.groupName}-${index}` },
              ],
            },
        {},
      )

      dispatch({
        type: 'updateState',
        payload: {
          activePanel: 0,
          loaded: true,
          isLoading: false,
          diagnosisDetailsData: groupedData,
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
              collapses={Object.keys(state.diagnosisDetailsData).map((key) => ({
                title: <AccordionTitle title={key} />,
                content: (
                  <ReportDataGrid
                    height='auto'
                    data={state.diagnosisDetailsData[key]}
                    columns={DiagnosisDetailsColumns}
                  />
                ),
              }))}
            />
          </ReportLayoutWrapper>
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
}

const DiagnosisTrendingWithFormik = withFormik({
  validationSchema: Yup.object().shape(
    {
      // patientCriteria: Yup.string().required(),
    },
  ),
  mapPropsToValues: () => ({
    listingFrom: moment(new Date()).startOf('month').toDate(),
    listingTo: moment(new Date()).endOf('month').toDate(),
    viewBy: 'monthly',
  }),
})(DiagnosisTrending)

export default DiagnosisTrendingWithFormik
