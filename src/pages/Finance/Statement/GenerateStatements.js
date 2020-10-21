import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import { FastField } from 'formik'
import { withStyles } from '@material-ui/core'
import _ from 'lodash'
import Yup from '@/utils/yup'

import {
  withFormikExtend,
  notification,
  GridContainer,
  DatePicker,
  GridItem,
  NumberInput,
} from '@/components'

const styles = theme => ({})
const generateStatementSchema = Yup.object().shape({
  statementDate: Yup.date().required(),
  paymentTerms: Yup.number().required(),
})
@connect(({ statement }) => ({
  statement,
}))
@withFormikExtend({
  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm } = props
    const {
      statementDate,
      paymentTerms,
      invoiceDateFrom,
      invoiceDateTo } = values
    dispatch({
      type: 'statement/autoGenerateStatement',
      payload: {
        statementDate,
        paymentTerms,
        invoiceDateFrom,
        invoiceDateTo,
      },
    }).then((r) => {
      if (r) {
        if (onConfirm) {
          console.log(onConfirm)
          onConfirm()
        }
        notification.success({ message: 'Auto generate statement has been queued.' })
      }
    })
  },
  validationSchema: generateStatementSchema,
  displayName: 'generateStatements',
})
class GenerateStatements extends PureComponent {
  state = {}

  handleCommitChanges = ({ rows }) => {
    const { setFieldValue } = this.props
    setFieldValue('rows', rows)
  }

  componentDidMount = () => {
  }

  generateStatement = async () => {
    const { validateForm } = this.props
    let validation = false
    const isFormValid = validateForm()
    if (!_.isEmpty(isFormValid)) {
      validation = false
    } else {
      this.props.handleSubmit()
      validation = true
    }
    return validation
  }

  render () {
    const { props } = this
    const {
      footer,
      handleSubmit,
    } = props
    return (
      <React.Fragment>
        <GridContainer>
          <GridItem md={6}>
            <FastField
              name='statementDate'
              render={(args) => (
                <DatePicker label='Statement Date' {...args} />
              )}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='paymentTerms'
              render={(args) => (
                <NumberInput
                  suffix='Days'
                  qty
                  label={formatMessage({
                    id: 'finance.statement.paymentTerms',
                  })}
                  precision={0}
                  max={999}
                  min={0}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='invoiceDateFrom'
              render={(args) => (
                <DatePicker label='Invoice From Date' {...args} />
              )}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='invoiceDateTo'
              render={(args) => (
                <DatePicker label='Invoice To Date' {...args} />
              )}
            />
          </GridItem>
        </GridContainer>
        {footer &&
          footer({
            onConfirm: handleSubmit,
            confirmBtnText: 'Generate',
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(GenerateStatements)
