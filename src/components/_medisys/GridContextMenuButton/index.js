import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// ant design
import { Dropdown, Menu } from 'antd'
// material ui core
import withStyles from '@material-ui/core/styles/withStyles'
// material ui icons
import MoreVert from '@material-ui/icons/MoreVert'
// common components
import { Button } from '@/components'
import { primaryColor } from 'mui-pro-jss'

const style = (theme) => ({
  leftAlign: {
    justifyContent: 'start',
  },
  menu: {
    '& > .ant-dropdown-menu-item': {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    '& span': {
      fontSize: '0.8rem',
      color: primaryColor,
    },
  },
  icon: {
    color: primaryColor,
    marginRight: theme.spacing(1),
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
      {Icon && <Icon />}
      {label}
    </Button>
  )
}

const MenuButton = withStyles(style, {
  name: 'MenuButton',
})(MenuButtonBase)

const GridContextMenuButton = ({
  classes,
  color = 'primary',
  contextMenuOptions = [
    {
      id: '',
      label: '',
      Icon: null,
      disabled: false,
      isDivider: false,
    },
  ],
  onClick = (f) => f,
  row = {},
}) => {
  const handleClick = (event) => {
    const { key } = event

    onClick(row, key)
  }

  //   <MenuButton
  //   id={id}
  //   Icon={Icon}
  //   label={label}
  //   disabled={disabled}
  //   onClick={handleClick}
  // />
  const MenuItemsOverlay = (
    <Menu onClick={handleClick} className={classes.menu}>
      {contextMenuOptions.map(
        ({ disabled, label, Icon, id, isDivider }, index) =>
          isDivider ? (
            <Menu.Divider key={`divider-${index}`} />
          ) : (
            <Menu.Item
              key={id}
              id={id}
              disabled={disabled}
              // onClick={handleClick}
            >
              <Icon className={classes.icon} />
              <span>{label}</span>
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

// GridContextMenuButton.propTypes = {
//   onClick: PropTypes.func.isRequired,
//   row: PropTypes.shape({}),
//   color: PropTypes.oneOf([
//     'primary',
//     'danger',
//     'success',
//     'info',
//   ]),
//   contextMenuOptions: PropTypes.shape([
//     {
//       id: PropTypes.string,
//       disabled: PropTypes.bool,
//       label: PropTypes.string,
//       Icon: PropTypes.node,
//       isDivider: PropTypes.bool,
//     },
//   ]),
// }

export default withStyles(style, { name: 'GridContextMenuButton' })(
  GridContextMenuButton,
)
