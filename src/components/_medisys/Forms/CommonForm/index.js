// import { connect } from 'dva'
import React, { PureComponent } from 'react'
import { DocumentEditor, CommonModal, Button, notification } from '@/components'
// import moment from 'moment'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate'
import HideImageIcon from '@material-ui/icons/Image'
import DownloadIcon from '@material-ui/icons/CloudDownload'
import Print from '@material-ui/icons/Print'
import Signature from '../Signature'

const base64Prefix = 'data:image/jpeg;base64,'

class CommonForm extends PureComponent {

  switchMode = () => {
    let isSigningMode = !this.state.isSigningMode
    this.DEContainer.documentEditor.editor.enforceProtection('', isSigningMode ? 'ReadOnly' : 'FormFieldsOnly')
    this.setState({ isSigningMode })
  }

  addSignature = () => {
    this.setState({ showSignature: true })
  }

  notificationWarning = _.debounce(message => notification.warning(message),100)

  selectionChange = e => {
    const isImageSelected = e.source.documentEditor.selection.isImageSelected
    const isSelectionInEditRegion = e.source.documentEditor.selection.isSelectionInEditRegion()
    if (this.mouseClicked && this.props.values.statusFK !== 2 && !isImageSelected && !isSelectionInEditRegion && this.state.signatureCounter > 0)
      this.notificationWarning({ message: 'Please remove signatures to update form content.'})
    this.setState({ isImageSelected, isSelectionInEditRegion })
    this.mouseClicked = false
  }

  deleteSignature = () => {
    if (this.state.isImageSelected) {
      this.DEContainer.documentEditor.selection.isImageSelected = false
      this.DEContainer.documentEditor.editor.deleteEditElement(
        this.DEContainer.documentEditor.selection,
      )
    }
    this.setState({ isImageSelected: false })
    this.updateSignatureCounter(-1)
  }

  updateSignature = ({ thumbnail }) => {
    const imageString =
      thumbnail && thumbnail.trim() != ''
        ? `${base64Prefix}${thumbnail}`
        : thumbnail
    this.DEContainer.documentEditor.editor.insertImage(imageString, 120, 60)
    this.updateSignatureCounter(+1)
  }

  updateSignatureCounter = val => {
    if (!val) return
    const newSignatureCounter = (this.state.signatureCounter || 0) + val
    this.props.setFieldValue('formData.signatureCounter', newSignatureCounter)
    this.setState({ signatureCounter: newSignatureCounter })
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
    this.props.setFieldValue('formData.content',this.DEContainer.documentEditor.serialize())
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

  documentClick = e => {
    this.mouseClicked = true
  }

  documentChange = () => {
    if (!this.DEContainer) return
    this.fillFormFields()
    const { statusFK, formData:{ signatureCounter = 0 } } = this.props.values
    this.setState({signatureCounter})
    this.DEContainer.documentEditor.editor.enforceProtection('',statusFK === 2 || signatureCounter > 0 ? 'ReadOnly' : 'FormFieldsOnly')
    this.DEContainer.documentEditor.showRestrictEditingPane(false)
    this.DEContainer.showHidePropertiesPane(false)
    const deElement = this.DEContainer.documentEditor.getDocumentEditorElement()
    deElement.addEventListener('click',this.documentClick.bind(this))
  }

  state = {}

  render() {
    const {
      showSignature,
      isSigningMode,
      isImageSelected,
      isSelectionInEditRegion,
      signatureCounter,
    } = this.state
    const {
      values: { statusFK, formName, formData:{ content } },
      height,
    } = this.props
    const disableEdit = statusFK === 2 //Finalize
    return (
      <div>
        <div style={{ float: 'right', margin: '-15px 0 5px 0' }}>
          <Button
            disabled={disableEdit || signatureCounter > 0}
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
          document={content}
          ref={r => (this.DEContainer = r?.container)}
          zoomTarget='FitPageWidth'
          height={'78vh'}
          showPropertiesPane={false}
          enableToolbar={false}
          restrictEditing={disableEdit}
          // userColor={'#FFFF00'}
          contentChange={this.contentChange}
          documentChange={this.documentChange}
          selectionChange={this.selectionChange}
          documentEditorSettings={{
            printDevicePixelRatio:3,
            // searchHighlightColor: '#FFE97F',
            // formFieldSettings: {
            //   shadingColor: '#cfcfcf',
            //   applyShading: true,
            //   selectionColor: '#cccccc',
            //   formFillingMode: 'Popup',//'Inline',
            // },
          }}
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
export default CommonForm
