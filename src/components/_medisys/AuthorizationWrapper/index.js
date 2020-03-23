import React from 'react'
import Authorized from '@/utils/Authorized'

const AuthorizationWrapper = ({ children, authority }) => {
  const accessRight = Authorized.check(authority)
  // if (!accessRight || accessRight.rights === 'hidden') return null
  // console.log(accessRight)
  return (
    <Authorized.Context.Provider value={accessRight}>
      {children}
    </Authorized.Context.Provider>
  )
}

export default AuthorizationWrapper
