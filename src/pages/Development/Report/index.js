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
  GridContainer,
  GridItem,
  TimePicker,
  CommonModal,
  CodeSelect,
  Select,
} from '@/components'
// component
import ReportViewer from './ReportViewer'
// common
import { queryList } from '@/services/common'

@connect(({ codetable }) => ({ codetable }))
@withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({
    start: '14:00',
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

  // viewReport = () => {
  //   this.setState({ showReport: true })
  // }

  // closeModal = () => {
  //   this.setState({ showReport: false })
  // }

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
    console.log({ values: this.props.values })
    return (
      <CardContainer hideHeader size='sm'>
        {/* <Button color='primary&#39;' onClick={this.viewReport}>
          View Report
        </Button>
        <Button color='primary&#39;' onClick={this.getCodeTable}>
          Get Codetable
        </Button>
        <Button color='primary&#39;' onClick={this.testWatch}>
          Test Watch
        </Button>
        <CommonModal
          open={showReport}
          onClose={this.closeModal}
          title='Report'
          maxWidth='lg'
        >
          <ReportViewer />
        </CommonModal> */}
        <Button onClick={this.validate} color='primary'>
          Submit
        </Button>
        <GridContainer>
          <GridItem md={3}>
            <FastField
              name='start'
              render={(args) => (
                <TimePicker {...args} label='Start' format='hh:mm A' />
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
          <GridItem md={3}>
            <Field
              name='doctorProfileFK'
              render={(args) => (
                <Select
                  label='Doctor Profile'
                  // code='doctorprofile'
                  // useCustomUrl
                  query={(value) => {
                    return queryList('/api/doctorprofile', {
                      doctorMCRNo: value,
                      // 'clinicianInfomation.name': value,
                    })
                  }}
                  renderDropdown={(option) => {
                    return (
                      <div>
                        <p>MCR No.: {option.doctorMCRNo}</p>
                        <p>
                          {`${option.clinicianInfomation.title} ${option
                            .clinicianInfomation.name}`}
                        </p>
                      </div>
                    )
                  }}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <Field
              name='doctorProfile'
              render={(args) => (
                <CodeSelect
                  label='Doctor Profile Codetable'
                  code='doctorprofile'
                  labelField='clinicianInfomation.name'
                  renderDropdown={(option) => (
                    <div>
                      <p>MCR No.: {option.doctorMCRNo}</p>
                      <p>
                        {`${option.clinicianInfomation.title} ${option
                          .clinicianInfomation.name}`}
                      </p>
                    </div>
                  )}
                  {...args}
                />
              )}
            />
          </GridItem>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default Report
