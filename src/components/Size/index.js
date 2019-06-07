import React from 'react'
import { smallTheme, defaultTheme, largeTheme } from '@/utils/theme'

import { MuiThemeProvider } from '@material-ui/core'

export default function GridContainer ({
  children,
  size = 'default',
  ...props
}) {
  let theme = defaultTheme
  if (size === 'sm' || size === 'small') {
    theme = smallTheme
  } else if (size === 'lg' || size === 'lager') {
    theme = largeTheme
  }
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}
