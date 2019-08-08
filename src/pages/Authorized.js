import React from 'react'
import RenderAuthorized from '@/components/Authorized'
import { getAuthority } from '@/utils/authority'
import Redirect from 'umi/redirect'

// console.log('Authorized', Authority)
export default ({ children, ...restProps }) => {
  const Authority = getAuthority()
  const Authorized = RenderAuthorized(Authority)
  return (
    <Authorized
      authority={children.props.route.authority}
      noMatch={<Redirect to='/login' />}
    >
      {children}
    </Authorized>
  )
}
