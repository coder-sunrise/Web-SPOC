import * as React from 'react'
import {
  // PluginHost,
  Plugin,
  // Getter,
  Action,
  // Template,
  // TemplatePlaceholder,
  // TemplateConnector,
} from '@devexpress/dx-react-core'

class EditPlugin extends React.PureComponent {
  render () {
    return (
      <Plugin>
        <Action
          name='commitAddedRows'
          action={(p) => {
            console.log(p)
          }}
        />
      </Plugin>
    )
  }
}

export default EditPlugin
