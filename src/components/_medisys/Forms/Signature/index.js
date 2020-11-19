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
} from '@/components'

const styles = () => ({
  container: {
    border: '1px solid #0d3349',
    backgroundColor: '#ffffff',
  },
})

class Signature extends React.Component {
  componentDidMount () {
    const { image } = this.props
    if (image) this._sketch.setBackgroundFromData(image)
  }

  clearSignature = () => {
    this._sketch.clear()
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
    const { onClose, updateSignature } = this.props
    const temp = this._sketch.getAllLayerData()
    if (temp.length <= 0) {
      notification.warning({
        message: `Please set signature.`,
      })
      return
    }
    const thumbnail = await this._generateThumbnail()
    if (updateSignature) updateSignature({ thumbnail: thumbnail.split(',')[1] })
    if (onClose) onClose()
  }

  render () {
    const { classes, signatureName, isEditable = true } = this.props
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} md={12}>
            <TextField label='Signature Name' disabled value={signatureName} />
          </GridItem>
          <GridItem xs={12} md={12}>
            <SketchField
              name='sketch'
              ref={(c) => {
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
          {isEditable && (
            <React.Fragment>
              <Button
                color='primary'
                icon={null}
                onClick={this.onSubmitButtonClicked}
              >
                OK
              </Button>
              <Button color='danger' icon={null} onClick={this.clearSignature}>
                clear
              </Button>
            </React.Fragment>
          )}
          <Button color='danger' icon={null} onClick={this.props.onClose}>
            {isEditable ? 'Cancel' : 'Close'}
          </Button>
        </GridContainer>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(Signature)
