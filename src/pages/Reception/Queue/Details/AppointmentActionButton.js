import React, { PureComponent } from 'react'
// ant design
import { Dropdown, Menu } from 'antd'
// material ui core
import withStyles from '@material-ui/core/styles/withStyles'
// material ui icons
import MoreVert from '@material-ui/icons/MoreVert'
import Edit from '@material-ui/icons/Edit'
import PersonAdd from '@material-ui/icons/PersonAdd'
// common components
import { Button } from '@/components'

const style = () => ({
  leftAlign: {
    justifyContent: 'start',
  },
})

const MenuButtonBase = ({ classes, id, onClick, Icon, label, disabled }) => {
  return (
    <Button
      className={classes.leftAlign}
      block
      link
      noUnderline
      disabled={disabled}
      size='sm'
      color='primary'
      id={id}
      onClick={onClick}
    >
      <Icon />
      {label}
    </Button>
  )
}

const MenuButton = withStyles(style, {
  name: 'MenuButton',
})(MenuButtonBase)

const ContextMenuOptions = [
  {
    id: 0,
    label: 'Register Visit',
    Icon: Edit,
    disabled: true,
  },
  {
    id: 1,
    label: 'Register Patient',
    Icon: PersonAdd,
    disabled: true,
  },
]

class AppointmentActionButton extends PureComponent {
  handleClick = (event) => {
    const { onClick, row } = this.props
    const { currentTarget } = event
    onClick(row, currentTarget.id)
  }

  render () {
    const { color = 'primary' } = this.props
    const MenuItemsOverlay = (
      <Menu>
        {ContextMenuOptions.map(
          ({ disabled, label, Icon, id, isDivider }) =>
            isDivider ? (
              <Menu.Divider />
            ) : (
              <Menu.Item key={id} disabled={disabled}>
                <MenuButton
                  id={id}
                  Icon={Icon}
                  label={label}
                  disabled={disabled}
                  onClick={this.handleClick}
                />
              </Menu.Item>
            ),
        )}
      </Menu>
    )

    return (
      <Dropdown
        overlay={MenuItemsOverlay}
        trigger={[
          'click',
        ]}
      >
        <Button justIcon round color={color} size='sm'>
          <MoreVert />
        </Button>
      </Dropdown>
    )
  }
}

export default AppointmentActionButton
