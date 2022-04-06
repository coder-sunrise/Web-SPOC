import React, { Component, Fragment } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { history, formatMessage } from 'umi'
import _ from 'lodash'
import { withStyles } from '@material-ui/core'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  GridContainer,
  GridItem,
  ProgressButton,
  CommonModal,
  notification,
} from '@/components'
import { ReportViewer } from '@/components/_medisys'
import { podoOrderType } from '@/utils/codes'
import { navigateDirtyCheck } from '@/utils/utils'
import AuthorizedContext from '@/components/Context/Authorized'
import Authorized from '@/utils/Authorized'
import Warining from '@material-ui/icons/Error'
import {
  prSubmitAction,
  getAccessRight,
  PURCHASE_REQUEST_STATUS,
} from '../variables'
import PRGrid from './PRGrid'
import PRForm from './PRForm'

const styles = theme => ({
  errorMsgStyle: {
    margin: theme.spacing(2),
    color: '#cf1322',
    fontSize: ' 0.75rem',
    minHeight: '1em',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 400,
    lineHeight: '1em',
    letterSpacing: ' 0.03333em',
  },
})

@connect(({ purchaseRequestDetails }) => ({
  purchaseRequestDetails,
}))
@withFormikExtend({
  authority: [
    'purchasingrequest.createpurchasingrequest',
    'purchasingrequest.modifypurchasingrequest',
    'inventort/purchaserequest',
  ],
  displayName: 'purchaseRequestDetails',
  enableReinitialize: true,
  mapPropsToValues: ({ purchaseRequestDetails }) => {
    return {
      ...purchaseRequestDetails,
    }
  },
  validationSchema: Yup.object().shape({
    purchaseRequest: Yup.object().shape({
      purchaseRequestDate: Yup.date().required(),
    }),
    rows: Yup.array()
      .compact(x => x.isDeleted)
      .required('At least one item is required.'),
  }),
  handleSubmit: () => {},
})
class Index extends Component {
  state = {
    showReport: false,
    selectedRowId: 0,
  }
  componentDidMount() {
    this.getData()
  }

  componentWillUnmount() {
    const { dispatch } = window.g_app._store
    dispatch({
      type: 'purchaseRequestDetails/initializePurchaseRequest',
    })
  }

  getData = prid => {
    const { purchaseRequestDetails } = this.props
    const { id, type } = purchaseRequestDetails
    const { dispatch } = window.g_app._store

    switch (type) {
      // Edit order
      case 'edit':
        dispatch({
          type: 'purchaseRequestDetails/queryPurchaseRequest',
          payload: { id, type },
        })
        break
      // Create new order
      default:
        if (prid && type === 'new') {
          history.push(
            `/inventory/purchaserequest/details?id=${prid}&&type=${'edit'}`,
          )
          dispatch({
            type: 'purchaseRequestDetails/queryPurchaseRequest',
            payload: { id: prid, type: 'edit' },
          })
        } else {
          dispatch({
            type: 'purchaseRequestDetails/initializepurchaseRequest',
          })
        }
        break
    }
  }

  getRights = (type, editable) => {
    const authorityUrl =
      type === 'new'
        ? 'purchasingrequest.createpurchasingrequest'
        : 'purchasingrequest.modifypurchasingrequest'

    return getAccessRight(authorityUrl) && editable ? 'enable' : 'disable'
  }

  onSubmitButtonClicked = async action => {
    const { validateForm, history, values, handleSubmit } = this.props
    const { dispatch } = window.g_app._store
    let dispatchType = 'purchaseRequestDetails/savePR'
    let payload = {}
    const isFormValid = await validateForm()
    let validation = false
    if (!_.isEmpty(isFormValid)) {
      validation = false
      handleSubmit()
    } else {
      const submit = () => {
        dispatch({
          type: dispatchType,
          payload: {
            ...payload,
          },
        }).then(r => {
          if (r) {
            if (action === prSubmitAction.SAVE) {
              notification.success({ message: 'PR saved' })
              history.push('/inventory/purchaserequest')
            } else if (action === prSubmitAction.SUBMITTED) {
              notification.success({ message: 'PR submitted' })
              if (getAccessRight()) {
                this.getData(r.id)
              }
            }
          }
        })
        validation = true
        return validation
      }

      payload = this.savePayload(action)
      submit()
    }
    return validation
  }

