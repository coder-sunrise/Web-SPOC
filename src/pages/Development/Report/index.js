import React from 'react'
import moment from 'moment'
import { connect } from 'dva'
import * as Yup from 'yup'
// custom type
import { FastField, Field, withFormik } from 'formik'
import TimeSchemaType from './YupTime'
// formik
// common component
import {
  Button,
  CardContainer,
  CodeSelect,
  GridContainer,
  GridItem,
  TimePicker,
  DatePicker,
  DateRangePicker,
  NumberInput,
  CommonModal,
  Select,
  TextField,
} from '@/components'
// component
import { ReportViewer } from '@/components/_medisys'
import EndSessionSummary from '@/pages/Report/SessionSummary/Details/index'

const doctors = [
  { value: 'bao', name: 'Bao' },
  { value: 'cheah', name: 'Cheah' },
]

@connect(({ codetable }) => ({ codetable }))
@withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({
    // start: '14:00',
    end: '13:00',
    doctor: 'bao',
  }),
  validationSchema: Yup.object().shape({
    start: Yup.string().required(),
    end: Yup.string()
      .laterThan(Yup.ref('start'), 'End must be later than Start')
      .required(),
  }),
  handleSubmit: (values, formikBag) => {
    console.log({ values })
  },
})
class Report extends React.Component {
  state = {
    showReport: false,
  }

  componentDidMount () {
    const codeTableNameArray = [
      'ctMedicationUsage',
      'ctMedicationDosage',
      'ctMedicationUnitOfMeasurement',
      'ctMedicationFrequency',
      'ctVaccinationUsage',
      'ctVaccinationUnitOfMeasurement',
    ]

    codeTableNameArray.forEach((o) => {
      this.props.dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: o,
        },
      })
    })
  }

  // componentDidMount () {
  //   const { dispatch } = this.props
  //   dispatch({
  //     type: 'codetable/watchFetchCodes',
  //   })
  // }

  toggleReport = () =>
    this.setState((preState) => ({ showReport: !preState.showReport }))

  // getCodeTable = () => {
  //   const code = 'ctnationality'
  //   const { dispatch } = this.props
  //   dispatch({
  //     type: 'codetable/fetchCodes',
  //     code,
  //   })
  // }

  // testWatch = () => {
  //   const { dispatch } = this.props
  //   dispatch({
  //     type: 'codetable/TEST',
  //   })
  // }

  validate = () => {
    this.props.validateForm()
  }

  showReport = () => {
    this.setState((preState) => ({
      showEndSessionSummary: !preState.showEndSessionSummary,
    }))
  }

  render () {
    const { showReport, showEndSessionSummary } = this.state
    // return (
    //   <CardContainer hideHeader size='sm'>
    //     <Button color='primary&#39;' onClick={this.viewReport}>
    //       View Report
    //     </Button>
    //     <Button color='primary&#39;' onClick={this.getCodeTable}>
    //       Get Codetable
    //     </Button>
    //     <Button color='primary&#39;' onClick={this.testWatch}>
    //       Test Watch
    //     </Button>
    //     <CommonModal
    //       open={showReport}
    //       onClose={this.closeModal}
    //       title='Report'
    //       maxWidth='lg'
    //     >
    //       <ReportViewer />
    //     </CommonModal>
    //   </CardContainer>
    // )
    return (
      <CardContainer hideHeader size='sm'>
        <Button onClick={this.showReport} color='primary'>
          Submit
        </Button>
        <CommonModal
          open={showEndSessionSummary}
          title='Session Summary'
          onClose={this.showReport}
          onConfirm={this.showReport}
          disableBackdropClick
        >
          <EndSessionSummary sessionID={14} />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default Report
