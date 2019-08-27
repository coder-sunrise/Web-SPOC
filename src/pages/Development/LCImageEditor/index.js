import React, { PureComponent, Suspense } from 'react'
import {
  FormControl,
  InputLabel,
  Input,
  Paper,
  withStyles,
  IconButton,
  Menu,
  MenuItem,
  Popper,
  Fade,
  ClickAwayListener,
  Collapse,
  Typography,
  Slider,
  Tooltip,
  Icon,
  FormControlLabel,
  TextField,
  Card,
  CardHeader,
  CardBody,
} from '@material-ui/core'
import {
  GridContainer,
  GridItem,
  Popover,
  Switch,
  SketchField,
  Tools,
} from '@/components'
import { CompactPicker } from 'react-color'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import PropTypes from 'prop-types'
import AddIcon from '@material-ui/icons/Add'
// import { SketchField, Tools } from '@/components'
// import { SketchField, Tools } from 'react-sketch'
import MoreVert from '@material-ui/icons/MoreVert'
import ColorLens from '@material-ui/icons/ColorLens'
import Create from '@material-ui/icons/Create'
import InsertPhoto from '@material-ui/icons/InsertPhoto'
import Title from '@material-ui/icons/Title'
import Dropzone from 'react-dropzone'
import UndoIcon from '@material-ui/icons/Undo'
import RedoIcon from '@material-ui/icons/Redo'
import DeleteIcon from '@material-ui/icons/Delete'
import classNames from 'classnames'
// const { SketchField } = rs
const styles = (theme) => ({
  container: {
    // margin: '7px 0 0 7px',
    border: '1px solid #0d3349',
    backgroundColor: '#ffffff',
    // paddingTop: 60,
  },
  actionButton: {
    // widht: 30,
    // margin: '5px 5px',
  },
  actionIcon: {
    // width: 35,
    // height: 35,
  },
  activeStyle: {
    borderStyle: 'solid',
    backgroundColor: '#eee',
  },
  rejectStyle: {
    borderStyle: 'solid',
    backgroundColor: '#ffdddd',
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
})

function ValueLabelComponent (props) {
  const { children, open, value } = props

  const popperRef = React.useRef(null)
  React.useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update()
    }
  })

  return (
    <Tooltip
      PopperProps={{
        popperRef,
      }}
      open={open}
      enterTouchDelay={0}
      placement='top'
      title={value}
    >
      {children}
    </Tooltip>
  )
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
}

