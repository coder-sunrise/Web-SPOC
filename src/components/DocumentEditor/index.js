import React, { PureComponent } from 'react'

import { TitleBar } from './titleBar'
import { SampleBase } from './sample-base'
import { Button, GridContainer, GridItem } from '@/components'
import './index.css'
import moment from 'moment'
import {
  DocumentEditorContainerComponent,
  Toolbar,
  CustomToolbarItemModel,
} from '@syncfusion/ej2-react-documenteditor'

DocumentEditorContainerComponent.Inject(Toolbar)

class DocumentEditor extends SampleBase {
  constructor() {
    super(...arguments)
    this.onLoadDefault = () => {
      const { documentName, document } = this.props
      this.container.documentEditor.documentName = documentName
      this.container.documentEditor.open(document)
    }
  }
  rendereComplete() {
    this.container.serviceUrl = this.hostUrl + 'api/documenteditor/'
    this.container.documentEditor.pageOutline = '#E0E0E0'
    this.container.documentEditor.acceptTab = true
    this.container.documentEditor.resize()
    this.titleBar = new TitleBar(
      document.getElementById('documenteditor_titlebar'),
      this.container.documentEditor,
      true,
    )
    this.onLoadDefault()
  }
  
  render() {
    return (
      <GridContainer>
        <GridItem md={12}>
          <div className='control-pane'>
            <div className='control-section'>
              <div
                id='documenteditor_titlebar'
                className='e-de-ctn-title'
              ></div>
              <div id='documenteditor_container_body'>
                <DocumentEditorContainerComponent
                  id='container'
                  ref={scope => {
                    this.container = scope
                  }}
                  locale='en-US'
                  {...this.props}

                />
              </div>
            </div>
          </div>
        </GridItem>
      </GridContainer>
    )
  }
}

export default DocumentEditor
