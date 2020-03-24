import React from 'react'
import Authorized from '@/utils/Authorized'

const AuthorizationWrapper = ({ children, authority }) => {
  const accessRight = Authorized.check(authority)
  if (!accessRight || accessRight.rights === 'hidden') return null

  return (
    <Authorized.Context.Provider
      value={{
        rights:
          accessRight.rights === 'readwrite' || accessRight.rights === 'enable'
            ? 'enable'
            : 'disable',
      }}
    >
      {children}
    </Authorized.Context.Provider>
  )
}

export default AuthorizationWrapper
