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
      sketchHeight: 700,
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

        this.sketchs[activeKey].setBackgroundFromData(base64Data, true, {
          hasControls: false,
          hasBorders: false,
        })
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
    const base64Data = `${base64Prefix}${image}`
    this.generateThumbnail(base64Data).then((thumbnail) => {
      $(`#thum_${uid}`)[0].src = thumbnail
    })
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

  getTabOptions = () => {
    const { imageDatas = [] } = this.props

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
                      left: 98,
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
            name={`image${uid}`}
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
            height={window.innerHeight - 300}
            disableResize
            style={{ overflow: 'auto' }}
            width={window.width - 100}
            onChange={(e) => {
              if (
                this.sketchs[uid]._selectedTool.getToolName() === Tools.Crop
              ) {
                this.setState({
                  tool: Tools.None,
                })
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
      process(selected)
      objects[0].selectable = false
      objects[0].evented = false
    }
  }

  rotate90 = (direction) => {
    this.doChangeImages((selected) => {
      let rotateNum = 0
      if (direction === 'left') {
        rotateNum -= 90
      } else {
        rotateNum += 90
      }
      selected.setAngle(rotateNum)
    })
  }

  mirror = () => {
    this.doChangeImages((selected) => {
      selected.mirror()
    })
  }

  download = () => {
    this.doChangeImages((selected) => {
      selected.downloadImage()
    })
  }

  ZoomIn = () => {
    this.doChangeImages((selected) => {
      let factor = selected.factor || 1
      selected.zoom(factor + 0.1)
    })
  }

  ZoomOut = () => {
    this.doChangeImages((selected) => {
      let factor = selected.factor || 1
      selected.zoom(factor - 0.1)
    })
  }

  handleToolClick = (toolId) => {
    switch (toolId) {
      case ToolTypes.ZoomIn:
        this.ZoomIn()
        break
      case ToolTypes.ZoomOut:
        this.ZoomOut()
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
    const { classes, dispatch, handleScaning } = this.props

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
