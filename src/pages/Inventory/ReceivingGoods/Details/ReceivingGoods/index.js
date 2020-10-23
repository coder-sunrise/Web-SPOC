import React, { Component } from 'react'
import moment from 'moment'
import router from 'umi/router'
import _ from 'lodash'
import { withStyles } from '@material-ui/core'
import { formatMessage } from 'umi/locale'
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
import { rgType } from '@/utils/codes'
import { INVOICE_STATUS, RECEIVING_GOODS_STATUS } from '@/utils/constants'
import AuthorizedContext from '@/components/Context/Authorized'
import AmountSummary from '@/pages/Shared/AmountSummary'
import { roundTo } from '@/utils/utils'
import {
  rgSubmitAction,
  getReceivingGoodsStatusFK,
  getAccessRight,
} from '../../variables'
import RGGrid from './RGGrid'
import RGForm from './RGForm'

const styles = (theme) => ({
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
      rows: (receivingGoodsDetails.rows || []).map((o) => {
        return {
          ...o,
          isClosed: receivingGoodsDetails.receivingGoods.isClosed,
        }
      }),
    }
  },
  validationSchema: Yup.object().shape({
    receivingGoods: Yup.object().shape({
      supplierFK: Yup.string().required(),
      receivingGoodsDate: Yup.date().required(),
    }),
    rows: Yup.array()
      .compact((x) => x.isDeleted)
      .required('At least one item is required.'),
  }),
  handleSubmit: () => {},
})
class Index extends Component {
  state = {
    showReport: false,
  }

  componentDidMount () {
    this.getrgata()
  }

  componentWillUnmount () {
    this.props.dispatch({
      type: 'receivingGoodsDetails/updateState',
      payload: {},
    })
  }

