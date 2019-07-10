import React from 'react'
// ant design
import { Dropdown, Menu } from 'antd'
// material ui icons
import MoreVert from '@material-ui/icons/MoreVert'
// common component
import { Button } from '@/components'
// sub component
import MenuButton from './MenuButton'

const GridButton = ({ color = 'primary', row, ContextMenuOptions }) => {
  const MenuItemsOverlay = (
    <Menu>
      {ContextMenuOptions.map(
        ({ disabled, label, Icon, id, isDivider, onClick }) =>
          isDivider ? (
            <Menu.Divider />
          ) : (
            <Menu.Item key={id} disabled={disabled}>
              <MenuButton
                id={id}
                Icon={Icon}
                label={label}
                disabled={disabled}
                onClick={onClick}
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

export default GridButton
