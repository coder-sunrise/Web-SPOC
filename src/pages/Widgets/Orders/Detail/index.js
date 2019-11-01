import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
import {
  Divider,
  CircularProgress,
  Paper,
  withStyles,
  IconButton,
} from '@material-ui/core'
import Yup from '@/utils/yup'
import { orderTypes } from '@/utils/codes'

import {
  withFormikExtend,
  FastField,
  Button,
  CommonHeader,
  CommonModal,
  NavPills,
  PictureUpload,
  GridContainer,
  GridItem,
  TextField,
  notification,
  Select,
  CodeSelect,
  DatePicker,
  RadioGroup,
  ProgressButton,
  CardContainer,
  confirm,
  Checkbox,
  SizeContainer,
  RichEditor,
} from '@/components'
import { currencySymbol } from '@/utils/config'

import Medication from './Medication'
import Vaccination from './Vaccination'
import Service from './Service'
import Consumable from './Consumable'
import Package from './Package'
// import Others from './Others'

const styles = (theme) => ({
  editor: {
    marginTop: theme.spacing(1),
    position: 'relative',
  },
  editorBtn: {
    position: 'absolute',
    right: 0,
    top: 4,
  },
  detail: {
    margin: `${theme.spacing(1)}px 0px`,
    border: '1px solid #ccc',
    borderRadius: 3,
    padding: `${theme.spacing(1)}px 0px`,
  },
  footer: {
    textAlign: 'right',
    padding: theme.spacing(1),
    paddingBottom: 0,
  },
})

class Details extends PureComponent {
  state = {}

  footerBtns = ({ onSave, showAdjustment = true }) => {
    const { classes, orders } = this.props
    const { entity } = orders
    return (
      <React.Fragment>
        <Divider />

        <div className={classnames(classes.footer)}>
          {showAdjustment && (
            <Button
              link
              style={{ float: 'left' }}
              disabled
              onClick={this.showAdjustment}
            >
              {currencySymbol} Adjustment
            </Button>
          )}
          {!!entity && (
            <Button
              color='danger'
              onClick={() => {
                this.props.dispatch({
                  type: 'orders/updateState',
                  payload: {
                    entity: undefined,
                    // adjustment: undefined,
                    // totalAfterAdj: undefined,
                  },
                })
              }}
            >
              New
            </Button>
          )}
          {!entity && (
            <Button
              color='danger'
              onClick={() => {
                this.props.dispatch({
                  type: 'orders/updateState',
                  payload: {
                    type: undefined,
                  },
                })
              }}
            >
              Discard
            </Button>
          )}
          <Button color='primary' onClick={onSave}>
            Save
          </Button>
        </div>
      </React.Fragment>
    )
  }

  _show = () => {
    if (
      !this.props.orders.entity ||
      (this.props.orders.entity.total < 0 &&
        this.props.orders.entity.totalPrice < 0)
    ) {
      notification.warn({
        message: 'Invalid total price',
      })
      return
    }
    this.props.dispatch({
      type: 'global/updateState',
      payload: {
        openAdjustment: true,
        openAdjustmentConfig: {
          callbackConfig: {
            model: 'orders',
            reducer: 'adjustAmount',
          },
          // showRemark: true,
          defaultValues: {
            ...this.props.orders.entity,
            initialAmout:
              this.props.orders.entity.total ||
              this.props.orders.entity.totalPrice,
          },
        },
      },
    })
  }

  showAdjustment = () => {
    this.props.dispatch({
      type: 'orders/updateState',
      payload: {
        shouldPushToState: true,
      },
    })
    setTimeout(() => {
      this._show()
    }, 1)
  }

  render () {
    const { props, state } = this
    const {
      theme,
      classes,
      orders,
      values,
      rowHeight,
      footer,
      dispatch,
    } = props
    const { type, entity } = orders
    // console.log(values)

    const cfg = {
      footer: this.footerBtns,
      currentType: orderTypes.find((o) => o.value === type),
      type,
      ...props,
    }

    return (
      <div>
        <div className={classes.detail}>
          <GridContainer>
            <GridItem xs={6}>
              <Select
                label='Type'
                options={orderTypes}
                allowClear={false}
                value={type}
                disabled={!!entity}
                onChange={(v) => {
                  dispatch({
                    type: 'orders/updateState',
                    payload: {
                      type: v,
                    },
                  })
                }}
              />
            </GridItem>
          </GridContainer>
          <div>
            {type === '1' && <Medication {...cfg} />}
            {type === '2' && <Vaccination {...cfg} />}
            {type === '3' && <Service {...cfg} />}
            {type === '4' && <Consumable {...cfg} />}
            {type === '5' && <Medication {...cfg} openPrescription />}
            {type === '6' && <Package {...cfg} />}
          </div>
        </div>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(Details)
