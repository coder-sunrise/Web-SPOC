import React, { PureComponent } from 'react'
// ant design
import { Dropdown, Menu } from 'antd'
// material ui core
import withStyles from '@material-ui/core/styles/withStyles'
// material ui icons
import MoreVert from '@material-ui/icons/MoreVert'
import Edit from '@material-ui/icons/Edit'
import Money from '@material-ui/icons/AttachMoney'
import Clear from '@material-ui/icons/Clear'
import Person from '@material-ui/icons/Person'
import Book from '@material-ui/icons/LibraryBooks'
import Play from '@material-ui/icons/PlayArrow'
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
      simple
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
    label: 'Edit Visit',
    Icon: Edit,
    disabled: false,
  },
  {
    id: 1,
    label: 'Dispense & Bill',
    Icon: Money,
    disabled: false,
  },
  {
    id: 2,
    label: 'Delete Visit',
    Icon: Clear,
    disabled: true,
  },
  { isDivider: true },
  {
    id: 3,
    label: 'Patient Profile',
    Icon: Person,
    disabled: true,
  },
  {
    id: 4,
    label: 'Patient Dashboard',
    Icon: Book,
    disabled: false,
  },
  { isDivider: true },
  {
    id: 5,
    label: 'Start Consultation',
    Icon: Play,
    disabled: false,
  },
]

class GridButton extends PureComponent {
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

export default GridButton
