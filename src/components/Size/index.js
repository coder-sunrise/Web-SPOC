import React from 'react'
import { standardRowHeight, smallRowHeight, largeRowHeight } from 'assets/jss'

import { MuiThemeProvider } from '@material-ui/core'
import { smallTheme, defaultTheme, largeTheme } from '@/utils/theme'

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
  let newChildren = <div>{children}</div>
  return (
    <MuiThemeProvider theme={theme}>
      {typeof children === 'function' ? (
        children(extraProps)
      ) : (
        React.cloneElement(newChildren, {
          ...extraProps,
          ...children.props,
        })
      )}
    </MuiThemeProvider>
  )
}
