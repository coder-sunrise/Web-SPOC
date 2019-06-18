import React from 'react'
import { smallTheme, defaultTheme, largeTheme } from '@/utils/theme'
import { standardRowHeight, smallRowHeight, largeRowHeight } from 'assets/jss'

import { MuiThemeProvider } from '@material-ui/core'

export default function SizeContainer ({ children, size = 'md', ...props }) {
  let theme = defaultTheme
  const extraProps = {
    rowHeight: standardRowHeight,
  }
  if (size === 'sm' || size === 'small') {
    theme = smallTheme
    extraProps.rowHeight = smallRowHeight
  } else if (size === 'lg' || size === 'lager') {
    theme = largeTheme
    extraProps.rowHeight = largeRowHeight
  }

  return (
    <MuiThemeProvider theme={theme}>
      {typeof children === 'function' ? (
        children(extraProps)
      ) : (
        React.cloneElement(children, {
          ...extraProps,
          ...children.props,
        })
      )}
    </MuiThemeProvider>
  )
}
