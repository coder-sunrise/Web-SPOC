import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import {
  RichEditor,
  ScribbleNoteItem,
  GridContainer,
  GridItem,
  Checklist,
} from '@/components'
import Authorized from '@/utils/Authorized'
import { Typography, Input } from 'antd'
import { CHECKLIST_CATEGORY } from '@/utils/constants'

class Findings extends Component {
  state = {
    scribbleNoteArray: [],
  }
  constructor(props) {
    super(props)
    this.richEditor = React.createRef()
  }

  scribbleNoteUpdateState = (
    categoryValue,
    arrayNameValue,
    categoryIndexValue,
    selectedDataValue,
  ) => {
    this.setState({
      category: categoryValue,
      arrayName: arrayNameValue,
      categoryIndex: categoryIndexValue,
      selectedData: selectedDataValue,
    })
  }

  render() {
    const {
      item,
      scriblenotes,
      // width,
      args,
      index,
      scribbleNoteUpdateState,
      loading,
    } = this.props
    return (
      <div>
        {/*<RichEditor
          editorRef={(ref) => {
            this.richEditor = ref
          }}
          // autoFocus={index === 0}
          // disabled={loading.global}
          style={{ marginBottom: 0 }}
          strongLabel
          height={250}
          // {...args}
        />*/}

        <GridContainer>
          <GridItem sm={9} md={9}>
            <Typography>Examination Findings</Typography>
          </GridItem>
          <GridItem sm={3} md={3}>
            <div
            style={{
              height: 30,
            }}
            >
              <ScribbleNoteItem
                scribbleNoteUpdateState={this.scribbleNoteUpdateState}
                category='Radiology'
                arrayName='radiologyScribbleArray'
                categoryIndex={9}
                scribbleNoteArray={this.state.scribbleNoteArray}
                // gridItemWidth={width}
              />
              <Checklist 
                checklistCategory={CHECKLIST_CATEGORY.RADIOLOGY}
                editorRef={this.richEditor}
                {...this.props}
              />
            </div>
          </GridItem>
          <GridItem sm={12} md={12}>
            <RichEditor 
              editorRef={(ref) => {
                this.richEditor = ref
              }}
              strongLabel
              height={250}
            />       
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}
export default Findings
