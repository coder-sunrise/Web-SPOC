import React from 'react'
import {
  Scribble,
} from '@/components'


class ControlTest extends React.Component {
 
  render () {

    return (
      <div>
        <Scribble />
        {/* <GridContainer>
          <div
            style={{
              width: 300,
              left: 5,
              paddingRight: 10,
              display: 'flex',
              float: 'left',
            }}
          >
            <TextField label='Scribble Subject' />
          </div>
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
                console.log(e.target.value)
                //console.log(e.target.id, v)
                if (e.target.value == 'select') {
                  this.setState({
                    tool: e.target.value,
                  })
                } else if (e.target.value == 'eraser') {
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
                  onClick={(event) => {
                    this.setState({
                      tool: 'select',
                    })
                  }}
                  className={classes.actionButton}
                >
                  <Select />
                </ToggleButton>
              </Tooltip>

              <Popover
                icon={null}
                content={
                  <div>
                    <div>
                      <Typography>Please select Canvas Tool</Typography>
                      <br />
                      <Radio.Group
                        // defaultValue={Tools.Pencil}
                        value={this.state.tool}
                        buttonStyle='solid'
                        onChange={(e, v) => {
                          this.setState({
                            tool: e.target.value,
                          })
                        }}
                      >
                        <Tooltip title='Select'>
                          <React.Fragment>
                            <Radio.Button
                              value={Tools.Select}
                              style={{ paddingTop: 5 }}
                            >
                              <Select />
                            </Radio.Button>
                          </React.Fragment>
                        </Tooltip>

                        <Tooltip title='Pencil'>
                          <Radio.Button
                            value={Tools.Pencil}
                            style={{ paddingTop: 5 }}
                          >
                            <Pen />
                          </Radio.Button>
                        </Tooltip>

                        <Radio.Button
                          value={Tools.Line}
                          style={{ paddingTop: 5 }}
                        >
                          <Remove />
                        </Radio.Button>
                        <Radio.Button
                          value={Tools.Arrow}
                          style={{ paddingTop: 5 }}
                        >
                          <Backspace />
                        </Radio.Button>
                        <Radio.Button
                          value={Tools.Rectangle}
                          style={{ paddingTop: 5 }}
                        >
                          <Rectangle />
                        </Radio.Button>
                        <Radio.Button
                          value={Tools.Circle}
                          style={{ paddingTop: 5 }}
                        >
                          <Circle />
                        </Radio.Button>
                        <Radio.Button
                          value={Tools.Pan}
                          style={{ paddingTop: 5 }}
                        >
                          <Move />
                        </Radio.Button>
                      </Radio.Group>
                    </div>

                    <br />
                    <div>
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
                    </div>
                  </div>
                }
                title='Select Tools'
                trigger='click'
                placement='bottomLeft'
                visible={this.state.toolsVisible}
                onVisibleChange={this.handleToolsVisibleChange}
              >
                <Tooltip title='Colors'>
                  <ToggleButton
                    key={2}
                    type='primary'
                    className={classes.actionButton}
                  >
                    <MoreVert className={classes.actionIcon} />
                  </ToggleButton>
                </Tooltip>
              </Popover>

              <Popover
                icon={null}
                content={
                  <div>
                    <Typography>Line Color</Typography>
                    <CompactPicker
                      id='lineColor'
                      color={this.state.lineColor}
                      onChange={(color) =>
                        this.setState({ lineColor: color.hex })}
                    />

                    <br />
                    <br />

                    <Typography>Fill Color</Typography>
                    <CompactPicker
                      color={this.state.fillColor}
                      onChange={(color) =>
                        this.setState({ fillColor: color.hex })}
                    />

                    <br />
                    <br />
                    <Typography>Fill Enable</Typography>
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
                <Tooltip title='Colors'>
                  <ToggleButton
                    key={3}
                    //value={Tools.Line}
                    className={classes.actionButton}
                  >
                    <ColorLens className={classes.actionIcon} />
                  </ToggleButton>
                </Tooltip>
              </Popover>

              <Popover
                icon={null}
                content={
                  <div>
                    <Paper
                      style={{
                        maxHeight: 130,
                        overflow: 'auto',
                        alignItems: 'center',
                      }}
                    >
                      <List>
                        <div style={{ padding: 20 }}>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 1
                          </Button>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 2
                          </Button>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 3
                          </Button>
                        </div>
                        <div style={{ padding: 20 }}>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 1
                          </Button>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 2
                          </Button>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 3
                          </Button>
                        </div>
                        <div style={{ padding: 20 }}>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 1
                          </Button>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 2
                          </Button>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 3
                          </Button>
                        </div>
                        <div style={{ padding: 20 }}>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 1
                          </Button>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 2
                          </Button>
                          <Button
                            color='primary'
                            onClick={this._setTemplate}
                            disabled={this.state.disableAddImage}
                          >
                            Test Image 3
                          </Button>
                        </div>
                      </List>
                    </Paper>

                    <br />

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
                                Drag 'n' drop some files here, or click to
                                select files
                              </p>
                            </div>
                          </section>
                        )}
                      </Dropzone>
                    </div>
                  </div>
                }
                title='Select Image'
                trigger='click'
                placement='bottomLeft'
                visible={this.state.imageVisible}
                onVisibleChange={this.handleInsertImageVisibleChange}
              >
                <Tooltip title='Insert Image'>
                  <ToggleButton key={4} className={classes.actionButton}>
                    <InsertPhoto className={classes.actionIcon} />
                  </ToggleButton>
                </Tooltip>
              </Popover>
              <Tooltip title='Add Text'>
                <ToggleButton
                  key={5}
                  id={'select'}
                  type='primary'
                  onClick={this._performSetTextAndReset}
                >
                  <Title />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Erase'>
                <ToggleButton
                  key={7}
                  value={Tools.Eraser}
                  onClick={(event) => {
                    this.setState({
                      tool: 'eraser',
                    })
                  }}
                  className={classes.actionButton}
                >
                  <Erase />
                </ToggleButton>
              </Tooltip>
              <Tooltip title='Save'>
                <ToggleButton
                  key={6}
                  //value={Tools.Pencil}
                  onClick={this._download}
                  // className={classes.actionButton}
                >
                  <Save />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>

            <div
              style={{
                display: 'flex',
                float: 'right',
                padding: 2,
              }}
            >
              <div style={{ paddingRight: 10 }}>
                <Tooltip title='Hide Drawing'>
                  <Grid
                    component='label'
                    container
                    alignItems='center'
                    spacing={1}
                  >
                    <Grid item style={{ paddingTop: 8 }}>
                      Hide
                    </Grid>
                    <Grid item>
                      <Switch
                        checkedChildren='Yes'
                        unCheckedChildren='No'
                        checked={this.state.hideEnable}
                        onChange={this._hideDrawing}
                      />
                    </Grid>
                  </Grid>
                </Tooltip>
              </div>

              <Tooltip title='Undo'>
                <IconButton
                  color='primary'
                  disabled={!this.state.canUndo}
                  onClick={this._undo}
                >
                  <UndoIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title='Redo'>
                <IconButton
                  color='primary'
                  disabled={!this.state.canRedo}
                  onClick={this._redo}
                >
                  <RedoIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title='Remove All'>
                <IconButton
                  color='primary'
                  disabled={!this.state.canClear}
                  onClick={this._clear}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
            <br />
            <br />
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
              width={this.state.sketchWidth}
            />
          </GridItem>
        </GridContainer> */}
      </div>
    )
  }
}

export default (ControlTest)
