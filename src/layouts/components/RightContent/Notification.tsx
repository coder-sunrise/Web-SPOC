import React, { useCallback } from 'react'
import {
  LockOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Menu, Spin } from 'antd'
import { history, useModel } from 'umi'
import { Icon } from '@/components'
import { stringify } from 'querystring'
import HeaderDropdown from '../HeaderDropdown'
import styles from './index.less'
// import { outLogin } from '@/services/ant-design-pro/api';
// import MyProfile from '@/pages/User/myProfile';
// import ChangePassword from '@/pages/User/changePassword';

export type GlobalHeaderRightProps = {
  menu?: boolean
}
console.log(HeaderDropdown)
/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  // await outLogin();
  const { query = {}, pathname } = history.location
  const { redirect } = query
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname,
      }),
    })
  }
}

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  // const { initialState, setInitialState } = useModel('@@initialState');
  // const { dispatch } = useModel('myProfile');
  // const { dispatch: dispatchChangePassword } = useModel('changePassword');
  // const { currentUser } = initialState!;

  const onMenuClick = useCallback(
    (event: {
      key: React.Key
      keyPath: React.Key[]
      item: React.ReactInstance
      domEvent: React.MouseEvent<HTMLElement>
    }) => {},
    [],
  )

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size='small'
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  )

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key='center'>
          <UserOutlined />
          My Profile
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key='changePassword'>
          <LockOutlined />
          Change Password
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key='settings'>
          <SettingOutlined />
          System Settings
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key='logout'>
        <LogoutOutlined />
        Logout
      </Menu.Item>
    </Menu>
  )
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Icon type='notification' /> Notification
      </span>
    </HeaderDropdown>
  )
}

export default AvatarDropdown
