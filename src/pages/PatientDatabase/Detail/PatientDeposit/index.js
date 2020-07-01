import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import Yup from '@/utils/yup'
import Refresh from '@material-ui/icons/Refresh'
import moment from 'moment'
import {
  GridContainer,
  GridItem,
  CardContainer,
  Card,
  Button,
  notification,
  FastField,
  Field,
  OutlinedTextField,
  withFormikExtend,
  Tooltip,
  RichEditor,
} from '@/components'
import { withStyles, TextField } from '@material-ui/core'
import withWebSocket from '@/components/Decorator/withWebSocket'

import DepositGrid from './DepositGrid'
import FilterBar from './FilterBar'

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 'calc(100vh - 110px)',
  },
})

// window.g_app.replaceModel(model)

@connect(({ patient, user }) => ({
  patient,
  user,
}))
class PatientDeposit extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      selectedTypeIds: [
        -99,
      ],
    }
    this.divElement = React.createRef()
    this.hisoryElement = React.createRef()
  }

  componentDidMount () {
    // this.refreshNurseNotes()
    window.addEventListener('resize', this.resize.bind(this))
    setTimeout(() => {
      this.resize()
    }, 10)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize.bind(this))
  }

  refreshNurseNotes = async () => {
    const { dispatch, patient } = this.props
    const refreshResult = await dispatch({
      type: 'patientNurseNotes/query',
      payload: {
        PatientProfileFK: patient.entity.id,
        pagesize: 999,
        sorting: [
          { columnName: 'createDate', direction: 'desc' },
        ],
      },
    })
    return refreshResult
  }

  // eslint-disable-next-line react/sort-comp
  resize () {
    // if (
    //   this.divElement &&
    //   this.divElement.current &&
    //   this.hisoryElement &&
    //   this.hisoryElement.current
    // ) {
    //   const hisotoryHeight = $(this.hisoryElement.current).find('div')[0]
    //     .clientHeight
    //   let currentBox = $(this.divElement.current).find('.rdw-editor-main')[0]
    //   if (currentBox)
    //     currentBox.style.cssText = `height:${hisotoryHeight - 75}px`
    // }
  }

  onEditorChange = (v) => {
    const { dispatch, setFieldValue } = this.props
    setFieldValue('notes', v || '')
  }

  handlePrintReceipt = (row) => {
    console.log(row)
  }

  handleTypeChange = (opt) => {
    this.setState({
      selectedTypeIds:
        !opt || opt.length === 0
          ? [
              -99,
            ]
          : opt,
    })
  }

  render () {
    const { dispatch, user, patient: { deposit } } = this.props
    const { selectedTypeIds } = this.state

    let transactionList = []
    if (deposit && deposit.patientDepositTransaction) {
      const { patientDepositTransaction } = deposit
      transactionList = patientDepositTransaction.filter(
        (f) =>
          selectedTypeIds.includes(f.transactionTypeFK) ||
          selectedTypeIds.includes(-99),
      )
    }
    return (
      <CardContainer hideHeader size='sm'>
        <GridContainer>
          <FilterBar {...this.props} handleTypeChange={this.handleTypeChange} />
        </GridContainer>
        <GridContainer>
          <GridItem md={12}>
            <DepositGrid
              transactionList={transactionList}
              handlePrint={this.handlePrintReceipt}
            />
          </GridItem>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(
  withWebSocket()(PatientDeposit),
)
