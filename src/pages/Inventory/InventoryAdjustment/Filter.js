import React, { PureComponent } from 'react'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { status } from '@/utils/codes'
import { withStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuList from '@material-ui/core/MenuList'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  Button,
  TextField,
  Checkbox,
  Select,
  ProgressButton,
  DateRangePicker,
  Field,
} from '@/components'

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

  render () {
    const { classes, values } = this.props
    const { open } = this.state
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='code'
              render={(args) => {
                return <TextField label='Transaction No' {...args} />
              }}
            />
          </GridItem>

          <GridItem xs={6} md={3}>
            <Field
              name='effectiveDates'
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

          <GridItem xs={6} md={1}>
            <FastField
              name='allDate'
              render={(args) => {
                return <Checkbox inputLabel='' {...args} />
              }}
            />
          </GridItem>

          <GridItem xs={6} md={3}>
            <FastField
              name='status'
              render={(args) => {
                return (
                  <Select
                    label='Status'
                    options={[
                      { value: 'draft', name: 'Draft' },
                      { value: 'finalized', name: 'Finalized' },
                    ]}
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
                  const { code, isActive } = this.props.values
                  this.props.dispatch({
                    type: 'inventoryAdjustment/query',
                    payload: {
                      code,
                      isActive,
                    },
                  })
                }}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <Button
                color='primary'
                onClick={() => {
                  this.props.dispatch({
                    type: 'inventoryAdjustment/updateState',
                    payload: {
                      entity: undefined,
                    },
                  })
                  this.props.toggleModal()
                }}
              >
                Add New
              </Button>
              <Button
                color='primary'
                onClick={this.handleToggle}
                buttonRef={(node) => {
                  this.anchorElAccount = node
                }}
              >
                Mass Adjustment
              </Button>
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
                          <MenuItem>Medication</MenuItem>
                          <MenuItem>Consumable</MenuItem>
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