  savePayload = action => {
    const { purchaseRequestDetails, values } = this.props
    const { type } = purchaseRequestDetails
    const { purchaseRequest, rows } = values
    let purchaseRequestStatusFK =
      action != PURCHASE_REQUEST_STATUS.SUBMITTED
        ? PURCHASE_REQUEST_STATUS.DRAFT
        : action
    let purchaseRequestItem = rows.map(x => {
      const itemType = podoOrderType.find(y => y.value === x.type)
      let result = {}
      if (x.isNew && !x.isDeleted) {
        result = {
          isDeleted: x.isDeleted || false,
          qty: x.qty,
          sortOrder: x.sortOrder,
          uom: x.uomString,
          itemTypeFK: itemType.value,
          itemFK: x.itemFK,
          itemCode: x.codeString,
          itemName: x.nameString,
        }
      } else {
        result = {
          ...x,
          uom: x.uomString,
        }
      }
      return result
    })
    return {
      ...purchaseRequest,
      purchaseRequestStatusFK,
      purchaseRequestItem,
    }
  }

  onDeleteRow = row => {
    const { dispatch } = window.g_app._store
    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmContent: `Confirm to delete ${row.purchaseRequestNo} ?`,
        openConfirmText: 'Confirm',
        onConfirmSave: () => {
          dispatch({
            type: 'purchaseRequestDetails/deletePR',
            payload: { id: row.id },
          }).then(r => {
            notification.success({ message: 'PR cancelled' })
            history.push('/inventory/purchaserequest')
          })
        },
      },
    })
  }

  printPRReport = rowId => {
    this.setState({ selectedRowId: rowId })
    this.toggleReport()
  }

  toggleReport = () => {
    this.setState(preState => ({
      showReport: !preState?.showReport,
    }))
  }

  render() {
    const { purchaseRequestDetails, values, errors, classes } = this.props
    const { purchaseRequest: originPR, type } = purchaseRequestDetails
    const { purchaseRequest, rows } = values

    const modifyAR = getAccessRight('purchasingrequest.modifypurchasingrequest')
    const createAR = getAccessRight('purchasingrequest.createpurchasingrequest')
    const unsubmit =
      originPR.purchaseRequestStatusFK != PURCHASE_REQUEST_STATUS.SUBMITTED
    const isEditMode = originPR.id
    const editable = modifyAR && unsubmit && isEditMode
    const creatable = createAR && !isEditMode
    const isReadOnly = !editable && !creatable

    return (
      <div>
        <PRForm {...this.props} isReadOnly={isReadOnly} />
        {/* <AuthorizedContext.Provider
          value={{ rights: this.getRights(type, editable) }}
        > */}
        <div>
          {errors.rows && (
            <p className={classes.errorMsgStyle}>{errors.rows}</p>
          )}
          <PRGrid
            {...this.props}
            propertyChange={() => {
              this.setState({ isDirty: true })
            }}
            isEditable={!isReadOnly}
          />
        </div>
        {/* </AuthorizedContext.Provider> */}
        <GridContainer
          style={{
            marginTop: 20,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div>
            {(creatable || !unsubmit) && (
              <ProgressButton
                authority='none'
                color='danger'
                icon={null}
                onClick={() => {
                  if (this.state.isDirty) {
                    this.props.dispatch({
                      type: 'global/updateAppState',
                      payload: {
                        openConfirm: true,
                        openConfirmContent: formatMessage({
                          id: 'app.general.leave-without-save',
                        }),
                        onConfirmSave: () =>
                          history.push('/inventory/purchaserequest'),
                      },
                    })
                  } else history.push('/inventory/purchaserequest')
                }}
              >
                {formatMessage({
                  id: 'inventory.purchaserequest.detail.close',
                })}
              </ProgressButton>
            )}
            {editable && unsubmit && (
              <ProgressButton
                color='danger'
                icon={null}
                onClick={() => this.onDeleteRow(originPR)}
              >
                {formatMessage({
                  id: 'inventory.purchaserequest.detail.delete',
                })}
              </ProgressButton>
            )}
            {(creatable || editable) && unsubmit && (
              <ProgressButton
                color='primary'
                // icon={null}
                onClick={() => this.onSubmitButtonClicked(prSubmitAction.SAVE)}
              >
                {formatMessage({
                  id: 'inventory.purchaserequest.detail.save',
                })}
              </ProgressButton>
            )}
            {(creatable || editable) && unsubmit && (
              <ProgressButton
                color='success'
                icon={null}
                onClick={() =>
                  this.onSubmitButtonClicked(prSubmitAction.SUBMITTED)
                }
              >
                {formatMessage({
                  id: 'inventory.purchaserequest.detail.submit',
                })}
              </ProgressButton>
            )}
            {isEditMode && (
              <ProgressButton
                color='primary'
                icon={null}
                onClick={() => this.printPRReport(originPR.id)}
              >
                {formatMessage({
                  id: 'inventory.purchaserequest.detail.print',
                })}
              </ProgressButton>
            )}
          </div>
        </GridContainer>
        <CommonModal
          open={this.state.showReport}
          onClose={this.toggleReport}
          title='Purchase Request'
          maxWidth='lg'
        >
          <ReportViewer
            reportID={91}
            reportParameters={{
              PurchaseRequestId: this.state.selectedRowId,
            }}
          />
        </CommonModal>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(Index)
