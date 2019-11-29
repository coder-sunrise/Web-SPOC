import React, { PureComponent } from 'react'
import { connect } from 'dva'
import classNames from 'classnames'
import { formatMessage, FormattedMessage } from 'umi/locale'
import moment from 'moment'
import lodash from 'lodash'
import numeral from 'numeral'
import update from 'immutability-helper'
import * as Yup from 'yup'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import {
  Grid,
  Divider,
  Tooltip,
  Paper,
  InputAdornment,
  ClickAwayListener,
  withStyles,
} from '@material-ui/core'
import { sleep, sumReducer } from '@/utils/utils'
import { getUniqueGUID } from '@/utils/cdrss'

import {
  RadioButtonGroup,
  FormField,
  DatePicker,
  Select,
  notification,
  SimpleModal,
  CommonModal,
  Checkbox,
} from '@/components'
import {
  GridContainer,
  GridItem,
  CustomInput,
  Button,
  Timeline,
} from 'mui-pro-components'

import AddCreditNoteGrid from './AddCreditNoteGrid'

const styles = (theme) => ({
  actionButton: {
    width: '100%',
  },
  actionButtonName: {
    position: 'absolute',
    left: 20,
  },
  actionButtonShortcut: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
    position: 'absolute',
    right: 20,
  },
  amountButton: {
    [theme.breakpoints.up('sm')]: {
      position: 'absolute',
      right: 40,
      top: 13,
      width: '70%',
    },
  },
  container: {
    marginTop: theme.spacing.unit,
    maxHeight: 'calc(100vh - 375px)',
    overflowY: 'auto',
  },
  summaryLabel: {
    paddingTop: 0,
  },
})

@connect(({ addCreditNote }) => ({
  addCreditNote,
}))
@withFormik({
  mapPropsToValues: ({ addCreditNote }) => {
    // console.log(com)
    return addCreditNote.entity
  },
  validationSchema: Yup.object().shape({
    EditingItems: Yup.array().of(
      Yup.object().shape({
        Description: Yup.string().required('Description is required'),
        UnitPrice: Yup.number().required('Unit Price is required'),
      }),
    ),
    // VoidReason: Yup.string().required(),
  }),

  handleSubmit: (values, { props }) => {
    props
      .dispatch({
        type: 'addPayment/submit',
        payload: values,
      })
      .then((r) => {
        if (r.message === 'Ok') {
          // toast.success('test')
          notification.success({
            // duration:0,
            message: 'Done',
          })
          if (props.onConfirm) props.onConfirm()
        }
      })
  },
  displayName: 'AddCreditNote',
})
class AddCreditNote extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  static getDerivedStateFromProps (nextProps, preState) {
    const { values, addCreditNote } = nextProps
    if (addCreditNote.entity) {
      const totalAmount = addCreditNote.entity.Items
        .map((o) => o.Amount)
        .reduce(sumReducer, 0)
      const canSubmit = totalAmount > 0 && addCreditNote.entity.Items.length > 0
      return {
        totalAmount,
        canSubmit,
      }
    }
    return null
  }

  componentDidMount () {
    // window.onkeyup = (e)=>{
    //   let key = e.keyCode ? e.keyCode : e.which
    //   if(e.ctrlKey){
    //     const pt = paymentTypes.find(o=>o.keyCode===key)
    //     const {canSubmit,totalAmount}=this.state
    //     // console.log(pt)
    //     if(pt){
    //       switch (key) {
    //         case 112:
    //         case 113:
    //         case 114:
    //         case 115:
    //         case 116:
    //         this.paymentArrayHelpers.push({
    //           Id:getUniqueGUID(),
    //           Type:pt.name,
    //           Remark:'',
    //           Amount:canSubmit?this.props.values.Outstanding - totalAmount:0,
    //         })
    //           break
    //         default:
    //           break
    //       }
    //     }
    //   }
    // }
  }

  render () {
    // console.log(this)
    const { state, props } = this
    const { theme, classes, footer, isDebitNote, ...resetProps } = props
    const {
      totalAmount,
      balOutstanding,
      cashReceived,
      cashReturn,
      canSubmit,
    } = state
    const rowCfg = {
      container: true,
      justify: 'center',
      spacing: theme.spacing.unit,
    }
    const colCfg = {
      item: true,
      xs: 6,
      sm: true,
    }
    const inptCfg = {
      // disabled: true,
    }
    const summaryCfg = {
      currency: true,
      formControlProps: {
        className: classes.summaryLabel,
      },
    }
    const topSummary = (
      <Paper style={{ padding: theme.spacing.unit }}>
        <GridContainer justify='flex-start'>
          <GridItem xs={3}>
            <GridContainer {...rowCfg} direction='column'>
              <GridItem {...colCfg}>
                <FastField
                  name='Date'
                  render={(args) => (
                    <DatePicker
                      prefix='Date'
                      timeFormat={false}
                      {...inptCfg}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem {...colCfg}>
                <FastField
                  name='NetInvoiceAmount'
                  render={(args) => {
                    return (
                      <CustomInput
                        prefix={isDebitNote ? 'Invoice Amount' : 'Net Amount'}
                        disabled
                        currency
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem {...colCfg}>
                <FastField
                  name='StockInOut'
                  render={(args) => {
                    return (
                      <Checkbox
                        prefix={isDebitNote ? 'Stock Out' : 'Stock In'}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={9}>
            <GridContainer {...rowCfg} direction='column'>
              <GridItem {...colCfg}>
                <FastField
                  name='Remarks'
                  render={(args) => (
                    <CustomInput
                      prefix='Remarks'
                      multiline
                      rowsMax='5'
                      {...inptCfg}
                      {...args}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </Paper>
    )
    return (
      <React.Fragment>
        <div>
          {topSummary}
          <AddCreditNoteGrid isDebitNote={isDebitNote} />
        </div>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmProps: {
              disabled: !canSubmit,
            },
          })}
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(AddCreditNote)
