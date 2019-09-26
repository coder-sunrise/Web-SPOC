import React from 'react'
import { compose } from 'redux'
import { IconButton as MUIIconButton } from '@material-ui/core'
import { control } from '@/components/Decorator'

const IconButton = (props) => {
  // console.log(props)
  return <MUIIconButton {...props} />
}
IconButton.displayName = 'IconButton'
export default compose(control())(IconButton)
