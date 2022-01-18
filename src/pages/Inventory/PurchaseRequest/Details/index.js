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
import AuthorizedContext from '@/components/Context/Authorized'
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
  authority: ['inventory/purchasingrequest'],
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
  componentDidMount() {
    this.getData()
  }

  getData = prid => {
    const { dispatch } = window.g_app._store
    let {
      history: {
        location: {
          query: { id, type },
        },
      },
    } = this.props
    if (prid) {
      id = prid
      type = 'edit'
    }
    switch (type) {
      case 'edit':
        dispatch({
          type: 'purchaseRequestDetails/queryPurchaseRequest',
          payload: { id, type },
        })
        break
      default:
        history.push(`/inventory/purchaserequest/details?type=new`)
        break
    }
  }

  getRights = type => {
    const authorityUrl =
      type === 'new'
        ? 'inventory/purchasingrequest'
        : 'inventory/purchasingrequest'

    if (!getAccessRight(authorityUrl)) return 'disable'
    return 'enable'
  }

  onSubmitButtonClicked = async action => {
    const { dispatch, validateForm, history, values, handleSubmit } = this.props
    let dispatchType = 'purchaseRequestDetails/savePR'
    let payload = {}
    const isFormValid = await validateForm()
    let validation = false
    if (!_.isEmpty(isFormValid)) {
      validation = false
      handleSubmit()
    } else {
      const submit = () => {
        window.g_app._store
          .dispatch({
            type: dispatchType,
            payload: {
              ...payload,
            },
          })
          .then(r => {
            if (r) {
              let message = ''
              if (action === prSubmitAction.SAVE) message = 'PR saved'
              else if (action === prSubmitAction.SUBMITTED)
                message = 'PR submitted'
              notification.success({ message })

              if (getAccessRight()) {
                const { id } = r
                this.getData(id)
              } else {
                history.push('/inventory/purchaserequest')
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
    let purchaseRequestStatusFK = action
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
          itemCode: x.codeString,
          itemName: x.nameString,
        }
      } else {
        result = {
          ...x,
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
  render() {
    const { purchaseRequestDetails, values, errors, classes } = this.props
    const { purchaseRequest: pr, type } = purchaseRequestDetails
    const { purchaseRequest, rows } = values
    const isEditable =
      pr.purchaseRequestStatusFK != PURCHASE_REQUEST_STATUS.SUBMITTED
    console.log('details render values', values)
    return (
      <div>
        <PRForm {...this.props} isReadOnly={!isEditable} />
        <AuthorizedContext.Provider value={{ rights: this.getRights(type) }}>
          {errors.rows && (
            <p className={classes.errorMsgStyle}>{errors.rows}</p>
          )}
          <PRGrid {...this.props} isEditable={isEditable} />
        </AuthorizedContext.Provider>
        <AuthorizedContext.Provider
          value={{ rights: this.getRights(type) }}
        ></AuthorizedContext.Provider>
        <GridContainer
          style={{
            marginTop: 20,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div>
            <ProgressButton
              color='primary'
              icon={null}
              onClick={() => this.onSubmitButtonClicked(prSubmitAction.SAVE)}
            >
              {formatMessage({ id: 'inventory.purchaserequest.detail.save' })}
            </ProgressButton>
            <ProgressButton
              color='success'
              icon={null}
              onClick={() =>
                this.onSubmitButtonClicked(prSubmitAction.SUBMITTED)
              }
            >
              {formatMessage({ id: 'inventory.purchaserequest.detail.submit' })}
            </ProgressButton>
          </div>
        </GridContainer>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(Index)
