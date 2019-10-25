import React, { PureComponent } from 'react'
import { FormattedMessage } from 'umi/locale'
import {
  MenuList,
  Popper,
  Paper,
  Grow,
  ClickAwayListener,
  MenuItem,
} from '@material-ui/core'
import { INVENTORY_TYPE } from '@/utils/constants'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  Checkbox,
  Select,
  ProgressButton,
  DateRangePicker,
  Field,
} from '@/components'
import { inventoryAdjustmentStatus } from '@/utils/codes'

@withFormikExtend({
  mapPropsToValues: ({ inventoryAdjustment }) =>
    inventoryAdjustment.filter || {},
  handleSubmit: () => {},
  displayName: 'InventoryAdjustmentFilter',
})
class Filter extends PureComponent {
  state = {
    open: false,
  }

  handleToggle = () => {
    this.setState((prev) => {
      return { open: !prev.open }
    })
  }

  handleMassAdjustment = async (e) => {
    this.handleToggle()
    const { inventoryAdjustment } = this.props
    const result = await this.props.dispatch({
      type: 'inventoryAdjustment/getStockDetails',
      payload: {
        id: e,
      },
    })

    this.props.dispatch({
      type: 'inventoryAdjustment/updateState',
      payload: {
        entity: undefined,
        // showModal: !inventoryAdjustment.showModal,
        default: {
          ...inventoryAdjustment.default,
          stockList: result.data,
        },
      },
    })

    this.props.toggleModal()
  }

  render () {
    const { classes, values } = this.props
    const { open } = this.state
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={2}>
            <FastField
              name='transactionNo'
              render={(args) => {
                return <TextField label='Transaction No' {...args} />
              }}
            />
          </GridItem>

          <GridItem xs={6} md={5}>
            <Field
              name='transDates'
              render={(args) => {
                return (
                  <DateRangePicker
                    label='Transaction From Date'
                    label2='To Date'
                    disabled={values.allDate}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>

          <GridItem xs={6} md={2}>
            <Field
              name='allDate'
              render={(args) => {
                return <Checkbox inputLabel='' label='All Date' {...args} />
              }}
            />
          </GridItem>

          <GridItem xs={6} md={2}>
            <FastField
              name='status'
              render={(args) => {
                return (
                  <Select
                    label='Status'
                    options={inventoryAdjustmentStatus}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={6}>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={null}
                onClick={() => {
                  const { transactionNo, status, transDates, allDate } = values

                  let fromDate
                  let toDate

                  if (!allDate) {
                    if (transDates) {
                      const [
                        from,
                        to,
                      ] = transDates
                      fromDate = from
                      toDate = to
                    }
                  }

                  this.props.dispatch({
                    type: 'inventoryAdjustment/query',
                    payload: {
                      adjustmentTransactionNo: transactionNo,
                      inventoryAdjustmentStatusFK: status,
                      lgteql_adjustmentTransactionDate: fromDate,
                      lsteql_adjustmentTransactionDate: toDate,
                    },
                  })
                }}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <ProgressButton
                color='primary'
                onClick={() => {
                  const { inventoryAdjustment } = this.props
                  this.props.dispatch({
                    type: 'inventoryAdjustment/updateState',
                    payload: {
                      entity: undefined,
                      default: {
                        ...inventoryAdjustment.default,
                        stockList: undefined,
                      },
                    },
                  })
                  this.props.toggleModal()
                }}
              >
                Add New
              </ProgressButton>
              <ProgressButton
                color='primary'
                icon={null}
                onClick={this.handleToggle}
                buttonRef={(node) => {
                  this.anchorElAccount = node
                }}
              >
                Mass Adjustment
              </ProgressButton>
              <Popper
                open={open}
                anchorEl={this.anchorElAccount}
                transition
                disablePortal
                placement='bottom-end'
                style={{
                  zIndex: 1,
                  width: 185,
                  left: -63,
                }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    id='menu-list'
                    style={{ transformOrigin: '0 0 -30' }}
                  >
                    <Paper className={classes.dropdown}>
                      <ClickAwayListener onClickAway={this.handleToggle}>
                        <MenuList role='menu'>
                          <MenuItem
                            onClick={() => this.handleMassAdjustment(1)}
                          >
                            Medication
                          </MenuItem>
                          <MenuItem
                            onClick={() => this.handleMassAdjustment(2)}
                          >
                            Consumable
                          </MenuItem>
                          <MenuItem
                            onClick={() => this.handleMassAdjustment(3)}
                          >
                            Vaccination
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default Filter