class ControlTest extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tool: Tools.Pencil,
      lineWidth: 10,
      lineColor: 'black',
      backgroundColor: 'transparent',
      shadowWidth: 0,
      shadowOffset: 0,
      enableRemoveSelected: false,
      toolsVisible: false,
      colorVisible: false,
      textVisible: false,
      imageVisible: false,
      text: 'a text, cool!',
      fillColor: '#68CCCA',
      fillWithColor: false,
      fillWithBackgroundColor: false,
      canUndo: false,
      canRedo: false,
      stretched: true,
      stretchedX: false,
      stretchedY: false,
      sketchHeight: 800,
      originX: 'left',
      originY: 'top',
      enableCopyPaste: false,
    }
  }
  /*
  hideTools = () => {
    this.setState({
      toolsVisible: false,
    });
  };

  hideColor = () => {
    this.setState({
      colorVisible: false,
    })
  }

  hideText = () => {
    this.setState({
      textVisible: false,
    })
  }

  hideInsertImage = () => {
    this.setState({
      imageVisible: false,
    })
  }
*/
  handleToolsVisibleChange = (toolsVisible) => {
    this.setState({ toolsVisible })
  }

  handleColorVisibleChange = (colorVisible) => {
    this.setState({ colorVisible })
  }

  handleTextVisibleChange = (textVisible) => {
    this.setState({ textVisible })
  }

  handleInsertImageVisibleChange = (imageVisible) => {
    this.setState({ imageVisible })
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

  _clear = () => {
    this._sketch.clear()
    this._sketch.setBackgroundFromDataUrl('')
    this.setState({
      controlledValue: null,
      backgroundColor: 'transparent',
      fillWithBackgroundColor: false,
      canUndo: this._sketch.canUndo(),
      canRedo: this._sketch.canRedo(),
    })
  }

  _onSketchChange = () => {
    let prev = this.state.canUndo
    let now = this._sketch.canUndo()
    if (prev !== now) {
      this.setState({ canUndo: now })
    }
  }

  _selectTool = (event) => {
    this.setState({
      tool: event.target.value,
      enableRemoveSelected: event.target.value === Tools.Select,
      enableCopyPaste: event.target.value === Tools.Select,
    })
  }

  _addText = () => this._sketch.addText(this.state.text)

  _performSetTextAndReset = () => {
    this._addText()
    this.state.tool = 'select'
  }

  _onBackgroundImageDrop = (accepted /*, rejected*/) => {
    if (accepted && accepted.length > 0) {
      let sketch = this._sketch
      let reader = new FileReader()
      let { stretched, stretchedX, stretchedY, originX, originY } = this.state
      reader.addEventListener(
        'load',
        () =>
          sketch.setBackgroundFromDataUrl(reader.result, {
            stretched: stretched,
            stretchedX: stretchedX,
            stretchedY: stretchedY,
            originX: originX,
            originY: originY,
          }),
        false,
      )
      reader.readAsDataURL(accepted[0])
    }
  }
  render () {
    const { classes } = this.props
    // console.log('render')
    return (
      <div>
        <GridContainer>
          {/* <GridItem xs={12} md={1}>
           
            
          </GridItem> */}
          <GridItem
            xs={12}
            md={12}
            gutter={0}
            style={{
              position: 'relative',
            }}
          >
            <ToggleButtonGroup
              // size='small'
              // value={alignment}
              exclusive
              onChange={(e, v) => {
                console.log(e.target)
                console.log(e.target, v)
                this.setState({
                  tool: v,
                })
              }}
              value={this.state.tool}
            >
              <ToggleButton
                key={1}
                value={Tools.Pencil}
                onClick={(event) => {}}
                className={classes.actionButton}
              >
                <Create className={classes.actionIcon} />
              </ToggleButton>

              <Popover
                icon={null}
                content={
                  <div>
                    <Typography id='slider'>
                      Please select Canvas Tool
                    </Typography>
                    <select value={this.state.tool} onChange={this._selectTool}>
                      <option value={Tools.Select}>Select</option>
                      <option value={Tools.Pencil}>Pencil</option>
                      <option value={Tools.Line}>Line</option>
                      <option value={Tools.Arrow}>Arrow</option>
                      <option value={Tools.Rectangle}>Rectangle</option>
                      <option value={Tools.Circle}>Circle</option>
                      <option value={Tools.Pan}>Pan</option>
                    </select>

                    <br />
                    <br />

                    <Typography id='slider'>Line Weight</Typography>
                    <Slider
                      ValueLabelComponent={ValueLabelComponent}
                      step={1}
                      min={0}
                      max={50}
                      aria-labelledby='slider'
                      value={this.state.lineWidth}
                      onChange={(e, v) => this.setState({ lineWidth: v })}
                    />
                  </div>
                }
                title='Select Tools'
                trigger='click'
                placement='bottomLeft'
                visible={this.state.toolsVisible}
                onVisibleChange={this.handleToolsVisibleChange}
              >
                <ToggleButton
                  key={2}
                  // selected={this.state === Tools.Select}
                  //value={Tools.Select}
                  type='primary'
                  className={classes.actionButton}
                >
                  <MoreVert className={classes.actionIcon} />
                </ToggleButton>
              </Popover>

              <Popover
                icon={null}
                content={
                  <div>
                    <Typography id='slider'>Line Color</Typography>
                    <CompactPicker
                      id='lineColor'
                      color={this.state.lineColor}
                      onChange={(color) =>
                        this.setState({ lineColor: color.hex })}
                    />

                    <br />
                    <br />

                    <Typography id='slider'>Fill Color</Typography>
                    <CompactPicker
                      color={this.state.fillColor}
                      onChange={(color) =>
                        this.setState({ fillColor: color.hex })}
                    />

                    <br />
                    <br />
                    <Typography id='slider'>Fill Enable</Typography>
                    <Switch
                      value={this.state.fillWithColor}
                      onChange={(e) =>
                        this.setState({
                          fillWithColor: !this.state.fillWithColor,
                        })}
                    />
                  </div>
                }
                title='Colors'
                trigger='click'
                placement='bottomLeft'
                visible={this.state.colorVisible}
                onVisibleChange={this.handleColorVisibleChange}
              >
                <ToggleButton
                  key={3}
                  //value={Tools.Line}
                  className={classes.actionButton}
                >
                  <ColorLens className={classes.actionIcon} />
                </ToggleButton>
              </Popover>

              <Popover
                icon={null}
                content={
                  <div>
                    <Dropzone
                      onDrop={this._onBackgroundImageDrop}
                      accept='image/*'
                      multiple={false}
                      style={styles.dropArea}
                      activeStyle={styles.activeStyle}
                      rejectStyle={styles.rejectStyle}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div {...getRootProps()} style={styles.dropArea}>
                            <input {...getInputProps()} />
                            <p
                              style={{
                                width: '100%',
                                height: '90px',
                                border: '2px dashed rgb(102, 102, 102)',
                                borderStyle: 'dashed',
                                borderRadius: '5px',
                                textAlign: 'center',
                                paddingTop: '30px',
                                paddingLeft: '10px',
                                paddingRight: '10px',
                              }}
                            >
                              Drag 'n' drop some files here, or click to select
                              files
                            </p>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                }
                title='Select Image'
                trigger='click'
                placement='bottomLeft'
                visible={this.state.imageVisible}
                onVisibleChange={this.handleInsertImageVisibleChange}
              >
                <ToggleButton key={4} className={classes.actionButton}>
                  <InsertPhoto className={classes.actionIcon} />
                </ToggleButton>
              </Popover>

              <Popover
                icon={null}
                content={
                  <div>
                    <div className='row'>
                      <div className='col-lg-7'>
                        <TextField
                          label='Text'
                          helperText='Add text to Sketch'
                          onChange={(e) =>
                            this.setState({ text: e.target.value })}
                          value={this.state.text}
                        />
                        <IconButton
                          color='primary'
                          onClick={this._performSetTextAndReset}
                        >
                          <AddIcon />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                }
                title='Add Text'
                trigger='click'
                placement='bottomLeft'
                visible={this.state.textVisible}
                onVisibleChange={this.handleTextVisibleChange}
              >
                <ToggleButton
                  key={5}
                  type='primary'
                  className={classes.actionButton}
                >
                  <Title className={classes.actionIcon} />
                </ToggleButton>
              </Popover>
            </ToggleButtonGroup>

            <div
              style={{
                // width: 50,
                // borderRadius: 3,
                // backgroundColor: '#ccc',
                // position: 'absolute',
                // left: 5,
                // top: 5,
                display: 'flex',
                float: 'right',
                padding: 10,
              }}
            >
              <IconButton
                color='primary'
                disabled={!this.state.canUndo}
                onClick={this._undo}
              >
                <UndoIcon />
              </IconButton>

              <IconButton
                color='primary'
                disabled={!this.state.canRedo}
                onClick={this._redo}
              >
                <RedoIcon />
              </IconButton>

              <IconButton color='primary' onClick={this._clear}>
                <DeleteIcon />
              </IconButton>
            </div>

            <SketchField
              name='sketch'
              className='canvas-area'
              ref={(c) => (this._sketch = c)}
              lineWidth={this.state.lineWidth}
              lineColor={this.state.lineColor}
              className={classes.container}
              tool={this.state.tool}
              fillColor={
                this.state.fillWithColor ? this.state.fillColor : 'transparent'
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
            />
          </GridItem>
        </GridContainer>

        {/* <SketchField
          width='1024px'
          height='768px'
          tool={Tools.Pencil}
          lineColor='black'
          lineWidth={3}
        /> */}
        {this.state.tool}
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ControlTest)
