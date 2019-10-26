import React from 'react'
import { Getter, Plugin } from '@devexpress/dx-react-core'
import { IntegratedSelection } from '@devexpress/dx-react-grid-material-ui'

class PatchedIntegratedSelection extends React.PureComponent {
  render () {
    const { rowSelectionEnabled, ...restProps } = this.props
    return (
      <Plugin>
        <Getter
          name='rows'
          computed={({ rows }) => {
            this.rows = rows
            return rows.filter(rowSelectionEnabled)
          }}
        />
        <IntegratedSelection {...restProps} />
        <Getter name='rows' computed={() => this.rows} />
      </Plugin>
    )
  }
}

export default PatchedIntegratedSelection
