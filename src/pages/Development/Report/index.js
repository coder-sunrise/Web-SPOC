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

  render () {
    const { showReport } = this.state
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
        {/* <Button color='primary&#39;' onClick={this.toggleReport}>
          View Report
        </Button>
        <Button color='primary&#39;' onClick={this.getCodeTable}>
          Get Codetable
        </Button>
        <Button color='primary&#39;' onClick={this.testWatch}>
          Test Watch
        </Button>
        <CommonModal
          bodyNoPadding
          open={showReport}
          onClose={this.toggleReport}
          title='Report'
          maxWidth='lg'
          // fullScreen
        >
          <ReportViewer />
        </CommonModal>
        <CodeSelect code='clinicianprofile' /> */}
        <Button onClick={this.validate} color='primary'>
          Submit
        </Button>
        <GridContainer>
          <GridItem md={3}>
            <FastField
              name='copaymentschemename'
              render={(args) => (
                <CodeSelect
                  {...args}
                  label='Copayment Scheme name'
                  code='coPaymentScheme'
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <FastField
              name='copaymentschemename'
              render={(args) => (
                <CodeSelect
                  {...args}
                  label='Copayment Scheme name'
                  code='coPaymentScheme'
                  localFilter={(opt) => opt.schemeCategoryName === 'Corporate'}
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <FastField
              name='ctMedicationDosage'
              render={(args) => (
                <CodeSelect
                  {...args}
                  label='Medication dosage'
                  labelField='displayValue'
                  code='ctMedicationDosage'
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <FastField
              name='inventoryMedicationFK'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Name'
                    code='inventorymedication'
                    labelField='displayValue'
                    temp
                    // onChange={this.changeMedication}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>

          <GridItem sm={3}>
            <FastField
              name='doctor'
              render={(args) => (
                <Select
                  mode='tags'
                  maxSelected={1}
                  label='Filter by Doctor (Tags)'
                  onChange={(v) => {
                    console.log(v)
                  }}
                  options={doctors}
                  {...args}
                />
              )}
            />
          </GridItem>

          {/* <GridItem md={3}>
            <FastField
              name='ctMedicationDosage'
              render={(args) => <DoctorProfileSelect />}
            />
          </GridItem> */}
          <GridItem md={3}>
            <FastField
              name='effectiveDates'
              render={(args) => (
                <DateRangePicker
                  {...args}
                  label='Effective Start Date'
                  label2='Effective End Date'
                />
              )}
            />
          </GridItem>
          <GridItem xs md={3}>
            <FastField
              name='dateTo'
              render={(args) => <DatePicker {...args} label='Date from' />}
            />
          </GridItem>
          <GridItem md={3}>
            <FastField
              name='end'
              render={(args) => (
                <TimePicker {...args} label='End' format='hh:mm A' />
              )}
            />
          </GridItem>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default Report
