import React from 'react'
import { withStyles } from '@material-ui/core'
import Yup from '@/utils/yup'
import { getThumbnail } from '@/components/_medisys/AttachmentWithThumbnail/utils'
import {
  GridContainer,
  GridItem,
  TextField,
  SketchField,
  Tools,
  Button,
  notification,
  withFormikExtend,
} from '@/components'

const styles = () => ({
  container: {
    border: '1px solid #0d3349',
    backgroundColor: '#ffffff',
  },
})

@withFormikExtend({
  mapPropsToValues: () => ({}),
  displayName: 'Signature',
})
class Signature extends React.Component {
  componentDidMount() {
    const { image } = this.props
    if (image) this._sketch.setBackgroundFromData(image)
  }

  contentModifyed = () => {
    if(this.props.onChange)
      this.props.onChange(true)
    window.g_app._store.dispatch({
      type: 'formik/updateState',
      payload: {
        Signature: {
          displayName: 'Signature',
          dirty: true,
        },
      },
    })
  }

  clearSignature = () => {
    this._sketch.clear()
    this.contentModifyed()
  }

  _generateThumbnail = async () => {
    try {
      const result = this._sketch.exportToImageDataUrl()
      const imgEle = document.createElement('img')
      imgEle.src = result
      await setTimeout(() => {
        // wait for 1 milli second for img to set src successfully
      }, 100)
      const thumbnailSize = { width: 825, height: 450 }
      const thumbnail = getThumbnail(imgEle, thumbnailSize)
      const thumbnailData = thumbnail.toDataURL(`image/jpeg`)
      return thumbnailData
    } catch (error) {
      return null
    }
  }

  onSubmitButtonClicked = async () => {
    const { onClose, updateSignature, allowClear } = this.props
    const temp = this._sketch.getAllLayerData()
    if (temp.length <= 0) {
      if (!allowClear) {
        notification.warning({
          message: `Please set signature.`,
        })
        return
      }
    }
    if (temp.length > 0) {
      const thumbnail = await this._generateThumbnail()
      if (updateSignature)
        updateSignature({
          thumbnail: thumbnail.split(',')[1],
        })
    } else {
      updateSignature({
        thumbnail: undefined,
      })
    }
    if (onClose) onClose(true)
  }

  render() {
    const {
      classes,
      signatureName,
      isEditable = true,
      allowClear = false,
      signatureNameLabel = 'Signature Name',
    } = this.props
    return (
      <div>
        <GridContainer>
          {signatureName && (
            <GridItem xs={12} md={12}>
              <TextField
                label={signatureNameLabel}
                disabled
                value={signatureName}
              />
            </GridItem>
          )}
          <GridItem xs={12} md={12} onClick={this.contentModifyed}>
            <SketchField
              name='sketch'
              ref={c => {
                this._sketch = c
              }}
              lineWidth={6}
              lineColor='black'
              className={classes.container}
              tool={isEditable ? Tools.Pencil : Tools.None}
              fillColor='transparent'
              backgroundColor='transparent'
              forceValue
              height={480}
              width={window.width}
            />
          </GridItem>
        </GridContainer>
        <GridContainer
          style={{
            marginTop: 20,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button color='danger' icon={null} onClick={this.props.onClose}>
            {isEditable ? 'Cancel' : 'Close'}
          </Button>
          {isEditable && (
            <React.Fragment>
              <Button color='info' icon={null} onClick={this.clearSignature}>
                Clear
              </Button>
              <Button
                color='primary'
                icon={null}
                onClick={this.onSubmitButtonClicked}
              >
                Confirm
              </Button>
            </React.Fragment>
          )}
        </GridContainer>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(Signature)
