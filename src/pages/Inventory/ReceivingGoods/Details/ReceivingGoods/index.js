import React, { Component } from 'react'
import moment from 'moment'
import { history, formatMessage } from 'umi'
import _ from 'lodash'
import { withStyles } from '@material-ui/core'

import Yup from '@/utils/yup'
import Warining from '@material-ui/icons/Error'
import {
  withFormikExtend,
  GridContainer,
  GridItem,
  ProgressButton,
  CommonModal,
  notification,
} from '@/components'
import { ReportViewer } from '@/components/_medisys'
import { rgType } from '@/utils/codes'
import { INVOICE_STATUS, RECEIVING_GOODS_STATUS } from '@/utils/constants'
import AuthorizedContext from '@/components/Context/Authorized'
import Authorized from '@/utils/Authorized'
import AmountSummary from '@/pages/Shared/AmountSummary'
import { roundTo } from '@/utils/utils'
import {
  rgSubmitAction,
  getReceivingGoodsStatusFK,
  getAccessRight,
} from '../../variables'
import RGGrid from './RGGrid'
import RGForm from './RGForm'

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

@withFormikExtend({
  authority: [
    'receivinggoods.newreceivinggoods',
    'receivinggoods.receivinggoodsdetails',
  ],
  displayName: 'receivingGoodsDetails',
  enableReinitialize: true,
  mapPropsToValues: ({ receivingGoodsDetails }) => {
    return {
      ...receivingGoodsDetails,
    }
  },
  validationSchema: Yup.object().shape({
    receivingGoods: Yup.object().shape({
      supplierFK: Yup.string().required(),
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
  }

  componentDidMount() {
    this.getrgata()
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'receivingGoodsDetails/updateState',
      payload: {
        receivingGoods: {},
        rows: [],
      },
    })
  }

  getrgata = createdId => {
    const { receivingGoodsDetails } = this.props
    const { id, type } = receivingGoodsDetails
    switch (type) {
      // Duplicate order
      case 'dup':
        if (createdId) {
          history.push(
            `/inventory/rg/rgdetails?id=${createdId}&&type=${'edit'}`,
          )
          this.props.dispatch({
            type: 'receivingGoodsDetails/queryReceivingGoods',
            payload: { id: createdId, type: 'edit' },
          })
        } else {
          this.props.dispatch({
            type: 'receivingGoodsDetails/duplicateReceivingGoods',
            payload: { id, type },
          })
        }
        break
      // Edit order
      case 'edit':
        this.props.dispatch({
          type: 'receivingGoodsDetails/queryReceivingGoods',
          payload: { id, type },
        })
        break
      // Create new order
      default:
        if (createdId && type === 'new') {
          history.push(
            `/inventory/rg/rgdetails?id=${createdId}&&type=${'edit'}`,
          )
          this.props.dispatch({
            type: 'receivingGoodsDetails/queryReceivingGoods',
            payload: { id: createdId, type: 'edit' },
          })
        } else {
          this.props.dispatch({
            type: 'receivingGoodsDetails/initializeReceivingGoods',
          })
        }

        break
    }
  }

  onSubmitButtonClicked = async action => {
    const { dispatch, validateForm, history, values } = this.props
    await dispatch({
      type: 'receivingGoodsDetails/updateState',
      payload: {
        ...values,
      },
    })
    let dispatchType = 'receivingGoodsDetails/saveRG'
    let processedPayload = {}
    const isFormValid = await validateForm()
    let validation = false
    if (!_.isEmpty(isFormValid)) {
      validation = false
      this.props.handleSubmit()
    } else {
      const submit = () => {
        dispatch({
          type: dispatchType,
          payload: {
            ...processedPayload,
          },
        }).then(r => {
          if (r) {
            if (
              action === rgSubmitAction.SAVE ||
              action === rgSubmitAction.COMPLETE
            ) {
              let message = 'Receiving Goods saved'
              if (action === rgSubmitAction.COMPLETE) {
                message = 'Receiving Goods completed'
              }
              notification.success({
                message,
              })
            }

            if (getAccessRight()) {
              const { id } = r
              this.getrgata(id)
            } else {
              history.push('/inventory/rg')
            }
          }
        })
        validation = true
        return validation
      }

      const openConfirmationModal = (
        statusCode,
        content,
        confirmText,
        cancelText,
      ) => {
        processedPayload = this.processSubmitPayload(statusCode)
        if (
          action === rgSubmitAction.COMPLETE &&
          processedPayload.totalAfterAdj < 0
        ) {
          window.g_app._store.dispatch({
            type: 'global/updateAppState',
            payload: {
              openConfirm: true,
              isInformType: true,
              customWidth: 'md',
              openConfirmContent: () => {
                return (
                  <div>
                    <Warining
                      style={{
                        width: '1.3rem',
                        height: '1.3rem',
                        marginLeft: '10px',
                        color: 'red',
                      }}
                    />
                    <h3 style={{ marginLeft: '10px', display: 'inline-block' }}>
                      Unable to complete, total amount cannot be{' '}
                      <span style={{ fontWeight: 400 }}>negative</span>.
                    </h3>
                  </div>
                )
              },
              openConfirmText: 'OK',
              onConfirmClose: () => {
                window.g_app._store.dispatch({
                  type: 'global/updateAppState',
                  payload: {
                    customWidth: undefined,
                  },
                })
              },
            },
          })
          return
        }
        dispatch({
          type: 'global/updateAppState',
          payload: {
            openConfirm: true,
            openConfirmContent: content,
            onConfirmSave: async () => {
              await submit()
              if (statusCode === RECEIVING_GOODS_STATUS.CANCELLED) {
                history.push('/inventory/rg')
              }
            },
            openConfirmText: confirmText,
            cancelText,
          },
        })
      }

      switch (action) {
        case rgSubmitAction.SAVE:
          processedPayload = this.processSubmitPayload(
            RECEIVING_GOODS_STATUS.DRAFT,
          )
          break
        case rgSubmitAction.CANCEL:
          openConfirmationModal(
            RECEIVING_GOODS_STATUS.CANCELLED,
            `Cancel receiving goods ${values.receivingGoods.receivingGoodsNo}?`,
            'YES',
            'NO',
          )
          return true
        case rgSubmitAction.COMPLETE:
          openConfirmationModal(
            RECEIVING_GOODS_STATUS.COMPLETED,
            `Complete this receiving goods?`,
            'YES',
            'NO',
          )
          return true
        case rgSubmitAction.UNLOCK:
          dispatchType = 'receivingGoodsDetails/unlockReceivingGoods'
          openConfirmationModal(
            RECEIVING_GOODS_STATUS.DRAFT,
            `Unlock receiving goods ${values.receivingGoods.receivingGoodsNo}?`,
            'YES',
            'NO',
          )
          return true
        default:
      }

      submit()
    }
    return validation
  }

  processSubmitPayload = receivingGoodsStatusFK => {
    const { receivingGoodsDetails, values } = this.props
    const { type } = receivingGoodsDetails
    const {
      receivingGoods,
      rows,
      receivingGoodsAdjustment: rgAdjustment,
    } = values
    let receivingGoodsItem = []
    let newReceivingGoodsStatusFK = receivingGoodsStatusFK
    let newRgAdjustment

    if (type === 'new') {
      if (receivingGoodsStatusFK === RECEIVING_GOODS_STATUS.COMPLETED) {
        newReceivingGoodsStatusFK = receivingGoodsStatusFK
      } else {
        newReceivingGoodsStatusFK = RECEIVING_GOODS_STATUS.DRAFT
      }
      receivingGoodsItem = rows
        .filter(item => !item.isDeleted)
        .map(x => {
          const itemType = rgType.find(y => y.value === x.type)
          return {
            isDeleted: x.isDeleted || false,
            inventoryItemTypeFK: itemType.value,
            orderQuantity: x.orderQuantity,
            bonusReceived: x.bonusReceived,
            quantityReceived: x.quantityReceived,
            totalReceived: x.totalReceived,
            totalPrice: x.totalPrice,
            totalAfterGST: roundTo(x.totalAfterGst),
            totalAfterAdjustments: roundTo(x.totalAfterAdjustments),
            unitPrice: x.unitPrice,
            sortOrder: x.sortOrder,
            IsACPUpdated: false,
            unitOfMeasurement: x.unitOfMeasurement,
            batchNo: x.batchNo,
            expiryDate: x.expiryDate,
            [itemType.prop]: {
              [itemType.itemFKName]: x.code,
              [itemType.itemCode]: x.codeString,
              [itemType.itemName]: x.nameString,
            },
          }
        })
    } else if (type === 'dup') {
      if (receivingGoodsStatusFK === RECEIVING_GOODS_STATUS.COMPLETED) {
        newReceivingGoodsStatusFK = receivingGoodsStatusFK
      } else {
        newReceivingGoodsStatusFK = RECEIVING_GOODS_STATUS.DRAFT
      }
      delete receivingGoods.id
      delete receivingGoods.concurrencyToken

      newRgAdjustment = rgAdjustment.map(adj => {
        delete adj.id
        delete adj.concurrencyToken
        delete adj.receivingGoodsFK
        return adj
      })
      receivingGoodsItem = rows
        .filter(item => !item.isDeleted)
        .map(x => {
          const itemType = rgType.find(y => y.value === x.type)
          return {
            inventoryItemTypeFK: itemType.value,
            orderQuantity: x.orderQuantity,
            bonusReceived: x.bonusReceived,
            quantityReceived: x.quantityReceived,
            totalReceived: x.totalReceived,
            totalPrice: x.totalPrice,
            unitPrice: x.unitPrice,
            totalAfterGST: roundTo(x.totalAfterGst),
            totalAfterAdjustments: roundTo(x.totalAfterAdjustments),
            sortOrder: x.sortOrder,
            IsACPUpdated: false,
            unitOfMeasurement: x.unitOfMeasurement,
            batchNo: x.batchNo,
            expiryDate: x.expiryDate,
            [itemType.prop]: {
              [itemType.itemFKName]: x[itemType.itemFKName],
              [itemType.itemCode]: x.codeString,
              [itemType.itemName]: x.nameString,
            },
          }
        })
    } else {
      newReceivingGoodsStatusFK = receivingGoodsStatusFK
      receivingGoodsItem = rows
        .filter(item => !item.isNew || !item.isDeleted)
        .map(x => {
          const itemType = rgType.find(y => y.value === x.type)
          let result = {}

          if (x.isNew && !x.isDeleted) {
            result = {
              isDeleted: x.isDeleted || false,
              inventoryItemTypeFK: itemType.value,
              orderQuantity: x.orderQuantity,
              bonusReceived: x.bonusReceived,
              quantityReceived: x.quantityReceived,
              totalReceived: x.totalReceived,
              totalPrice: x.totalPrice,
              unitPrice: x.unitPrice,
              totalAfterGST: roundTo(x.totalAfterGst),
              totalAfterAdjustments: roundTo(x.totalAfterAdjustments),
              sortOrder: x.sortOrder,
              IsACPUpdated: false,
              unitOfMeasurement: x.unitOfMeasurement,
              batchNo: x.batchNo,
              expiryDate: x.expiryDate,
              [itemType.prop]: {
                [itemType.itemFKName]: x[itemType.itemFKName],
                [itemType.itemCode]: x.codeString,
                [itemType.itemName]: x.nameString,
              },
            }
          } else if (!x.isDeleted) {
            result = {
              ...x,
              totalAfterGST: roundTo(x.totalAfterGst),
              totalAfterAdjustments: roundTo(x.totalAfterAdjustments),
              [itemType.prop]: {
                ...x[itemType.prop],
                [itemType.itemFKName]: x[itemType.itemFKName],
                [itemType.itemCode]: x.codeString,
                [itemType.itemName]: x.nameString,
              },
            }
          } else {
            result = {
              ...x,
              totalAfterGST: roundTo(x.totalAfterGst),
              totalAfterAdjustments: roundTo(x.totalAfterAdjustments),
            }
          }
          return result
        })
    }
    return {
      ...receivingGoods,
      receivingGoodsStatusFK: newReceivingGoodsStatusFK,
      receivingGoodsStatusCode: getReceivingGoodsStatusFK(
        newReceivingGoodsStatusFK,
      ).code,
      receivingGoodsItem,
      receivingGoodsAdjustment: newRgAdjustment || [
        ...rgAdjustment.map(adj => {
          if (adj.isNew) {
            delete adj.id
          }
          return adj
        }),
      ],
    }
  }

  toggleReport = () => {
    this.setState(preState => ({
      showReport: !preState.showReport,
    }))
  }

  isEditable = (rgStatus, isClosed, isWriteOff, rgItem) => {
    if (
      (rgItem && (rgStatus === RECEIVING_GOODS_STATUS.CANCELLED || isClosed)) ||
      rgStatus !== RECEIVING_GOODS_STATUS.DRAFT ||
      isWriteOff
    )
      return false
    return true
  }

  getRights = (type, rgStatus, isClosed, isWriteOff) => {
    const authorityUrl =
      type === 'new'
        ? 'receivinggoods.newreceivinggoods'
        : 'receivinggoods.receivinggoodsdetails'
    if (
      !getAccessRight(authorityUrl) ||
      (getAccessRight(authorityUrl) &&
        !this.isEditable(rgStatus, isClosed, isWriteOff))
    )
      return 'disable'
    return 'enable'
  }

  render() {
    const { values, setFieldValue, errors, classes, setValues } = this.props
    const { receivingGoods: rg, type } = values
    const rgStatus = rg ? rg.receivingGoodsStatusFK : 0
    const {
      receivingGoods,
      rows = [],
      receivingGoodsPayment = [],
      receivingGoodsAdjustment = [],
    } = values
    const {
      isGSTEnabled,
      isGSTInclusive,
      gstValue,
      isClosed,
      closedByUser,
      closeDate,
      createByUser,
      createDate,
      cancellationDate,
      updateByUser,
    } = receivingGoods || {}
    const isWriteOff = rg
      ? rg.invoiceStatusFK === INVOICE_STATUS.WRITEOFF
      : false

    const isCompletedOrCancelled = rgStatus === 2 || rg.isClosed
    const currentGSTValue = isGSTEnabled ? gstValue : undefined

    return (
      <div>
        <AuthorizedContext.Provider
          value={{
            rights: this.isEditable(rgStatus, isClosed, isWriteOff)
              ? 'enable'
              : 'disable',
          }}
        >
          <RGForm
            isReadOnly={
              this.getRights(type, rgStatus, isClosed, isWriteOff) === 'disable'
            }
            isDisableSupplier={
              rgStatus === RECEIVING_GOODS_STATUS.CANCELLED ||
              isClosed ||
              isWriteOff
            }
            setFieldValue={setFieldValue}
            isCompletedOrCancelled={isCompletedOrCancelled}
            {...this.props}
          />
          {errors.rows && (
            <p className={classes.errorMsgStyle}>{errors.rows}</p>
          )}
          <RGGrid
            isEditable={this.isEditable(
              rgStatus,
              isClosed,
              isWriteOff,
              'rgItem',
            )}
            {...this.props}
          />
          <GridContainer>
            <GridItem xs={2} md={6} />
            <GridItem xs={10} md={6}>
              <div style={{ paddingRight: 100 }}>
                <AuthorizedContext.Provider
                  value={{
                    rights:
                      rgStatus === RECEIVING_GOODS_STATUS.CANCELLED ||
                      isClosed ||
                      isWriteOff
                        ? 'disable'
                        : 'enable',
                  }}
                >
                  <AmountSummary
                    adjustments={receivingGoodsAdjustment}
                    rows={rows}
                    config={{
                      isGSTInclusive,
                      itemFkField: 'receivingGoodsItemFK',
                      itemAdjustmentFkField: 'receivingGoodsAdjustmentFK',
                      invoiceItemAdjustmentField:
                        'receivingGoodsItemAdjustment',
                      adjustedField: 'totalAfterAdjustments',
                      totalField: 'totalPrice',
                      gstField: 'totalAfterGst',
                      gstAmtField: 'itemLevelGST',
                      gstValue: currentGSTValue,
                    }}
                    onValueChanged={v => {
                      const newReceivingGoods = {
                        ...values.receivingGoods,
                        totalAmount: v.summary.total,
                        totalAftGST: v.summary.totalWithGST,
                        gstAmount: Math.round(v.summary.gst * 100) / 100,
                        isGSTInclusive: !!v.summary.isGSTInclusive,
                        totalAfterAdj: v.summary.totalAfterAdj,
                        adjustmentAmount: _.sumBy(
                          (v.adjustments || []).filter(p => !p.isDeleted),
                          'adjAmount',
                        ),
                      }
                      setValues({
                        ...values,
                        receivingGoods: newReceivingGoods,
                        receivingGoodsAdjustment: v.adjustments.map(a => {
                          return {
                            sequence: a.index + 1,
                            ...a,
                          }
                        }),
                      })
                    }}
                  />
                </AuthorizedContext.Provider>
              </div>
            </GridItem>
          </GridContainer>
          <GridContainer xs={4} md={4}>
            <GridItem>
              <div>
                {type === 'edit' && (
                  <div>
                    {`Created by ${createByUser} on ${moment(createDate).format(
                      'DD MMM YYYY hh:mm:ss A',
                    )}`}
                  </div>
                )}
                {isClosed && (
                  <div>
                    {`Completed by ${closedByUser} on ${moment(
                      closeDate,
                    ).format('DD MMM YYYY hh:mm:ss A')}`}
                  </div>
                )}
                {rgStatus === 2 && (
                  <div>
                    {`Cancelled by ${updateByUser} on ${moment(
                      cancellationDate,
                    ).format('DD MMM YYYY hh:mm:ss A')}`}
                  </div>
                )}
              </div>
            </GridItem>
          </GridContainer>

          <GridContainer
            xs={12}
            md={12}
            style={{
              marginTop: 20,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <div>
              {rgStatus === RECEIVING_GOODS_STATUS.DRAFT &&
                !rg.isClosed &&
                type === 'edit' && (
                  <ProgressButton
                    color='danger'
                    icon={null}
                    authority='none'
                    onClick={() =>
                      this.onSubmitButtonClicked(rgSubmitAction.CANCEL)
                    }
                  >
                    {formatMessage({
                      id: 'inventory.rg.detail.rgd.cancelrg',
                    })}
                  </ProgressButton>
                )}

              {rgStatus === RECEIVING_GOODS_STATUS.DRAFT && !rg.isClosed && (
                <ProgressButton
                  color='primary'
                  icon={null}
                  onClick={() =>
                    this.onSubmitButtonClicked(rgSubmitAction.SAVE)
                  }
                >
                  {formatMessage({
                    id: 'inventory.rg.detail.rgd.save',
                  })}
                </ProgressButton>
              )}
              {rgStatus === RECEIVING_GOODS_STATUS.DRAFT && (
                <ProgressButton
                  color='success'
                  icon={null}
                  disabled={rows.find(
                    item => !item.isDeleted && item.totalReceived <= 0,
                  )}
                  onClick={() =>
                    this.onSubmitButtonClicked(rgSubmitAction.COMPLETE)
                  }
                >
                  {formatMessage({
                    id: 'inventory.rg.detail.rgd.complete',
                  })}
                </ProgressButton>
              )}
              {rgStatus === RECEIVING_GOODS_STATUS.COMPLETED && (
                <Authorized authority='receivinggoods.unlockreceivinggoods'>
                  <ProgressButton
                    color='success'
                    icon={null}
                    authority='none'
                    disabled={
                      isWriteOff ||
                      receivingGoodsPayment.find(
                        rgp => !rgp.clinicPaymentDto.isCancelled,
                      )
                    }
                    onClick={() =>
                      this.onSubmitButtonClicked(rgSubmitAction.UNLOCK)
                    }
                  >
                    {formatMessage({
                      id: 'inventory.rg.detail.rgd.unlock',
                    })}
                  </ProgressButton>
                </Authorized>
              )}
            </div>

            <ProgressButton
              color='info'
              icon={null}
              onClick={this.toggleReport}
              authority='none'
              disabled={!values.id || type === 'dup'}
            >
              {formatMessage({
                id: 'inventory.rg.detail.print',
              })}
            </ProgressButton>
          </GridContainer>
        </AuthorizedContext.Provider>
        <CommonModal
          open={this.state.showReport}
          onClose={this.toggleReport}
          title='Receiving Goods'
          maxWidth='lg'
        >
          <ReportViewer
            reportID={65}
            reportParameters={{
              ReceivingGoodsId: values ? values.id : '',
            }}
          />
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Index)
