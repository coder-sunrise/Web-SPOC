import React from 'react'
import { connect } from 'dva'
import * as Yup from 'yup'
// custom type
import { withFormik } from 'formik'
import AttachMoney from '@material-ui/icons/AttachMoney'
import { withStyles } from '@material-ui/core'
// formik
// common component
import {
  Button,
  CardContainer,
  GridContainer,
  GridItem,
  NumberInput,
  CommonModal,
} from '@/components'
import { DiagnosisSelect } from '@/components/_medisys'
// component
import EndSessionSummary from '@/pages/Report/SessionSummary/Details/index'
import { rounding } from '@/components/_medisys/AddPayment/utils'

const styles = (theme) => ({
  money: {
    width: 16,
    height: 16,
    top: 3,
    position: 'relative',
    color: 'green',
  },
})

@connect(({ codetable, clinicSettings }) => ({
  clinicSettings: clinicSettings.settings || clinicSettings.default,
  codetable,
}))
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
    amount: 0.05,
  }

  toggleReport = () =>
    this.setState((preState) => ({ showReport: !preState.showReport }))

  validate = () => {
    this.props.validateForm()
  }

  showReport = () => {
    this.setState((preState) => ({
      showEndSessionSummary: !preState.showEndSessionSummary,
    }))
  }

  onAmountChange = (event) => {
    const { target } = event
    this.setState({
      amount: target.value,
    })
    const { clinicSettings } = this.props
    const rounded = rounding(clinicSettings, target.value)
    this.setState({
      rounded: rounded,
    })
  }

  render () {
    const { classes } = this.props
    const { showReport, showEndSessionSummary } = this.state
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
        <GridContainer>
          <GridItem md={3}>
            <NumberInput
              currency
              label='Amount'
              value={this.state.amount}
              onChange={this.onAmountChange}
            />
          </GridItem>
          <GridItem md={3}>
            <NumberInput
              currency
              disabled
              label='Amount After Rounding'
              value={this.state.rounded}
            />
          </GridItem>
          <GridItem md={3}>
            <DiagnosisSelect
              prefix={<AttachMoney className={classes.money} />}
            />
          </GridItem>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default withStyles(styles)(Report)
