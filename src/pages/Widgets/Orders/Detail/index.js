import React, { PureComponent } from 'react'
import classnames from 'classnames'
import { Divider, withStyles } from '@material-ui/core'
import _ from 'lodash'
import { orderTypes } from '@/utils/codes'
import { VISIT_TYPE } from '@/utils/constants'
import {
  Button,
  GridContainer,
  GridItem,
  notification,
  Tabs,
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
  state = {
    disableEdit: false,
  }

  footerBtns = ({ onSave, onReset, showAdjustment = true }) => {
    const { classes, orders } = this.props
    // console.log(this.props)
    const { entity } = orders
    return (
      <React.Fragment>
        <Divider />

        <div className={classnames(classes.footer)}>
          {showAdjustment && (
            <Button
              color='primary'
              style={{ float: 'left' }}
              disabled={this.state.disableEdit}
              onClick={this.showAdjustment}
            >
              {currencySymbol} Adjustment
            </Button>
          )}
          {/* {!!entity && (
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
          )} */}
          <Button
            color='danger'
            onClick={() => {
              if (entity) {
                this.props.dispatch({
                  type: 'orders/updateState',
                  payload: {
                    entity: undefined,
                  },
                })
              } else {
                onReset()
              }
            }}
          >
            Discard
          </Button>
          <Button color='primary' onClick={onSave}>
            {!entity ? 'Add' : 'Save'}
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
            initialAmout: this.props.orders.entity.totalPrice, // for item level need inital amount
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

  setDisable = (value) => {
    this.setState({
      disableEdit: value,
    })
  }

  getNextSequence = () => {
    const { orders: { rows } } = this.props

    const allDocs = rows.filter((s) => !s.isDeleted)
    let nextSequence = 1
    if (allDocs && allDocs.length > 0) {
      const { sequence } = _.maxBy(allDocs, 'sequence')
      nextSequence = sequence + 1
    }
    return nextSequence
  }

  render () {
    const { props } = this
    const { classes, orders, dispatch, fromDispense } = props
    const { type } = orders

    const cfg = {
      disableEdit: this.state.disableEdit,
      setDisable: this.setDisable,
      footer: this.footerBtns,
      currentType: orderTypes.find((o) => o.value === type),
      orderTypes,
      getNextSequence: this.getNextSequence,
      ...props,
    }

    let orderTypeArray = orderTypes
    if (fromDispense) {
      orderTypeArray = orderTypes.filter(
        (o) => o.value !== '2' && o.value !== '6',
      )
    }
    return (
      <div>
        <div className={classes.detail}>
          <GridContainer>
            <GridItem xs={12}>
              <Tabs
                activeKey={type}
                options={orderTypeArray.map((o) => {
                  return {
                    id: o.value,
                    name: o.name,
                    content: o.component({
                      ...cfg,
                      type: o.value,
                    }),
                  }
                })}
                tabStyle={{}}
                onChange={(key) => {
                  dispatch({
                    type: 'orders/updateState',
                    payload: {
                      entity: undefined,
                      type: key,
                    },
                  })
                }}
              />
            </GridItem>
          </GridContainer>
          {/* <div>
            {type === '1' && <Medication {...cfg} />}
            {type === '2' && <Vaccination {...cfg} />}
            {type === '3' && <Service {...cfg} />}
            {type === '4' && <Consumable {...cfg} />}
            {type === '5' && <Medication {...cfg} openPrescription />}
            {type === '6' && <Package {...cfg} />}
          </div> */}
        </div>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(Details)
