import React, { Component } from 'react'
import $ from 'jquery'
import { connect } from 'dva'
import classnames from 'classnames'
import { withStyles, Fab } from '@material-ui/core'
import PropTypes from 'prop-types'
import {
  GridContainer,
  GridItem,
  CardContainer,
  Accordion,
  withFormikExtend,
  IconButton,
  Button,
  SketchField,
  Tools,
  Tooltip,
  Tabs,
  Popconfirm,
} from '@/components'
import { roundUp } from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import { Delete, ImageSearch } from '@material-ui/icons'

import { getThumbnail } from '@/components/_medisys/AttachmentWithThumbnail/utils'
import { leftTools, ToolTypes } from './variables'

const base64Prefix = 'data:image/jpeg;base64,'
const thumbnailSize = { width: 100, height: 80 }
// @connect(({ patient, patientNurseNotes }) => ({
//   patient,
//   patientNurseNotes,
// }))

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },

  tabArea: {
    border: '1px solid #e8e8e8',
    width: '100%',
    height: '100%',
  },
})
class Scanner extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tool: Tools.None,
    }
    this.sketchs = []
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const nextImages = nextProps.imageDatas || []
    const thisImages = this.props.imageDatas || []
    if (nextImages.length !== thisImages.length) {
      this.setState({ activeKey: nextImages[nextImages.length - 1].uid })
    }
  }

  // shouldComponentUpdate (nextProps) {
  //   const nextImages = nextProps.imageDatas || []
  //   const thisImages = this.props.imageDatas || []

  //   const shouldUpdate = nextImages.length !== thisImages.length
  //   console.log(shouldUpdate)
  //   return shouldUpdate
  // }

  setBackgroundFromData = (activeKey) => {
    if (this.sketchs[activeKey]) {
      const { imageDatas = [] } = this.props

      const selectedImage = imageDatas.find((i) => i.uid === activeKey)
      if (selectedImage && selectedImage.image) {
        const base64Data = `${base64Prefix}${selectedImage.image}`

        this.sketchs[activeKey].setBackgroundFromData(
          base64Data,
          true,
          {
            hasControls: false,
            hasBorders: false,
          },
          (img) => {
            // const containerSize = this.getSketchContainerSize()
            // let canvas = this.sketchs[activeKey]._fc
            // img.scaleToHeight(containerSize.height)
            // const { scaleX, scaleY } = img
            // console.log(img)
            // const realHeight = roundUp(img.height * scaleY, 6)
            // const realWidht = roundUp(img.width * scaleY, 6)
            // canvas.setWidth(realWidht)
            // canvas.setHeight(realHeight)
            // img.height = realHeight
            // img.width = realWidht
          },
        )
      }
    }
  }

  generateThumbnail = async (imageSource) => {
    try {
      let thumbnailData
      await new Promise((resolve) => {
        const image = new Image()
        image.src = imageSource
        image.onload = () => {
          const thumbnail = getThumbnail(image, thumbnailSize)
          thumbnailData = thumbnail.toDataURL(`image/jpeg`)

          resolve()
        }
      })
      return thumbnailData
    } catch (error) {
      return null
    }
  }

  renderThumbnailImg = (imageData) => {
    const { uid, image } = imageData
    if (this.sketchs[uid]) {
      this.updateThumbnail(this.sketchs[uid], uid)
    } else {
      const base64Data = `${base64Prefix}${image}`
      this.generateThumbnail(base64Data).then((thumbnail) => {
        const thumObj = $(`#thum_${uid}`)
        if (thumObj) thumObj[0].src = thumbnail
      })
    }
  }

  handelConfirmDelete = (uid) => {
    const { imageDatas = [], handleDeleteItem } = this.props
    {
      const item = imageDatas.find((f) => f.uid === uid)
      if (
        imageDatas.length >= 2 &&
        imageDatas.indexOf(item) === imageDatas.length - 1
      ) {
        this.setState({
          activeKey: imageDatas[imageDatas.length - 2].uid,
        })
      }
      delete this.sketchs[uid]
      handleDeleteItem(uid)
    }
  }

  updateThumbnail = (sketch, uid) => {
    const imgData = sketch.exportToImageDataUrl()
    this.generateThumbnail(imgData).then((thumbnail) => {
      const thumObj = $(`#thum_${uid}`)
      if (thumObj) thumObj[0].src = thumbnail
    })
  }

  getSketchContainerSize = () => {
    return {
      width: 1024,
      height: window.innerHeight - 300,
    }
  }

  getTabOptions = () => {
    const { imageDatas = [] } = this.props
    const containerSize = this.getSketchContainerSize()
    return imageDatas.reduce((p, cur) => {
      const { uid } = cur
      const opt = {
        id: uid,
        name: (
          <React.Fragment>
            {this.renderThumbnailImg(cur)}
            <div
              style={
                this.state.activeKey !== uid ? { opacity: 0.4 } : thumbnailSize
              }
            >
              <img id={`thum_${uid}`} alt='' style={thumbnailSize} />
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <Popconfirm
                title='Are you sure delete this item?'
                onConfirm={() => {
                  this.handelConfirmDelete(uid)
                }}
              >
                <Tooltip title={`delete ${uid}`}>
                  <Button
                    style={{
                      position: 'absolute',
                      left: thumbnailSize.width - 2,
                      top: 5,
                    }}
                    justIcon
                    size='sm'
                    color='danger'
                  >
                    <Delete />
                  </Button>
                </Tooltip>
              </Popconfirm>
            </div>
          </React.Fragment>
        ),
        content: (
          <SketchField
            name={`image-${uid}`}
            ref={(c) => {
              if (c) {
                if (!this.sketchs[uid]) {
                  console.log('ref-->', c)
                  this.sketchs[uid] = c
                  this.setBackgroundFromData(uid)
                }
              }
            }}
            tool={this.state.tool}
            lineWidth={1}
            lineColor='blue'
            fillColor='transparent'
            backgroundColor='transparent'
            forceValue
            height={containerSize.height}
            disableResize
            style={{ overflow: 'auto' }}
            onChange={(e) => {
              if (
                this.sketchs[uid]._selectedTool.getToolName() === Tools.Crop
              ) {
                this.setState({
                  tool: Tools.None,
                })
                this.updateThumbnail(this.sketchs[uid], uid)
              }
            }}
          />
        ),
      }

      return [
        ...p,
        opt,
      ]
    }, [])
  }

  doChangeImages = (process) => {
    if (!process) return

    const { imageDatas = [] } = this.props
    let { activeKey } = this.state
    if (imageDatas.length === 1) {
      activeKey = imageDatas[0].uid
    }
    const selected = this.sketchs[activeKey]
    if (selected) {
      const objects = selected._fc.getObjects()
      selected._fc.setActiveObject(objects[0])
      process(selected, objects[0])
      objects[0].selectable = false
      objects[0].evented = false
    }
  }

  rotate90 = (direction) => {
    this.doChangeImages((selected, obj) => {
      let rotateNum = 0
      if (direction === 'left') {
        rotateNum -= 90
      } else {
        rotateNum += 90
      }
      const canvas = selected._fc
      let canvasHeight = canvas.getHeight()
      let canvasWidth = canvas.getWidth()

      canvas.setHeight(canvasWidth)
      canvas.setWidth(canvasHeight)

      selected.setAngle(rotateNum, (rotateObj, num) => {
        const { width, height, angle } = rotateObj
        // let width = canvas.getWidth()
        // let height = canvas.getHeight()
        // let { angle } = rotateObj
        if (angle === 0) {
          obj.set({ top: 0, left: 0 })
        } else if (angle === -90 || angle === 270) {
          obj.set({ top: width, left: 0 })
        } else if (Math.abs(angle) === 180) {
          obj.set({ top: height, left: width })
        } else if (angle === -270 || angle === 90) {
          obj.set({ top: 0, left: height })
        }
      })

      setTimeout(() => {
        this.updateThumbnail(selected, this.state.activeKey)
      }, 100)
    })
  }

  mirror = () => {
    this.doChangeImages((selected) => {
      selected.mirror()
      setTimeout(() => {
        this.updateThumbnail(selected, this.state.activeKey)
      }, 100)
    })
  }

  download = () => {
    this.doChangeImages((selected) => {
      selected.downloadImage()
    })
  }

  Zoom = (factor) => {
    this.doChangeImages((selected, obj) => {
      let canvas = selected._fc

      const currentZoom = canvas.getZoom()
      const newZoom = currentZoom * (1 + factor)

      const height = canvas.getHeight()
      const width = canvas.getWidth()
      const zoomBy = roundUp(newZoom / currentZoom, 6)

      const zoomHeight = roundUp(height * zoomBy, 6)
      const zoomWidth = roundUp(width * zoomBy, 6)

      canvas.setHeight(zoomHeight)
      canvas.setWidth(zoomWidth)

      // obj.set({ width: zoomWidth, heigh: zoomHeight })

      canvas.setZoom(newZoom)

      console.log(zoomHeight, zoomWidth, obj)
    })
  }

  handleToolClick = (toolId) => {
    switch (toolId) {
      case ToolTypes.ZoomIn:
        this.Zoom(0.1)
        break
      case ToolTypes.ZoomOut:
        this.Zoom(-0.1)
        break
      case ToolTypes.RotateLeft:
        this.rotate90('left')
        break
      case ToolTypes.RotateRight:
        this.rotate90('right')
        break
      case ToolTypes.Mirror:
        this.mirror()
        break
      case ToolTypes.Crop:
        this.setState((preState) => ({
          tool: preState.tool === Tools.Crop ? Tools.None : Tools.Crop,
        }))
        break
      case ToolTypes.Download:
        this.download()
        break

      default:
        break
    }
  }

  render () {
    const { classes, handleScaning } = this.props

    return (
      <GridContainer style={{ minHeight: window.innerHeight - 250 }}>
        <GridItem xs={11} md={10}>
          <div style={{ display: 'flex' }}>
            <ToggleButtonGroup
              exclusive
              size='small'
              orientation='vertical'
              onChange={(e) => {
                if (e.target.value === 'select') {
                  this.setState({
                    tool: e.target.value,
                  })
                } else if (e.target.value === 'eraser') {
                  this.setState({
                    tool: e.target.value,
                  })
                  this._removeSelected()
                }
              }}
              value={this.state.tool || Tools.None}
              outline='none'
            >
              {leftTools({ currentTool: this.state.tool }).map((t) => {
                const { id, title, icon } = t
                return (
                  <Tooltip title={title}>
                    <ToggleButton
                      key={id}
                      onClick={(e) => {
                        this.handleToolClick(id)
                      }}
                    >
                      {icon}
                    </ToggleButton>
                  </Tooltip>
                )
              })}
            </ToggleButtonGroup>

            <div className={classes.tabArea}>
              <Tabs
                activeKey={this.state.activeKey}
                type='line'
                tabPosition='bottom'
                size='large'
                centered
                animated='false'
                tabStyle={{}}
                tabBarGutter={12}
                options={this.getTabOptions()}
                onChange={(k) => {
                  this.setState({ activeKey: k })
                }}
              />
            </div>
          </div>
        </GridItem>

        <GridItem xs={1} md={2} style={{ textAlign: 'center' }}>
          <Button onClick={handleScaning} color='primary'>
            <ImageSearch /> Scan
          </Button>
        </GridItem>
      </GridContainer>
    )
  }
}
export default withStyles(styles, { withTheme: true })(Scanner)
