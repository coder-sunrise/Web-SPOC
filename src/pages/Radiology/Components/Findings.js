import React, { useState, useEffect } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { connect } from 'dva'
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
  CommonModal,
} from '@/components'
import Authorized from '@/utils/Authorized'
import { Typography, Input } from 'antd'
import { CHECKLIST_CATEGORY, SCRIBBLE_NOTE_TYPE } from '@/utils/constants'
import { navigateDirtyCheck } from '@/utils/utils'
import ScribbleNote from '../../Shared/ScribbleNote/ScribbleNote'

const Findings = ({
  // item,
  scriblenotes,
  defaultValue,
  onChange,
  args,
  index,
  // scribbleNoteUpdateState,
  loading,
  ...restProps
}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [width, setWidth] = useState(0)
  const [showScribbleModal, setScribbleModal] = useState(scriblenotes?.showScribbleModal || false)
  const [selectedData, setSelectedScribble] = useState('')

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

  const scribbleNoteUpdateState = () => {

  }
  
  useEffect(() => {
    resize()
  },[])
  const resize = () => {
    if (window.innerWidth <= 1785) {
      setWidth(window.innerWidth / 11)
    } else {
      setWidth(window.innerWidth / 5.8)
    }
  }

  const toggleScribbleModal = () => {
    setScribbleModal(!showScribbleModal)
  }

  const scribbleNoteDrawing = () => {
  }

  const insertIntoClinicalNote = () => {
  }

  const deleteScribbleNote = () => {
  }

  const item = {
    authority: 'queue.consultation.clinicalnotes.history',
    category: 'RadiologyFindings',
    fieldName: 'RadiologyFindings',
    fieldTitle: 'RadiologyFindings',
    scribbleField: 'radiologyFindingsScribbleArray',
    scribbleNoteTypeFK: SCRIBBLE_NOTE_TYPE.RADIOLOGY,
    index: 0,
    height: 390,
    enableSetting: 'isEnableClinicNoteHistory'
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
            <ScribbleNoteItem
              scribbleNoteUpdateState={scribbleNoteUpdateState}
              category={item.category}
              arrayName={item.scribbleField}
              categoryIndex={item.scribbleNoteTypeFK}
              scribbleNoteArray={[]}//scriblenotes[item.category][item.scribbleField]}
              gridItemWidth={width}
            />

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

      <CommonModal
        open={showScribbleModal}
        title='Scribble'
        fullScreen
        bodyNoPadding
        observe='ScribbleNotePage'
        onClose={() =>
          navigateDirtyCheck({
            onProceed: toggleScribbleModal(),
          })
        }
      >
        <ScribbleNote
          // {...this.props}
          addScribble={scribbleNoteDrawing}
          exportToClinicalNote={insertIntoClinicalNote}
          toggleScribbleModal={toggleScribbleModal}
          scribbleData={selectedData}
          deleteScribbleNote={deleteScribbleNote}
        />
      </CommonModal>
    </div>
  )
}

export default Findings