  getrgata = (createdId) => {
    const { receivingGoodsDetails } = this.props
    const { id, type } = receivingGoodsDetails
    switch (type) {
      // Duplicate order
      case 'dup':
        if (createdId) {
          router.push(`/inventory/rg/rgdetails?id=${createdId}&&type=${'edit'}`)
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
          router.push(`/inventory/rg/rgdetails?id=${createdId}&&type=${'edit'}`)
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

  onSubmitButtonClicked = async (action) => {
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
        }).then((r) => {
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
              router.push('/inventory/rg')
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
        dispatch({
          type: 'global/updateAppState',
          payload: {
            openConfirm: true,
            openConfirmContent: content,
            onConfirmSave: async () => {
              processedPayload = this.processSubmitPayload(false, statusCode)
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
          processedPayload = this.processSubmitPayload(true)
          break
        case rgSubmitAction.CANCEL:
          openConfirmationModal(
            RECEIVING_GOODS_STATUS.CANCELLED,
            `Are you sure to cancel receiving goods ${values.receivingGoods
              .receivingGoodsNo}?`,
            'YES',
            'NO',
          )
          return true
        case rgSubmitAction.COMPLETE:
          openConfirmationModal(
            RECEIVING_GOODS_STATUS.COMPLETED,
            `Are you sure to complete receiving goods ${values.receivingGoods
              .receivingGoodsNo}?`,
            'YES',
            'NO',
          )
          return true
        case rgSubmitAction.UNLOCK:
          dispatchType = 'receivingGoodsDetails/unlockReceivingGoods'
          openConfirmationModal(
            RECEIVING_GOODS_STATUS.DRAFT,
            `Are you sure to unlock receiving goods ${values.receivingGoods
              .receivingGoodsNo}?`,
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

  processSubmitPayload = (isSaveAction = false, receivingGoodsStatusFK) => {
    const { receivingGoodsDetails, values } = this.props
    const { type } = receivingGoodsDetails
    const { receivingGoods, rows } = values
    let receivingGoodsItem = []
    let newReceivingGoodsStatusFK = receivingGoodsStatusFK

    if (type === 'new') {
      newReceivingGoodsStatusFK = RECEIVING_GOODS_STATUS.DRAFT
      receivingGoodsItem = rows.map((x) => {
        const itemType = rgType.find((y) => y.value === x.type)
        return {
          isDeleted: x.isDeleted || false,
          inventoryItemTypeFK: itemType.value,
          orderQuantity: x.orderQuantity,
          bonusReceived: x.bonusReceived,
          quantityReceived: x.quantityReceived,
          totalReceived: x.totalReceived,
          totalPrice: x.totalPrice,
          totalAfterGST: roundTo(x.totalAfterGST),
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
      newReceivingGoodsStatusFK = RECEIVING_GOODS_STATUS.DRAFT
      delete receivingGoods.id
      delete receivingGoods.concurrencyToken

      receivingGoodsItem = rows.map((x) => {
        const itemType = rgType.find((y) => y.value === x.type)
        return {
          inventoryItemTypeFK: itemType.value,
          orderQuantity: x.orderQuantity,
          bonusReceived: x.bonusReceived,
          quantityReceived: x.quantityReceived,
          totalReceived: x.totalReceived,
          totalPrice: x.totalPrice,
          unitPrice: x.unitPrice,
          totalAfterGST: roundTo(x.totalAfterGST),
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
      if (!isSaveAction) {
        newReceivingGoodsStatusFK = receivingGoodsStatusFK
      } else if (receivingGoodsStatusFK === RECEIVING_GOODS_STATUS.COMPLETED) {
        newReceivingGoodsStatusFK = receivingGoodsStatusFK
      } else {
        newReceivingGoodsStatusFK = receivingGoods.receivingGoodsStatusFK
      }

      receivingGoodsItem = rows.map((x) => {
        const itemType = rgType.find((y) => y.value === x.type)
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
            totalAfterGST: roundTo(x.totalAfterGST),
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
        } else {
          result = {
            ...x,
            [itemType.prop]: {
              ...x[itemType.prop],
              [itemType.itemFKName]: x[itemType.itemFKName],
              [itemType.itemCode]: x.codeString,
              [itemType.itemName]: x.nameString,
            },
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
    }
  }

  toggleReport = () => {
    this.setState((preState) => ({
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

  render () {
    const { values, setFieldValue, errors, classes, setValues } = this.props
    const { receivingGoods: rg, type } = values
    const rgStatus = rg ? rg.receivingGoodsStatusFK : 0
    const { receivingGoods, rows, receivingGoodsPayment = [] } = values
    const {
      isGSTEnabled,
      isGSTInclusive,
      gstValue,
      isClosed,
      closedByUser,
      closeDate,
      createByUser,
      createDate,
    } =
      receivingGoods || false
    const isWriteOff = rg
      ? rg.invoiceStatusFK === INVOICE_STATUS.WRITEOFF
      : false

    const isCompletedOrCancelled = rgStatus === 2 || rg.isClosed
    const currentGSTValue = isGSTEnabled ? gstValue : undefined

    return (
      <GridContainer>
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
            <GridItem xs={2} md={8} />
            <GridItem xs={10} md={4}>
              <div style={{ paddingRight: 22 }}>
                <AmountSummary
                  showAdjustment={false}
                  adjustments={[]}
                  rows={rows}
                  config={{
                    isGSTInclusive,
                    itemFkField: 'receivingGoodsItemFK',
                    totalField: 'totalPrice',
                    gstField: 'totalAfterGST',
                    gstValue: currentGSTValue,
                  }}
                  onValueChanged={(v) => {
                    const newReceivingGoods = {
                      ...values.receivingGoods,
                      totalAmount: v.summary.total,
                      totalAftGST: v.summary.totalWithGST,
                      gstAmount: Math.round(v.summary.gst * 100) / 100,
                      isGSTInclusive: !!v.summary.isGSTInclusive,
                    }
                    setValues({
                      ...values,
                      receivingGoods: newReceivingGoods,
                    })
                  }}
                />
              </div>
            </GridItem>
          </GridContainer>
          <GridContainer xs={4} md={4}>
            <GridItem>
              <div>
                <div>
                  {`Created by ${createByUser} on ${moment(createDate).format(
                    'DD MMM YYYY HH:mm',
                  )}`}
                </div>
                {isClosed && (
                  <div>
                    {`Completed by ${closedByUser} on ${moment(
                      closeDate,
                    ).format('DD MMM YYYY HH:mm')}`}
                  </div>
                )}
              </div>
            </GridItem>
          </GridContainer>

          <GridContainer
            xs={8}
            md={8}
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
                    this.onSubmitButtonClicked(rgSubmitAction.CANCEL)}
                >
                  {formatMessage({
                    id: 'inventory.rg.detail.rgd.cancelrg',
                  })}
                </ProgressButton>
              )}

              {rgStatus === RECEIVING_GOODS_STATUS.DRAFT &&
              !rg.isClosed && (
                <ProgressButton
                  color='primary'
                  icon={null}
                  onClick={() =>
                    this.onSubmitButtonClicked(rgSubmitAction.SAVE)}
                >
                  {formatMessage({
                    id: 'inventory.rg.detail.rgd.save',
                  })}
                </ProgressButton>
              )}
              {rgStatus === RECEIVING_GOODS_STATUS.DRAFT &&
              type === 'edit' && (
                <ProgressButton
                  color='success'
                  icon={null}
                  authority='none'
                  onClick={() =>
                    this.onSubmitButtonClicked(rgSubmitAction.COMPLETE)}
                >
                  {formatMessage({
                    id: 'inventory.rg.detail.rgd.complete',
                  })}
                </ProgressButton>
              )}
              {rgStatus === RECEIVING_GOODS_STATUS.COMPLETED && (
                <ProgressButton
                  color='success'
                  icon={null}
                  authority='none'
                  disabled={
                    isWriteOff ||
                    receivingGoodsPayment.find(
                      (rgp) => !rgp.clinicPaymentDto.isCancelled,
                    )
                  }
                  onClick={() =>
                    this.onSubmitButtonClicked(rgSubmitAction.UNLOCK)}
                >
                  {formatMessage({
                    id: 'inventory.rg.detail.rgd.unlock',
                  })}
                </ProgressButton>
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
      </GridContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Index)
