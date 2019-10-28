import React from 'react'
import { Getter, Plugin } from '@devexpress/dx-react-core'
import { IntegratedSelection } from '@devexpress/dx-react-grid'

class PatchedIntegratedSelection extends React.PureComponent {
  render () {
    const { rowSelectionEnabled, ...restProps } = this.props
    return (
      <Plugin>
        <Getter
          name='rows'
          computed={({ rows }) => {
            this.rows = rows
            if (rowSelectionEnabled) {
              const filtered = rows.filter(rowSelectionEnabled)
              return filtered
            }
            return rows
          }}
        />
        <IntegratedSelection />
        <Getter name='rows' computed={() => this.rows} />
      </Plugin>
    )
  }
}

export default PatchedIntegratedSelection
