// import { connect } from 'dva'
import React, { PureComponent } from 'react'
import { DocumentEditor, CommonModal, Button } from '@/components'
// import moment from 'moment'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate'
import HideImageIcon from '@material-ui/icons/Image'
import DownloadIcon from '@material-ui/icons/CloudDownload'
import Signature from '../Signature'

const base64Prefix = 'data:image/jpeg;base64,'
// @connect(({ user }) => ({
//   currentUser: user?.data?.clinicianProfile?.name,
// }))
class CommonConsentForm extends PureComponent {

  addSignature = () => {
    this.setState({ showSignature: true })
  }
  deleteSignature = () => {}

  updateSignature = ({ thumbnail }) => {
    const imageString =
      thumbnail && thumbnail.trim() != ''
        ? `${base64Prefix}${thumbnail}`
        : thumbnail
    this.DEContainer.documentEditor.editor.insertImage(imageString, 200, 100)
    // this.setState({
    //   showSignature: false,
    // })
  }

  contentChange = () => {
    this.props.setFieldValue(
      'formData',
      this.DEContainer.documentEditor.serialize(),
    )
  }

  fillFormFields = () => {
    const {
      values: { fillData },
    } = this.props
    if (fillData && this.DEContainer) {
      const formFieldData = this.DEContainer.documentEditor.exportFormData()
      Object.entries(fillData).forEach(p => {
        formFieldData.forEach(f => {
          if (
            f.fieldName
              .toLowerCase()
              .trim()
              .startsWith(p[0].toLowerCase())
          )
            f.value = p[1]
          f.defaultValue = p[1]
        })
      })
      this.DEContainer.documentEditor.importFormData(formFieldData)
    }
  }

  documentChange = () => {
    this.fillFormFields()
    if (!this.DEContainer) return
    this.DEContainer.restrictEditing = false
    this.DEContainer.documentEditor.editor.enforceProtection(
      '',
      'FormFieldsOnly',
    )
    this.DEContainer.documentEditor.showRestrictEditingPane(false)
    // this.DEContainer.documentEditor.enableCursorOnReadOnly = true
    this.DEContainer.showPropertiesPane = false
    this.DEContainer.showHidePropertiesPane(false)
    // this.DEContainer.enableToolbar = false
    // this.container.documentEditor.isReadOnly = true
  }

  state = {}

  render() {
    const { showSignature, isSignatureMode } = this.state
    const {
      values: { formName, formData },
      height,
    } = this.props

    return (
      <div>
        <div style={{float:'right'}}>
          <Button
            color='primary'
            onClick={() => {
              this.DEContainer.documentEditor.editor.enforceProtection(
                '',
                !isSignatureMode ? 'ReadOnly' : 'FormFieldsOnly',
              )
              this.setState({ isSignatureMode: !isSignatureMode })
            }}
          >
            {isSignatureMode ? 'Signature' : 'FillingField'}
          </Button>
          <Button
            size='sm'
            color='primary'
            icon
            onClick={() => {
              this.DEContainer.documentEditor.export()
            }}
          >
            <DownloadIcon /> Download
          </Button>
          <Button
            color='primary'
            onClick={() => {
              const selection = this.DEContainer.documentEditor.editor.selection
              const formFieldSettings = this.DEContainer.documentEditorSettings
                .formFieldSettings
              formFieldSettings.applyShading = false
              selection.isHighlightEditRegion = false
              this.DEContainer.documentEditor.print()
              formFieldSettings.applyShading = true
              selection.isHighlightEditRegion = true
            }}
          >
            Print
          </Button>
          <Button size='sm' color='primary' icon onClick={this.addSignature}>
            <AddPhotoAlternateIcon /> Signature
          </Button>
          <Button size='sm' color='primary' icon onClick={this.deleteSignature}>
            <HideImageIcon /> Delete Signature
          </Button>
        </div>
        <DocumentEditor
          documentName={formName}
          document={formData}
          ref={r => (this.DEContainer = r?.container)}
          height={'60vh'}
          showPropertiesPane={false}
          enableToolbar={false}
          restrictEditing={false}
          // userColor={'#FFFF00'}
          contentChange={() => this.contentChange()}
          documentChange={() => this.documentChange()}
          // documentEditorSettings={{
          //   searchHighlightColor: '#FFE97F',
          //   formFieldSettings: {
          //     shadingColor: '#cfcfcf',
          //     applyShading: true,
          //     selectionColor: '#cccccc',
          //     formFillingMode: 'Popup',//'Inline',
          //   },
          // }}
        />

        <CommonModal
          open={showSignature}
          title='Signature'
          observe='Signature'
          onClose={() => {
            this.setState({ showSignature: false })
          }}
        >
          {showSignature && (
            <Signature updateSignature={this.updateSignature} />
          )}
        </CommonModal>
      </div>
    )
  }
}
export default CommonConsentForm
