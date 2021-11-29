// import { connect } from 'dva'
import React, { PureComponent } from 'react'
import { DocumentEditor, CommonModal, Button } from '@/components'
// import moment from 'moment'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate'
import HideImageIcon from '@material-ui/icons/Image'
import DownloadIcon from '@material-ui/icons/CloudDownload'
import Print from '@material-ui/icons/Print'
import Signature from '../Signature'

const base64Prefix = 'data:image/jpeg;base64,'

class CommonConsentForm extends PureComponent {
  switchMode = () => {
    let isSigningMode = !this.state.isSigningMode
    this.DEContainer.documentEditor.editor.enforceProtection(
      '',
      isSigningMode ? 'ReadOnly' : 'FormFieldsOnly',
    )
    this.setState({ isSigningMode })
  }

  addSignature = () => {
    this.setState({ showSignature: true })
  }

  selectionChange = e => {
    const selection = e.source.documentEditor.selection
    this.setState({
      isImageSelected: selection.isImageSelected,
      isSelectionInEditRegion: selection.isSelectionInEditRegion(),
    })
  }

  deleteSignature = () => {
    if (this.state.isImageSelected) {
      this.DEContainer.documentEditor.selection.isImageSelected = false
      this.DEContainer.documentEditor.editor.deleteEditElement(
        this.DEContainer.documentEditor.selection,
      )
    }
    this.setState({ isImageSelected: false })
  }

  updateSignature = ({ thumbnail }) => {
    const imageString =
      thumbnail && thumbnail.trim() != ''
        ? `${base64Prefix}${thumbnail}`
        : thumbnail
    this.DEContainer.documentEditor.editor.insertImage(imageString, 200, 50)
  }

  closeSignature = () => {
    this.setState({ showSignature: false })
  }

  showHideHighligth(isShow) {
    const selection = this.DEContainer.documentEditor.editor.selection
    const formFieldSettings = this.DEContainer.documentEditorSettings.formFieldSettings
    formFieldSettings.applyShading = isShow
    selection.isHighlightEditRegion = isShow
  }

  download = () => {
    this.showHideHighligth(false)
    this.DEContainer.documentEditor.save(this.props.values.formName, 'Docx')
    this.showHideHighligth(true)
  }

  print = () => {
    this.showHideHighligth(false)
    this.DEContainer.documentEditor.print()
    this.showHideHighligth(true)
  }

  contentChange = () => {
    this.props.setFieldValue(
      'formData',
      this.DEContainer.documentEditor.serialize(),
    )
  }

  fillFormFields = () => {
    const fillData = this.props.values.fillData
    if (fillData) {
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
    if (!this.DEContainer) return
    this.fillFormFields()
    this.DEContainer.documentEditor.editor.enforceProtection('','FormFieldsOnly')
    this.DEContainer.documentEditor.showRestrictEditingPane(false)
    this.DEContainer.showHidePropertiesPane(false)
  }

  state = {}

  render() {
    const {
      showSignature,
      isSigningMode,
      isImageSelected,
      isSelectionInEditRegion,
    } = this.state
    const {
      values: { statusFK, formName, formData },
      height,
    } = this.props
    const disableEdit = statusFK === 4 //Finalize
    return (
      <div>
        <div style={{ float: 'right', margin: '-15px 0 5px 0' }}>
          <Button
            disabled={disableEdit}
            color='primary'
            onClick={this.switchMode}
          >
            {isSigningMode ? 'Switch to Edit Mode' : 'Switch to Signing Mode'}
          </Button>
          <Button
            disabled={disableEdit || !isSigningMode || !isSelectionInEditRegion}
            size='sm'
            color='primary'
            icon
            onClick={this.addSignature}
          >
            <AddPhotoAlternateIcon /> Add Signature
          </Button>
          <Button
            size='sm'
            color='primary'
            disabled={disableEdit || !isSigningMode || !isImageSelected}
            icon
            onClick={this.deleteSignature}
          >
            <HideImageIcon /> Delete Signature
          </Button>
          <Button size='sm' color='primary' icon onClick={this.download}>
            <DownloadIcon /> Download
          </Button>
          <Button size='sm' color='primary' icon onClick={this.print}>
            <Print /> Print
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
          contentChange={this.contentChange}
          documentChange={this.documentChange}
          selectionChange={this.selectionChange}
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
          onClose={this.closeSignature}
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
