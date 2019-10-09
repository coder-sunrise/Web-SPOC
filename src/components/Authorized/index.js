import React from 'react'
import Authorized from './Authorized'
import AuthorizedRoute from './AuthorizedRoute'
import Secured from './Secured'
import check from './CheckPermissions'
import renderAuthorize from './renderAuthorize'
import AuthorizedContext from '@/components/Context/Authorized'
import { buttonTypes } from '@/utils/codes'

Authorized.Secured = Secured
Authorized.AuthorizedRoute = AuthorizedRoute
Authorized.check = check
Authorized.Context = AuthorizedContext
Authorized.generalCheck = (matches, props, component, disabledComponent) => {
  // console.log(matches, props, component, disabledComponent)
  if (!matches) return component
  const rights = Array.isArray(matches)
    ? matches
    : [
        matches,
      ]

  if (
    rights.find(
      (o) =>
        // o.name.endsWith('.edit') &&
        [
          'enable',
          'readwrite',
        ].indexOf(o.rights) >= 0,
    )
  ) {
    return component
  }
  if (!props.hideIfNoEditRights) {
    if (buttonTypes.indexOf(component.type.displayName) >= 0) {
      return null
    }
    if (disabledComponent) {
      if (typeof disabledComponent === 'function') {
        return disabledComponent()
      }
      return disabledComponent
    }
    return React.cloneElement(component, {
      disabled: true,
    })
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

  if (disabledComponent) {
    if (typeof disabledComponent === 'function') {
      return disabledComponent()
    }
    return disabledComponent
  }

  return React.cloneElement(component, {
    disabled: true,
  })
}
// console.log(Authorized)
export default renderAuthorize(Authorized)
