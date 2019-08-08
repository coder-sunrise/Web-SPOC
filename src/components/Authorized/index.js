import React from 'react'
import Authorized from './Authorized'
import AuthorizedRoute from './AuthorizedRoute'
import Secured from './Secured'
import check from './CheckPermissions'
import renderAuthorize from './renderAuthorize'
import AuthorizedContext from '@/components/Context/Authorized'

Authorized.Secured = Secured
Authorized.AuthorizedRoute = AuthorizedRoute
Authorized.check = check
Authorized.Context = AuthorizedContext
Authorized.generalCheck = (matches, props, component, disabledComponent) => {
  // console.log(matches, props, component, disabledComponent)
  const rights = Array.isArray(matches)
    ? matches
    : [
        matches,
      ]

  if (
    rights.find(
      (o) =>
        o.name.endsWith('.edit') &&
        [
          'enable',
        ].indexOf(o.rights) >= 0,
    )
  ) {
    return component
  }
  // console.log(component.displayName, props)
  if (!props.hideIfNoEditRights) {
    if (component.type.displayName === 'RegularButton') {
      return null
    }

    return (
      disabledComponent ||
      React.cloneElement(component, {
        disabled: true,
      })
    )
  }
  if (
    rights.find(
      (o) =>
        o.name.endsWith('.view') &&
        [
          'hidden',
        ].indexOf(o.rights) >= 0,
    ) ||
    props.hideIfNoEditRights
  ) {
    return null
  }

  return (
    disabledComponent ||
    React.cloneElement(component, {
      disabled: true,
    })
  )
}
// console.log(Authorized)
export default renderAuthorize(Authorized)
