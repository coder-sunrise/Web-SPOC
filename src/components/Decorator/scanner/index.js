import React, { Component } from 'react'
import $ from 'jquery'
import { connect } from 'dva'
import classnames from 'classnames'
import { withStyles, Fab, ClickAwayListener } from '@material-ui/core'
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
  Popper,
  Popover,
  Popconfirm,
  NumberInput,
  TextField,
} from '@/components'

import { roundUp } from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import {
  Delete,
  ImageSearch,
  AspectRatio as AspectRatioIcon,
} from '@material-ui/icons'

import { getThumbnail } from '@/components/_medisys/AttachmentWithThumbnail/utils'
import { leftTools, ToolTypes } from './variables'
import { Scanconfig } from './scanconfig'
import { ImageList } from './imagelist'

const base64Prefix = 'data:image/png;base64,'
const thumbnailSize = { width: 120, height: 80 }

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
    overflow: 'hidden',
  },
})
class Scanner extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tool: Tools.None,
      // resize: { width: undefined, height: undefined },
    }
    this.sketchs = []
    this._imagelistRef = React.createRef()
    this._tabRef = React.createRef()
  }

  componentDidMount = () => {
    window.addEventListener('resize', this._resize, false)
    setTimeout(this._resize, 100)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this._resize)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const nextImages = nextProps.imageDatas || []
    const thisImages = this.props.imageDatas || []
    if (nextImages.length !== thisImages.length) {
      this.setState({ activeKey: nextImages[nextImages.length - 1].uid })
    }
  }

  getContainerHeight = () => {
    return window.innerHeight - 160 // 190
  }

  _resize = (e) => {
    if (this._imagelistRef.current) {
      let current = $(this._imagelistRef.current)
      let prev = current.prev()
      const containerHeight = this.getContainerHeight()
      // console.log(containerHeight, prev[0].offsetHeight)

      let currentHeight = containerHeight - prev[0].offsetHeight - 20
      const gridDiv = current.find('.medisys-edit-table>div')
      if (gridDiv && gridDiv.length > 0) {
        gridDiv.eq(0).height(currentHeight)
        gridDiv[0].style.overflow = 'auto'
      }
    }
  }

  scaleToViewWH = (sketch) => {
    const canvas = sketch._fc
    const container = $(this._tabRef.current) // sketch._container
    let { clientWidth, clientHeight } = container[0]
    clientHeight -= 170
    this.scaleCavans(canvas, clientWidth, clientHeight)
  }

  scaleCavans = (canvas, clientWidth, clientHeight) => {
    const currentZoom = canvas.getZoom()

    const canvasWidth = canvas.getWidth()
    const canvasHeight = canvas.getHeight()

    const sw = clientWidth / canvasWidth
    const sh = clientHeight / canvasHeight

    let newZoom = Math.min(sw, sh)
    const zoomBy = roundUp(newZoom / currentZoom, 6)

    const zoomHeight = roundUp(canvasHeight * zoomBy, 6)
    const zoomWidth = roundUp(canvasWidth * zoomBy, 6)

    canvas.setHeight(zoomHeight)
    canvas.setWidth(zoomWidth)

    canvas.setZoom(newZoom)

    // console.log({
    //   currentZoom,
    //   newZoom,
    //   clientWidth,
    //   clientHeight,
    //   zoomWidth,
    //   zoomHeight,
    //   canvasHeight,
    //   canvasWidth,
    //   canvasAftW: canvas.getWidth(),
    //   canvasAftH: canvas.getHeight(),
    // })
  }

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
            const sketch = this.sketchs[activeKey]
            this.scaleToViewWH(sketch)
          },
        )
      }
    }
  }

  generateThumbnail = async (imageSource, size = thumbnailSize) => {
    try {
      let thumbnailData
      await new Promise((resolve) => {
        const image = new Image()
        image.src = imageSource
        image.onload = () => {
          const thumbnail = getThumbnail(image, size)
          thumbnailData = thumbnail.toDataURL(`image/jpg`)

          resolve()
        }
      })
      return thumbnailData
    } catch (error) {
      return null
    }
  }

  handelConfirmDelete = (uid) => {
    const { imageDatas = [], onDeleteItem } = this.props

    const item = imageDatas.find((f) => f.uid === uid)
    const activeItems = imageDatas.filter((f) => f.uid !== uid)

    // deleted selected item or last one
    if (
      this.state.activeKey === uid ||
      imageDatas.indexOf(item) === imageDatas.length - 1
    ) {
      this.setState({
        activeKey:
          activeItems.length > 0
            ? activeItems[activeItems.length - 1].uid
            : undefined,
      })
    }
    delete this.sketchs[uid]
    onDeleteItem(uid)
  }

  renderThumbnailImg = (imageData) => {
    const { uid, image } = imageData
    if (this.sketchs[uid]) {
      // console.log('renderThumbnailImg --1')
      // this.updateThumbnail(this.sketchs[uid], uid)
    } else {
      const base64Data = `${base64Prefix}${image}`
      this.generateThumbnail(base64Data, {
        width: 300,
        height: 300,
      }).then((thumbnail) => {
        this.updateThumbnailToElement(uid, thumbnail)
      })
    }
  }

  updateThumbnail = (sketch, uid) => {
    const imgData = sketch.exportToImageDataUrl()
    this.generateThumbnail(imgData, {
      width: 300,
      height: 300,
    }).then((thumbnail) => {
      this.updateThumbnailToElement(uid, thumbnail)
    })
  }

  updateThumbnailToElement = (uid, thumbnail) => {
    let imgs = $(`img[uid='${uid}']`) || []
    for (let index = 0; index < imgs.length; index++) {
      const element = imgs[index]
      element.src = thumbnail
    }
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
    this.doChangeImages((selected, obj) => {
      const canvas = selected._fc
      const origZoom = canvas.getZoom()
      const origWidth = canvas.getWidth()
      const origHeight = canvas.getHeight()

      this.FullScreen()
      selected.downloadImage()

      canvas.setZoom(origZoom)
      canvas.setWidth(origWidth)
      canvas.setHeight(origHeight)
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

      canvas.setZoom(newZoom)
    })
  }

  FullScreen = () => {
    this.doChangeImages((selected, obj) => {
      let canvas = selected._fc
      const currentZoom = canvas.getZoom()
      const newZoom = 1

      const height = canvas.getHeight()
      const width = canvas.getWidth()
      const zoomBy = roundUp(newZoom / currentZoom, 6)

      const zoomHeight = roundUp(height * zoomBy, 6)
      const zoomWidth = roundUp(width * zoomBy, 6)

      canvas.setHeight(zoomHeight)
      canvas.setWidth(zoomWidth)

      console.log('setfullscreen', {
        zoomWidth,
        zoomHeight,
        canvasW: canvas.getWidth(),
        canvasH: canvas.getHeight(),
      })

      canvas.setZoom(1)
    })
  }

  FitOnScreen = () => {
    this.doChangeImages((selected, obj) => {
      this.FullScreen()
      this.scaleToViewWH(selected)
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
      case ToolTypes.Full:
        this.FullScreen()
        break
      case ToolTypes.Fit:
        this.FitOnScreen()
        break

      default:
        break
    }
  }

  handleUploading = async () => {
    const { onUploading, imageDatas = [] } = this.props
    const uploadImages = []
    if (this.sketchs) {
      // eslint-disable-next-line guard-for-in
      for (let k in this.sketchs) {
        const item = imageDatas.find((f) => f.uid === k)
        const imgData = this.sketchs[k].exportToImageDataUrl()
        const thumbnailData = await this.generateThumbnail(imgData)
        uploadImages.push({
          uid: k,
          imgData: imgData.split(',')[1],
          thumbnailData: thumbnailData.split(',')[1],
          name: item.name,
          fileExtension: '.png',
        })
      }
    }
    onUploading(uploadImages)
  }

  getTabOptions = () => {
    const { imageDatas = [] } = this.props
    return imageDatas.reduce((p, cur) => {
      const { uid, name } = cur
      const opt = {
        id: uid,
        name: (
          <CardContainer hideHeader style={{ margin: '-8px -10px' }}>
            <GridContainer>
              <div>
                {this.renderThumbnailImg(cur)}
                <div
                  style={{
                    opacity: this.state.activeKey !== uid ? 0.5 : 1,
                    ...thumbnailSize,
                  }}
                >
                  <img uid={`${uid}`} alt='' style={thumbnailSize} />
                </div>

                <Tooltip title='Remove this item'>
                  <Button
                    style={{
                      position: 'absolute',
                      left: thumbnailSize.width - 15,
                      top: 8,
                    }}
                    justIcon
                    size='sm'
                    color='danger'
                    onClick={() => {
                      this.handelConfirmDelete(uid)
                    }}
                  >
                    <Delete />
                  </Button>
                </Tooltip>
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <TextField
                    value={name}
                    multiline
                    rowsMax={3}
                    style={{ width: thumbnailSize.width, maxHeight: 50 }}
                    maxLength={50}
                    onChange={(e) => {
                      this.props.onUpdateName({ ...cur, name: e.target.value })
                    }}
                    onKeyDown={(e) => {
                      if (
                        [
                          'ArrowLeft',
                          'ArrowRight',
                          'ArrowUp',
                          'ArrowDown',
                        ].includes(e.key)
                      )
                        e.stopPropagation()
                    }}
                  />
                </div>
              </div>
            </GridContainer>
          </CardContainer>
        ),
        content: (
          <SketchField
            name={`image-${uid}`}
            ref={(c) => {
              if (c) {
                if (!this.sketchs[uid]) {
                  // console.log('ref-->', c)
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
            height={window.innerHeight - 330}
            disableResize
            style={{ overflow: 'auto' }}
            canvasStyle={{ border: '1px solid #EDF3FF' }}
            onDoubleClick={() => this.Zoom(0.2)}
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

  render () {
    const { classes, onScaning, imageDatas = [] } = this.props
    // console.log('-render scanner', this.state.activeKey)
    return (
      <GridContainer style={{ height: this.getContainerHeight() }}>
        <GridItem xs={9} md={9}>
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
                // if (id === ToolTypes.Resize) return this.getResizeComponent(t)

                return (
                  <Tooltip title={title}>
                    <ToggleButton
                      key={id}
                      onClick={(e) => {
                        this.handleToolClick(id, e)
                      }}
                    >
                      {icon}
                    </ToggleButton>
                  </Tooltip>
                )
              })}
            </ToggleButtonGroup>

            <div ref={this._tabRef} className={classes.tabArea}>
              <Tabs
                activeKey={this.state.activeKey}
                type='line'
                tabPosition='bottom'
                size='large'
                centered
                animated='false'
                tabStyle={{}}
                tabBarStyle={{
                  paddingLeft: 0,
                  top: 1,
                  position: 'relative',
                  margin: 0,
                }}
                tabBarGutter={12}
                options={this.getTabOptions()}
                onChange={(k) => {
                  if (imageDatas.find((f) => f.uid === k))
                    this.setState({ activeKey: k })
                }}
              />
            </div>
          </div>
        </GridItem>
        <GridItem xs={3} md={3}>
          <React.Fragment>
            <div>
              <Scanconfig
                onScaning={onScaning}
                onUploading={this.handleUploading}
                onSizeChanged={this._resize}
                canUploading={imageDatas.length > 0}
              />
            </div>
          </React.Fragment>
        </GridItem>
      </GridContainer>
    )
  }
}
export default withStyles(styles, { withTheme: true })(Scanner)
