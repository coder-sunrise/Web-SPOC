import React from 'react'
import moment from 'moment'
import { connect } from 'dva'
import * as Yup from 'yup'
// custom type
import TimeSchemaType from './YupTime'
// formik
import { FastField, Field, withFormik } from 'formik'
// common component
import {
  Button,
  CardContainer,
  CodeSelect,
  GridContainer,
  GridItem,
  TimePicker,
  CommonModal,
  Select,
  TextField,
} from '@/components'
// component
import { ReportViewer } from '@/components/_medisys'

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
              name='start'
              render={(args) => (
                <TextField
                  {...args}
                  label='Start'
                  // format='hh:mm A'
                  // inputProps={{ maxLength: 5 }}
                  maxLength={5}
                />
              )}
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
