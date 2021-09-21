import React, { useState, useEffect } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromHTML,
} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
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

const Findings = ({
  item,
  scriblenotes,
  defaultValue,
  onChange,
  args,
  index,
  scribbleNoteUpdateState,
  loading,
  ...restProps
}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  useEffect(() => {
    if (defaultValue && defaultValue !== '') {
      const blocksFromHTML = convertFromHTML(defaultValue)
      if (blocksFromHTML && blocksFromHTML.contentBlocks !== null) {
        const newState = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap,
        )
        setEditorState(EditorState.createWithContent(newState))
      }
    }
  }, [defaultValue])

  useEffect(() => {
    onChange(getHtmlFromEditorState(editorState))
  }, [editorState])

  const getHtmlFromEditorState = editorState => {
    const currentContent = editorState.getCurrentContent()
    if (currentContent.plainText === '') return

    return draftToHtml(convertToRaw(currentContent))
  }

  const onEditorStateChange = editorState => {
    Window.__editorState = editorState
    setEditorState(editorState)
  }

  return (
    <div>
      <GridContainer>
        <GridItem sm={9} md={9}>
          <Typography>Examination Findings</Typography>
        </GridItem>
        <GridItem sm={3} md={3}>
          <div
            style={{
              height: 30,
              textAlign: 'right',
            }}
          >
            <Checklist
              checklistCategory={CHECKLIST_CATEGORY.RADIOLOGY}
              buttonStyle={{ marginRight: '0px' }}
              onChecklistConfirm={checklist => {
                const current = getHtmlFromEditorState(editorState)
                const appended = current + ' ' + checklist

                const blocksFromHTML = convertFromHTML(appended)

                const newState = ContentState.createFromBlockArray(
                  blocksFromHTML.contentBlocks,
                  blocksFromHTML.entityMap,
                )

                setEditorState(EditorState.createWithContent(newState))
              }}
              {...restProps}
            />
          </div>
        </GridItem>
        <GridItem sm={12} md={12}>
          <RichEditor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            stripPastedStyles={false}
            strongLabel
            height={250}
          />
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default Findings
