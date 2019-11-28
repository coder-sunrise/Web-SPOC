import React from 'react'
import {
  Paper,
  withStyles,
  Typography,
  Slider,
  List,
  Divider,
} from '@material-ui/core'

import { CompactPicker } from 'react-color'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import MoreVert from '@material-ui/icons/MoreVert'
import ColorLens from '@material-ui/icons/ColorLens'
import Pen from '@material-ui/icons/Create'
import InsertPhoto from '@material-ui/icons/InsertPhoto'
import Title from '@material-ui/icons/TextFields'
import Dropzone from 'react-dropzone'
import UndoIcon from '@material-ui/icons/Undo'
import RedoIcon from '@material-ui/icons/Redo'
import DeleteIcon from '@material-ui/icons/Delete'
import Save from '@material-ui/icons/SaveAlt'
import Erase from '@material-ui/icons/HowToVote'
import Remove from '@material-ui/icons/Remove'
import Backspace from '@material-ui/icons/CompareArrowsTwoTone'
import Rectangle from '@material-ui/icons/CropSquare'
import Circle from '@material-ui/icons/PanoramaFishEye'
import Move from '@material-ui/icons/OpenWith'
import Select from '@material-ui/icons/PanTool'
import Visibility from '@material-ui/icons/Visibility'
import InVisibility from '@material-ui/icons/VisibilityOff'
import MaterialTextField from '@material-ui/core/TextField'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import keydown, { Keys } from 'react-keydown'
import { Radio } from 'antd'
import { connect } from 'dva'
import Yup from '@/utils/yup'

import {
  GridContainer,
  GridItem,
  Popover,
  Switch,
  SketchField,
  Tools,
  Tooltip,
  TextField,
  ProgressButton,
  Button,
  withFormikExtend,
  FastField,
} from '@/components'

import {
  errMsgForOutOfRange as errMsg,
  navigateDirtyCheck,
} from '@/utils/utils'

const styles = () => ({
  container: {
    border: '1px solid #0d3349',
    backgroundColor: '#ffffff',
  },
  dropArea: {
    width: '100%',
    height: '90px',
    border: '2px dashed rgb(102, 102, 102)',
    borderStyle: 'dashed',
    borderRadius: '5px',
    textAlign: 'center',
    paddingTop: '30px',
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  actionDiv: {
    float: 'right',
    textAlign: 'center',
    marginTop: '5px',
  },
  layout: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
  },
  gridItem: {
    position: 'relative',
  },
  scribbleSubject: {
    width: 250,
    display: 'flex',
    float: 'left',
    paddingRight: 10,
  },
  radioButtonPadding: {
    paddingTop: 5,
  },
  templateImage: {
    maxHeight: 130,
    overflow: 'auto',
    alignItems: 'center',
  },
  imageOption: {
    width: 402.27,
    alignItems: 'center',
    textAlign: 'center',
    display: 'block',
  },
  rightButton: {
    display: 'flex',
    float: 'right',
    padding: 2,
  },
  sketchArea: {
    paddingTop: 30,
  },
})

