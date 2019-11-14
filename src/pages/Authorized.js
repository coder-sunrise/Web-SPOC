import React from 'react'
import RenderAuthorized from '@/components/Authorized'
import { getAuthority } from '@/utils/authority'
import Redirect from 'umi/redirect'

// console.log('Authorized', Authority)
const Authority = getAuthority()
const Authorized = RenderAuthorized(Authority)
export default ({ children, ...restProps }) => {
  return (
    <Authorized
      authority={children.props.route.authority}
      noMatch={<Redirect to='/user/login' />}
    >
      {children}
    </Authorized>
  )
}
