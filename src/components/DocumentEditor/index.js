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
import { now } from '@umijs/deps/compiled/lodash'
DocumentEditorContainerComponent.Inject(Toolbar)

class DocumentEditor extends SampleBase {
  constructor() {
    super(...arguments)
    // this.hostUrl = 'https://ej2services.syncfusion.com/production/web-services/'
    this.onLoadDefault = (label, content) => {
      this.container.documentEditor.documentName = label
      this.container.documentEditor.open(content)
    }
  }
  rendereComplete() {
    const { label, value } = this.props
    this.container.serviceUrl = this.hostUrl + 'api/documenteditor/'
    this.container.documentEditor.pageOutline = '#E0E0E0'
    this.container.documentEditor.acceptTab = true
    this.container.documentEditor.resize()
    // this.titleBar = new TitleBar(
    //   document.getElementById('documenteditor_titlebar'),
    //   this.container.documentEditor,
    //   true,
    // )
    this.onLoadDefault(label, value)
  }
  onUploadClick = () => {}
  onToolbarClick = args => {
    const { handleToolbarClick } = this.props
    // switch (args.item.id) {
    //   case 'saveDocument':
    //     handleToolbarClick?.call(
    //       this,
    //       args.item.id,
    //       this.container.documentEditor.serialize(),
    //     )
    //     break
    // }
  }
  serializeConent = () => {
    return this.container.documentEditor.serialize()
  }
  render() {
    const { onDocumentChange, onContentChange } = this.props
    let items = [
      'Open',
      'Separator',
      'Undo',
      'Redo',
      'Separator',
      'Image',
      'Table',
      'Hyperlink',
      'Separator',
      'Header',
      'Footer',
      'PageSetup',
      'PageNumber',
      'Break',
      'Separator',
      'Find',
      'Separator',
      // 'LocalClipboard',
      // 'RestrictEditing',
      'FormFields',
    ]
    return (
      <GridContainer>
        <GridItem md={12}>
          <div className='control-pane'>
            <div className='control-section'>
              {/* <div
                id='documenteditor_titlebar'
                className='e-de-ctn-title'
              >
              </div> */}
              <div id='documenteditor_container_body'>
                <DocumentEditorContainerComponent
                  id='container'
                  toolbarItems={items}
                  ref={scope => {
                    this.container = scope
                  }}
                  toolbarClick={this.onToolbarClick.bind(this)}
                  style={{ display: 'block' }}
                  height={'539px'}
                  showPropertiesPane={false}
                  locale='en-US'
                  contentChange={onContentChange}
                  documentChange={onDocumentChange}
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
