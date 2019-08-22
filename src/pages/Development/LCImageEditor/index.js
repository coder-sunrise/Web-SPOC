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
} from '@material-ui/core'
import { GridContainer, GridItem, SketchField, Tools } from '@/components'

import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

// import { SketchField, Tools } from '@/components'
// import { SketchField, Tools } from 'react-sketch'
import MoreVert from '@material-ui/icons/MoreVert'
import ColorLens from '@material-ui/icons/ColorLens'
import Create from '@material-ui/icons/Create'
import InsertPhoto from '@material-ui/icons/InsertPhoto'
import Title from '@material-ui/icons/Title'
// const { SketchField } = rs
console.log(SketchField, Tools)
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
})
class ControlTest extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      tool: 'line',
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
            <div
              style={{
                // width: 50,
                // borderRadius: 3,
                // backgroundColor: '#ccc',
                // position: 'absolute',
                // left: 5,
                // top: 5,
              }}
            >
              <ToggleButtonGroup
                // size='small'
                // value={alignment}
                exclusive
                onChange={(e, v) => {
                  console.log(e.target, v)
                  this.setState({
                    tool: v,
                  })
                }}
                value={this.state.tool}
              >
                <ToggleButton
                  key={1}
                  // selected={this.state === Tools.Select}
                  value={Tools.Select}
                  className={classes.actionButton}
                >
                  <MoreVert className={classes.actionIcon} />
                </ToggleButton>
                <ToggleButton
                  key={2}
                  value={Tools.Line}
                  className={classes.actionButton}
                >
                  <ColorLens className={classes.actionIcon} />
                </ToggleButton>
                <ToggleButton
                  key={3}
                  onClick={(event) => {}}
                  className={classes.actionButton}
                >
                  <Create className={classes.actionIcon} />
                </ToggleButton>
                <ToggleButton
                  key={4}
                  onClick={(event) => {}}
                  className={classes.actionButton}
                >
                  <InsertPhoto className={classes.actionIcon} />
                </ToggleButton>
                <ToggleButton
                  key={5}
                  onClick={(event) => {}}
                  className={classes.actionButton}
                >
                  <Title className={classes.actionIcon} />
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <SketchField
              className={classes.container}
              ref={(c) => (this._sketch = c)}
              tool={this.state.tool}
              lineWidth={10}
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
