import React, { Component } from 'react'
// dva
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
import ArrowLeft from '@material-ui/icons/ArrowBack'
import Save from '@material-ui/icons/Save'
// common components
import { Button, GridContainer, withFormikExtend } from '@/components'
import { LoadingWrapper } from '@/components/_medisys'
// utils
import { INVOICE_VIEW_MODE } from '@/utils/constants'
import { roundTo, navigateDirtyCheck } from '@/utils/utils'
import ApplyClaims from '@/pages/Billing/refactored/newApplyClaims'
import { constructPayload } from '@/pages/Billing/utils'
// services
import { validateInvoicePayer } from '../../services/appliedScheme'

const styles = (theme) => ({
  cardContainer: {
    margin: theme.spacing(1),
    marginTop: 20,
  },
  errorPromptContainer: {
    textAlign: 'center',
    '& p': {
      fontSize: '1rem',
    },
  },
})

@connect(
  ({ global, patient, loading, codetable, invoiceDetail, appliedSchemes }) => ({
    invoiceDetail,
    appliedSchemes,
    commitCount: global.commitCount,
    patient: patient.entity || patient.default,
    ctcopayer: codetable.ctcopayer || [],
    ctservice: codetable.ctservice || [],
    ctcopaymentscheme: codetable.copaymentscheme || [],
    ctschemetype: codetable.ctschemetype || [],
    loading: loading.effects['appliedSchemes/fetchInvoicePayers'],
  }),
)
@withFormikExtend({
  notDirtyDuration: 3,
  displayName: 'AppliedSchemeForm',
  enableReinitialize: true,
  mapPropsToValues: ({ appliedSchemes }) => {
    try {
      if (appliedSchemes.entity) {
        const { invoicePayer = [], visitPurposeFK } = appliedSchemes.entity

        const finalClaim = invoicePayer.reduce(
          (totalClaim, payer) =>
            totalClaim +
            payer.invoicePayerItem.reduce(
              (subtotal, item) => subtotal + item.claimAmount,
              0,
            ),
          0,
        )
        const finalPayable = roundTo(
          appliedSchemes.entity.invoice.totalAftGst - finalClaim,
        )
        const values = {
          ...appliedSchemes.default,
          ...appliedSchemes.entity,
          invoice: {
            ...appliedSchemes.entity.invoice,
          },
          finalClaim,
          finalPayable,
          visitId: appliedSchemes.entity.visitId,
          visitPurposeFK,
          mode: 'save',
          visitStatus: null,
        }

        return values
      }
    } catch (error) {}
    return { ...appliedSchemes.default, visitId: appliedSchemes.visitID }
  },
})
class AppliedScheme extends Component {
  state = {
    submitCount: 0,
    isEditing: false,
    loadInvoicePayer: false,
  }

  componentWillMount() {
    const { dispatch, invoiceDetail } = this.props
    const { entity } = invoiceDetail
    dispatch({
      type: 'appliedSchemes/fetchInvoicePayers',
      payload: {
        id: entity.id,
        invoiceVersionNo: entity.invoiceVersionNo,
      },
    }).then(() => {
      this.setState({ loadInvoicePayer: true })
    })
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'appliedSchemes/updateState',
      payload: {
        entity: null,
      },
    })
  }

  switchMode = () => {
    this.props.dispatch({
      type: 'invoiceDetail/updateState',
      payload: {
        mode: INVOICE_VIEW_MODE.DEFAULT,
      },
    })
  }

  handleBackToDetailsClick = () =>
    navigateDirtyCheck({ onProceed: this.switchMode })

  handleIsEditing = editing => {
    this.setState({ isEditing: editing })
  }

  handleResetClick = async () => {
    const { dispatch, invoiceDetail } = this.props
    const { entity } = invoiceDetail

    const result = await dispatch({
      type: 'appliedSchemes/fetchInvoicePayers',
      payload: {
        id: entity.id,
        invoiceVersionNo: entity.invoiceVersionNo,
      },
    })
    setTimeout(() => {
      this.setState(preState => ({ submitCount: preState.submitCount + 1 }))
    }, 500)
    return result
  }

  handleSaveClick = async () => {
    const { dispatch, classes, values, invoiceDetail } = this.props
    const payload = {
      ...constructPayload(values),
      invoiceId: invoiceDetail.entity.id,
    }

    const onConfirm = () => {
      dispatch({
        type: 'appliedSchemes/saveAppliedScheme',
        payload,
      })
    }

    const editedInvoicePayer = payload.invoicePayer.filter(ip => !!ip.id) || []
    const shouldValidate = editedInvoicePayer.length > 0

    let result = {}

    if (shouldValidate)
      result = await validateInvoicePayer({
        invoiceFK: invoiceDetail.entity.id,
        invoicePayerFKs: editedInvoicePayer.map(ip => ip.id),
      })

    const { data, status } = result

    if (status === '200' && data.content && data.content.length > 0) {
      dispatch({
        type: 'global/updateAppState',
        payload: {
          openConfirm: true,
          openConfirmContent:
            'This invoice has been included in one or more company/co-payer statement(s)',
          onConfirmSave: onConfirm,
          confirmText: 'Confirm to proceed?',
          additionalInfo: (
            <div className={classes.errorPromptContainer}>
              {data.content.map(message => (
                <p>{message}</p>
              ))}
            </div>
          ),
        },
      })
    } else {
      onConfirm()
    }
  }

  render() {
    const {
      classes,
      dispatch,
      commitCount,
      values,
      setFieldValue,
      setValues,
      patient,
      ctcopayer,
      ctschemetype,
      ctcopaymentscheme,
      ctservice,
      loading = false,
    } = this.props
    const { submitCount } = this.state
    const formikBag = {
      values,
      setFieldValue,
      setValues,
    }
    const commonProps = {
      patient,
      ctschemetype,
      ctcopaymentscheme,
      ctcopayer,
      ctservice,
    }

    return (
      <div className={classes.cardContainer}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <Button
            size='sm'
            color='primary'
            onClick={navigateDirtyCheck({ onProceed: this.switchMode })}
          >
            <ArrowLeft />
            Back To Invoice Details
          </Button>
          <Button
            size='sm'
            color='primary'
            onClick={this.handleSaveClick}
            disabled={!this.state.loadInvoicePayer}
          >
            <Save />
            Save Changes
          </Button>
        </div>
        <LoadingWrapper
          loading={loading}
          text='Loading Applied Schemes...'
          linear
        >
          <GridContainer>
            <ApplyClaims
              handleIsEditing={this.handleIsEditing}
              onResetClick={this.handleResetClick}
              submitCount={submitCount}
              dispatch={dispatch}
              commitCount={commitCount}
              ctservice={ctservice}
              patient={patient}
              ctcopayer={ctcopayer}
              {...formikBag}
              {...commonProps}
              noExtraOptions
            />
          </GridContainer>
        </LoadingWrapper>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'InvoiceDetailsComp' })(AppliedScheme)