let temp = null
@withFormikExtend({
  notDirtyDuration: 0.5,
  mapPropsToValues: ({ scriblenotes }) => {
    return scriblenotes.entity === '' ? '' : scriblenotes.entity
  },
  validationSchema: Yup.object().shape({
    subject: Yup.string()
      .required()
      .max(20, 'Subject should not exceed 20 characters'),
  }),

  handleSubmit: (values, { props }) => {
    props.addScribble(values.subject, temp)
    props.toggleScribbleModal()
  },
  displayName: 'ScribbleNotePage',
})
@connect(({ scriblenotes }) => ({
  scriblenotes,
}))
class Scribble extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tool: Tools.Pencil,
      lineWidth: 10,
      lineColor: 'black',
      backgroundColor: 'transparent',
      toolsDrawVisible: false,
      toolsShapeVisible: false,
      colorVisible: false,
      imageVisible: false,
      textVisible: false,
      text: '',
      fillColor: '#FFFFFF',
      fillWithColor: false,
      fillWithBackgroundColor: false,
      canUndo: false,
      canRedo: false,
      canClear: false,
      sketchHeight: 770,
      sketchWidth: window.width,
      hideEnable: false,
      disableAddImage: false,
      indexCount: 1,
      deleteEnable: false,
      toolsDrawingColor: false,
      toolsShapeColor: false,
      selectColorColor: false,
      imageColor: false,
      textColor: false,
      selectColor: false,
      eraserColor: false,
      templateList: [],
      isScribbleNoteDataNull: true,
    }
  }

  componentDidMount () {
    const { scriblenotes, dispatch } = this.props

    if (scriblenotes.editEnable) {
      this.setState({
        deleteEnable: true,
      })
    } else {
      this.setState({
        deleteEnable: false,
      })
    }

    dispatch({
      type: 'scriblenotes/queryTemplateList',
    }).then((templateList) => {
      if (templateList && templateList.data)
        this.setState({
          templateList: templateList.data.data,
        })
    })

    if (this.props.scribbleData !== '') {
      if (this.props.scribbleData.scribbleNoteLayers.length > 0) {
        this._sketch.initializeData(this.props.scribbleData.scribbleNoteLayers)
        this.setState({
          canClear: true,
          isScribbleNoteDataNull: false,
        })
      }
    }
  }

  handleToolsDrawVisibleChange = (toolsDrawVisible) => {
    this.setState({ toolsDrawVisible })
    if (!toolsDrawVisible) {
      this.setState({ toolsDrawingColor: false })
    }
  }

  handleToolsShapeVisibleChange = (toolsShapeVisible) => {
    this.setState({ toolsShapeVisible })
    if (!toolsShapeVisible) {
      this.setState({ toolsShapeColor: false })
    }
  }

  handleColorVisibleChange = (colorVisible) => {
    this.setState({ colorVisible })
    if (!colorVisible) {
      this.setState({ selectColorColor: false })
    }
  }

  handleInsertImageVisibleChange = (imageVisible) => {
    this.setState({ imageVisible })
    if (!imageVisible) {
      this.setState({ imageColor: false })
    }
  }

  handleTextVisibleChange = (textVisible) => {
    this.setState({ textVisible })
    if (!textVisible) {
      this.setState({ textColor: false })
    }
  }

  _removeSelected = () => {
    this._sketch.removeSelected()
  }

  _undo = () => {
    this._sketch.undo()
    this.setState({
      canUndo: this._sketch.canUndo(),
      canRedo: this._sketch.canRedo(),
    })
  }

  _redo = () => {
    this._sketch.redo()
    this.setState({
      canUndo: this._sketch.canUndo(),
      canRedo: this._sketch.canRedo(),
    })
  }

  _hideDrawing = () => {
    const { hideEnable } = this.state

    const newHideEnable = !hideEnable

    if (newHideEnable) {
      this.setState({
        canUndo: false,
        canRedo: false,
        canClear: false,
        hideEnable: !hideEnable,
      })
    } else {
      this.setState({
        canUndo: this._sketch.canUndo(),
        canRedo: this._sketch.canRedo(),
        canClear: true,
        hideEnable: !hideEnable,
      })
    }
    this._sketch.hideDrawing(newHideEnable)
  }

  _clear = () => {
    this._sketch.clear()
    this.setState({
      backgroundColor: 'transparent',
      fillWithBackgroundColor: false,
      canUndo: this._sketch.canUndo(),
      canRedo: this._sketch.canRedo(),
      canClear: false,
      isScribbleNoteDataNull: true,
    })
  }

  // _test = () => {
  //   this._sketch.test()
  // }

  // testPassValue = () => {
  //   let value = this._sketch.getValue()
  //   return value
  // }

  _download = () => {
    this._sketch.downloadImage()
  }

  _onSketchChange = (action) => {
    const prev = this.state.canUndo
    const now = this._sketch.canUndo()

    if (prev !== now || action === 'deleteAction') {
      this.setState({
        canUndo: now,
        hideEnable: false,
      })
      this._sketch.hideDrawing(false)
    }

    if (this.state.isScribbleNoteDataNull) {
      this.setState({
        canClear: now,
      })
    } else {
      this.setState({
        canClear: true,
      })
    }

    this.props.setFieldValue('drawing', 'dirty')
  }

  _selectTool = (event) => {
    this.setState({
      tool: event.target.value,
      // enableRemoveSelected: event.target.value === Tools.Select,
      // enableCopyPaste: event.target.value === Tools.Select,
    })
  }

  _addText = () => {
    this.setState({
      tool: 'select',
    })
    this._sketch.addText(this.state.text, this.state.lineColor)
  }

  _performSetTextAndReset = () => {
    this.setState({
      tool: 'select',
      eraserColor: false,
      selectColor: true,
      toolsDrawingColor: false,
      toolsShapeColor: false,
      selectColorColor: false,
      imageColor: false,
      textColor: false,
    })
    this._addText()
  }

  _onBackgroundImageDrop = (accepted) => {
    const { indexCount } = this.state

    if (accepted && accepted.length > 0) {
      const sketch = this._sketch
      const reader = new FileReader()
      reader.addEventListener(
        'load',
        () => sketch.setBackgroundFromDataUrl(reader.result),
        false,
      )

      // let newIndexCount = indexCount + 1

      // this.setState({
      //   indexCount: newIndexCount,
      // })
      reader.readAsDataURL(accepted[0])
    }
  }

  _setTemplate = (layerContent, id) => {
    this._sketch.setTemplate(layerContent, id)
  }

  toolDrawingHandleClickAway = () => {
    this.setState({
      toolsDrawingColor: false,
    })
  }

  toolShapeHandleClickAway = () => {
    this.setState({
      toolsShapeColor: false,
    })
  }

  colorHandleClickAway = () => {
    this.setState({
      selectColorColor: false,
    })
  }

  imageHandleClickAway = () => {
    this.setState({
      imageColor: false,
    })
  }

  textHandleClickAway = () => {
    this.setState({
      textColor: false,
    })
  }

  @keydown('ctrl+z')
  shortcutKeyUndo () {
    if (this.state.canUndo) {
      this._undo()
    }
  }

  @keydown('ctrl+y')
  shortcutKeyRedo () {
    if (this.state.canRedo) {
      this._redo()
    }
  }

  @keydown('backspace')
  shortcutKeyDelete () {
    const result = this._sketch._deleteSelectedObject()
    if (!result) {
      this.setState({
        tool: 'eraser',
        eraserColor: true,
        selectColor: false,
        toolsDrawingColor: false,
        toolsShapeColor: false,
        selectColorColor: false,
        imageColor: false,
        textColor: false,
      })
    }
    this._onSketchChange('deleteAction')
  }

  render () {
    const {
      classes,
      toggleScribbleModal,
      handleSubmit,
      deleteScribbleNote,
      setFieldValue,
      dispatch,
    } = this.props
    return (
      <div className={classes.layout}>
        <GridContainer>
          <GridItem xs={12} md={12} gutter={0} className={classes.gridItem}>
            <div className={classes.scribbleSubject}>
              <FastField
                name='subject'
                render={(args) => (
                  <TextField
                    {...args}
                    label='Scribble Subject'
                    inputProps={{ maxLength: 20 }}
                    maxLength={20}
                    // onChange={(e) => {
                    //   const subject = e.target.value
                    //   if (subject.length > 20) {
                    //     setFieldValue('subject', subject.substring(0, 20))
                    //   }
                    // }}
                  />
                )}
              />
            </div>
            <ToggleButtonGroup
              // size='small'
              // value={alignment}
              exclusive
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
              value={this.state.tool}
              outline='none'
            >
              <Tooltip title='Select'>
                <ToggleButton
                  key={1}
                  value={Tools.Select}
                  onClick={() => {
                    this.setState({
                      tool: 'select',
                      eraserColor: false,
                      selectColor: true,
                      toolsDrawingColor: false,
                      toolsShapeColor: false,
                      selectColorColor: false,
                      imageColor: false,
                      textColor: false,
                    })
                  }}
                >
                  <Select
                    color={this.state.selectColor ? 'primary' : ''}
                    style={{ color: this.state.selectColor ? '' : '#191919' }}
                  />
                </ToggleButton>
              </Tooltip>

              <Popover
                icon={null}
                content={
                  <ClickAwayListener
                    onClickAway={this.toolDrawingHandleClickAway}
                  >
                    <div style={{ paddingTop: 10, width: 200 }}>
                      <GridContainer>
                        <GridItem xs={12} md={12}>
                          <Radio.Group
                            // defaultValue={Tools.Pencil}
                            value={this.state.tool}
                            buttonStyle='solid'
                            onChange={(e) => {
                              this.setState({
                                tool: e.target.value,
                                eraserColor: false,
                                selectColor: false,
                                toolsDrawingColor: true,
                              })
                            }}
                          >
                            <Tooltip title='Pencil'>
                              <Radio.Button
                                value={Tools.Pencil}
                                className={classes.radioButtonPadding}
                              >
                                <Pen />
                              </Radio.Button>
                            </Tooltip>

                            <Radio.Button
                              value={Tools.Line}
                              className={classes.radioButtonPadding}
                            >
                              <Remove />
                            </Radio.Button>
                            <Radio.Button
                              value={Tools.Arrow}
                              className={classes.radioButtonPadding}
                            >
                              <Backspace />
                            </Radio.Button>
                          </Radio.Group>
                        </GridItem>
                      </GridContainer>

                      <GridContainer style={{ paddingTop: 10 }}>
                        <GridItem xs={12} md={12}>
                          <Typography>Line Weight</Typography>
                          <Slider
                            // ValueLabelComponent={ValueLabelComponent}
                            step={1}
                            min={0}
                            max={50}
                            aria-labelledby='slider'
                            value={this.state.lineWidth}
                            onChange={(e, v) => this.setState({ lineWidth: v })}
                          />
                        </GridItem>
                      </GridContainer>
                    </div>
                  </ClickAwayListener>
                }
                // title='Select Tools'
                trigger='click'
                placement='bottomLeft'
                visible={this.state.toolsDrawVisible}
                onVisibleChange={this.handleToolsDrawVisibleChange}
                onClick={() => {
                  const { toolsDrawingColor } = this.state
                  this.setState(() => ({
                    toolsDrawingColor: true,
                    toolsShapeColor: false,
                    selectColorColor: false,
                    imageColor: false,
                    textColor: false,
                    eraserColor: false,
                  }))
                }}
              >
                <Tooltip title='Drawing type'>
                  <ToggleButton key={2} type='primary'>
                    <Pen
                      color={this.state.toolsDrawingColor ? 'primary' : ''}
                      style={{
                        color: this.state.toolsDrawingColor ? '' : '#191919',
                      }}
                    />
                  </ToggleButton>
                </Tooltip>
              </Popover>

              <Popover
                icon={null}
                content={
                  <ClickAwayListener
                    onClickAway={this.toolShapeHandleClickAway}
                  >
                    <div style={{ paddingTop: 10, width: 200 }}>
                      <GridContainer>
                        <GridItem xs={10} md={10}>
                          <Radio.Group
                            // defaultValue={Tools.Pencil}
                            value={this.state.tool}
                            buttonStyle='solid'
                            onChange={(e) => {
                              this.setState({
                                tool: e.target.value,
                                eraserColor: false,
                                selectColor: false,
                              })
                            }}
                          >
                            <Radio.Button
                              value={Tools.Rectangle}
                              className={classes.radioButtonPadding}
                            >
                              <Rectangle />
                            </Radio.Button>
                            <Radio.Button
                              value={Tools.Circle}
                              className={classes.radioButtonPadding}
                            >
                              <Circle />
                            </Radio.Button>
                          </Radio.Group>
                        </GridItem>
                      </GridContainer>

                      <GridContainer style={{ paddingTop: 20 }}>
                        <GridItem xs={10} md={10}>
                          <Typography>Fill Enable</Typography>
                          <Switch
                            value={this.state.fillWithColor}
                            onChange={() =>
                              this.setState((preState) => ({
                                fillWithColor: !preState.fillWithColor,
                              }))}
                          />
                        </GridItem>
                      </GridContainer>

                      <GridContainer>
                        <GridItem xs={12} md={12}>
                          <Typography>Line Weight</Typography>
                          <Slider
                            // ValueLabelComponent={ValueLabelComponent}
                            step={1}
                            min={0}
                            max={50}
                            aria-labelledby='slider'
                            value={this.state.lineWidth}
                            onChange={(e, v) => this.setState({ lineWidth: v })}
                          />
                        </GridItem>
                      </GridContainer>
                    </div>
                  </ClickAwayListener>
                }
                // title='Select Tools'
                trigger='click'
                placement='bottomLeft'
                visible={this.state.toolsShapeVisible}
                onVisibleChange={this.handleToolsShapeVisibleChange}
                onClick={() => {
                  this.setState(() => ({
                    toolsDrawingColor: false,
                    toolsShapeColor: true,
                    selectColorColor: false,
                    imageColor: false,
                    textColor: false,
                    eraserColor: false,
                  }))
                }}
              >
                <Tooltip title='Shape'>
                  <ToggleButton key={3} type='primary'>
                    <Rectangle
                      color={this.state.toolsShapeColor ? 'primary' : ''}
                      style={{
                        color: this.state.toolsShapeColor ? '' : '#191919',
                      }}
                    />
                  </ToggleButton>
                </Tooltip>
              </Popover>

              <Popover
                icon={null}
                content={
                  <ClickAwayListener onClickAway={this.colorHandleClickAway}>
                    <div>
                      <GridContainer>
                        <GridItem xs={12} md={12}>
                          <div style={{ paddingBottom: 10 }} />
                          <Typography>Line Color</Typography>
                          <CompactPicker
                            id='lineColor'
                            color={this.state.lineColor}
                            onChange={(color) =>
                              this.setState({ lineColor: color.hex })}
                          />
                        </GridItem>
                      </GridContainer>

                      <GridContainer>
                        <GridItem xs={12} md={12}>
                          <Typography>Fill Color</Typography>
                          <CompactPicker
                            color={this.state.fillColor}
                            onChange={(color) =>
                              this.setState({ fillColor: color.hex })}
                          />

                          {/* <Typography>Fill Enable</Typography>
                      <Switch
                        value={this.state.fillWithColor}
                        onChange={() =>
                          this.setState((preState) => ({
                            fillWithColor: !preState.fillWithColor,
                          }))}
                      /> */}
                        </GridItem>
                      </GridContainer>
                    </div>
                  </ClickAwayListener>
                }
                // title='Colors'
                trigger='click'
                placement='bottomLeft'
                visible={this.state.colorVisible}
                onVisibleChange={this.handleColorVisibleChange}
                onClick={() => {
                  this.setState(() => ({
                    toolsDrawingColor: false,
                    toolsShapeColor: false,
                    selectColorColor: true,
                    imageColor: false,
                    textColor: false,
                    eraserColor: false,
                  }))
                }}
              >
                <Tooltip title='Colors'>
                  <ToggleButton key={4}>
                    <ColorLens
                      color={this.state.selectColorColor ? 'primary' : ''}
                      style={{
                        color: this.state.selectColorColor ? '' : '#191919',
                      }}
                    />
                  </ToggleButton>
                </Tooltip>
              </Popover>

              <Popover
                icon={null}
                content={
                  <ClickAwayListener onClickAway={this.imageHandleClickAway}>
                    <div>
                      <GridContainer>
                        <GridItem xs={12} md={12}>
                          <div style={{ paddingBottom: 10 }}>
                            <Typography>Select Image</Typography>
                            <Divider />
                          </div>
                          <Paper className={classes.templateImage}>
                            <List>
                              <div className={classes.imageOption}>
                                {this.state.templateList.map((item) => {
                                  return (
                                    <Button
                                      color='primary'
                                      onClick={() => {
                                        this._setTemplate(
                                          item.layerContent,
                                          item.id,
                                        )
                                      }}
                                      style={{
                                        margin: 10,
                                      }}
                                    >
                                      {item.description}
                                    </Button>
                                  )
                                })}
                              </div>
                            </List>
                          </Paper>
                        </GridItem>
                      </GridContainer>
                      <GridContainer style={{ paddingTop: 10 }}>
                        <GridItem xs={12} md={12}>
                          <Dropzone
                            onDrop={this._onBackgroundImageDrop}
                            accept='image/*'
                            multiple={false}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <section>
                                <div
                                  {...getRootProps()}
                                  style={styles.dropArea}
                                >
                                  <input {...getInputProps()} />
                                  <p className={classes.dropArea}>
                                    Drag and drop some files here, or click to
                                    select files
                                  </p>
                                </div>
                              </section>
                            )}
                          </Dropzone>
                        </GridItem>
                      </GridContainer>
                    </div>
                  </ClickAwayListener>
                }
                // title='Select Image'
                trigger='click'
                placement='bottomLeft'
                visible={this.state.imageVisible}
                onVisibleChange={this.handleInsertImageVisibleChange}
                onClick={() => {
                  const { imageColor } = this.state
                  this.setState(() => ({
                    toolsDrawingColor: false,
                    toolsShapeColor: false,
                    selectColorColor: false,
                    imageColor: true,
                    textColor: false,
                    eraserColor: false,
                  }))
                }}
              >
                <Tooltip title='Insert Image'>
                  <ToggleButton key={5}>
                    <InsertPhoto
                      color={this.state.imageColor ? 'primary' : ''}
                      style={{ color: this.state.imageColor ? '' : '#191919' }}
                    />
                  </ToggleButton>
                </Tooltip>
              </Popover>

              <Popover
                icon={null}
                content={
                  <ClickAwayListener onClickAway={this.textHandleClickAway}>
                    <div style={{ width: 300 }}>
                      <GridContainer>
                        <GridItem xs={12} md={12}>
                          <TextField
                            label='Text'
                            onChange={(e) =>
                              this.setState({ text: e.target.value })}
                            // value={this.state.text}
                          />
                        </GridItem>
                      </GridContainer>
                      <GridContainer style={{ paddingTop: 10 }}>
                        <GridItem xs={12} md={12}>
                          <Button
                            color='primary'
                            onClick={this._addText}
                            style={{ paddingTop: 20 }}
                          >
                            Add Text
                          </Button>
                        </GridItem>
                      </GridContainer>
                    </div>
                  </ClickAwayListener>
                }
                // title='Text'
                trigger='click'
                placement='bottomLeft'
                visible={this.state.textVisible}
                onVisibleChange={this.handleTextVisibleChange}
                onClick={() => {
                  this.setState(() => ({
                    toolsDrawingColor: false,
                    toolsShapeColor: false,
                    selectColorColor: false,
                    imageColor: false,
                    eraserColor: false,
                    textColor: true,
                  }))
                }}
              >
                <Tooltip title='Add Text'>
                  <ToggleButton key={6}>
                    <Title
                      color={this.state.textColor ? 'primary' : ''}
                      style={{ color: this.state.textColor ? '' : '#191919' }}
                    />
                  </ToggleButton>
                </Tooltip>
              </Popover>

              <Tooltip title='Erase'>
                <ToggleButton
                  key={7}
                  value={Tools.Eraser}
                  onClick={() => {
                    this.setState({
                      tool: 'eraser',
                      eraserColor: true,
                      selectColor: false,
                      toolsDrawingColor: false,
                      toolsShapeColor: false,
                      selectColorColor: false,
                      imageColor: false,
                      textColor: false,
                    })
                  }}
                >
                  <Erase
                    color={this.state.eraserColor ? 'primary' : ''}
                    style={{ color: this.state.eraserColor ? '' : '#191919' }}
                  />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Save'>
                <ToggleButton
                  key={6}
                  onClick={() => {
                    this._download()

                    this.setState({
                      toolsDrawingColor: false,
                      selectColorColor: false,
                      imageColor: false,
                      textColor: false,
                    })
                  }}
                >
                  <Save style={{ color: '#191919' }} />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Undo'>
                <ToggleButton
                  key={7}
                  color='primary'
                  disabled={!this.state.canUndo}
                  onClick={() => {
                    this._undo()

                    this.setState({
                      toolsDrawingColor: false,
                      toolsShapeColor: false,
                      selectColorColor: false,
                      imageColor: false,
                      textColor: false,
                    })
                  }}
                >
                  <UndoIcon
                    color={this.state.canUndo ? 'primary' : 'disabled'}
                  />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Redo'>
                <ToggleButton
                  key={8}
                  color='primary'
                  disabled={!this.state.canRedo}
                  onClick={() => {
                    this._redo()

                    this.setState({
                      toolsDrawingColor: false,
                      toolsShapeColor: false,
                      selectColorColor: false,
                      imageColor: false,
                      textColor: false,
                    })
                  }}
                >
                  <RedoIcon
                    color={this.state.canRedo ? 'primary' : 'disabled'}
                  />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Remove All'>
                <ToggleButton
                  key={9}
                  color='primary'
                  disabled={!this.state.canClear}
                  onClick={() => {
                    this._clear()

                    this.setState({
                      toolsDrawingColor: false,
                      toolsShapeColor: false,
                      selectColorColor: false,
                      imageColor: false,
                      textColor: false,
                    })
                  }}
                >
                  <DeleteIcon
                    color={this.state.canClear ? 'primary' : 'disabled'}
                  />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Hide'>
                <ToggleButton
                  key={10}
                  checked={this.state.hideEnable}
                  onClick={() => {
                    this._hideDrawing()

                    this.setState({
                      toolsDrawingColor: false,
                      toolsShapeColor: false,
                      selectColorColor: false,
                      imageColor: false,
                      textColor: false,
                    })
                  }}
                >
                  {this.state.hideEnable ? (
                    <InVisibility color='disabled' />
                  ) : (
                    <Visibility color='primary' />
                  )}
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>

            <div className={classes.rightButton}>
              <div className={classes.actionDiv}>
                {this.state.deleteEnable ? (
                  <Button
                    color='danger'
                    onClick={() => {
                      dispatch({
                        type: 'global/updateAppState',
                        payload: {
                          openConfirm: true,
                          openConfirmContent:
                            'Are you sure want to delete this scribble note ?',
                          onConfirmSave: () => deleteScribbleNote(),
                        },
                      })
                    }}
                  >
                    Delete
                  </Button>
                ) : (
                  ''
                )}

                <Button
                  color='danger'
                  onClick={navigateDirtyCheck({
                    displayName: 'ScribbleNotePage',
                    onProceed: toggleScribbleModal,
                  })}
                >
                  Cancel
                </Button>
                <ProgressButton
                  onClick={() => {
                    temp = this._sketch.getAllLayerData()
                    handleSubmit()
                  }}
                />
              </div>
            </div>
            <div className={classes.sketchArea}>
              <FastField name='drawing' render={(args) => ''} />
              <SketchField
                name='sketch'
                ref={(c) => {
                  this._sketch = c
                }}
                lineWidth={this.state.lineWidth}
                lineColor={this.state.lineColor}
                className={classes.container}
                tool={this.state.tool}
                fillColor={
                  this.state.fillWithColor ? (
                    this.state.fillColor
                  ) : (
                    'transparent'
                  )
                }
                backgroundColor={
                  this.state.fillWithBackgroundColor ? (
                    this.state.backgroundColor
                  ) : (
                    'transparent'
                  )
                }
                onChange={this._onSketchChange}
                forceValue
                height={this.state.sketchHeight}
                width={this.state.sketchWidth}
              />
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Scribble)
