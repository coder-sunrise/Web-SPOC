import React from 'react'
import { compose } from 'redux'
import { Fab as MUIFabButton } from '@material-ui/core'
import { control } from '@/components/Decorator'

const Fab = (props) => {
  return <MUIFabButton {...props} />
}
Fab.displayName = 'Fab'

export default compose(control())(Fab)
