import React, { Component } from 'react'

const AuthorizedContext = React.createContext({
  view: '',
  edit: '',
  behavior: 'disabled',
})
export default AuthorizedContext
