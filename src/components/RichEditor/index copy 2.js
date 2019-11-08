import React, { PureComponent, Component } from 'react'
import PropTypes, { instanceOf } from 'prop-types'
import jss from 'jss'
import _ from 'lodash'
import {
  Editor,
  EditorState,
  ContentState,
  convertToRaw,
  Modifier,
  Entity,
  RichUtils,
  getDefaultKeyBinding,
} from 'draft-js'
import { stateFromHTML } from 'draft-js-import-html'
import draftToHtml from 'draftjs-to-html'
import withStyles from '@material-ui/core/styles/withStyles'
import classnames from 'classnames'
import htmlToDraft from 'html-to-draftjs'
import htmlEscape from 'react-escape-html'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { control } from '@/components/Decorator'
import { CustomInput, Button } from '@/components'
import { htmlEncodeByRegExp, htmlDecodeByRegExp } from '@/utils/utils'

const STYLES = (theme) => {
  return {
    wrapper: {
      // height: '90%',
    },
    editor: {
      minHeight: 120,
      '& > div': {
        height: '99%',
      },
    },
  }
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
}
function getBlockStyle (block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote'
    default:
      return null
  }
}
class StyleButton extends React.Component {
  constructor () {
    super()
    this.onToggle = (e) => {
      e.preventDefault()
      this.props.onToggle(this.props.style)
    }
  }

  render () {
    let className = 'RichEditor-styleButton'
    if (this.props.active) {
      className += ' RichEditor-activeButton'
    }
    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    )
  }
}
const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' },
]
const BlockStyleControls = (props) => {
  const { editorState } = props
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()
  return (
    <div className='RichEditor-controls'>
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}
let INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
]
const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle()

  return (
    <div className='RichEditor-controls'>
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}

@control()
class RichEditor extends React.PureComponent {
  constructor (props) {
    super(props)

    const { form, field } = props
    const v = htmlDecodeByRegExp(
      form && field ? field.value : props.value || props.defaultValue,
    )
    let editorState

    if (v) {
      const contentBlock = htmlToDraft(v)
      editorState = EditorState.createWithContent(
        ContentState.createFromBlockArray(contentBlock.contentBlocks),
      )
    } else {
      editorState = EditorState.createEmpty()
    }

    this.state = { editorState }
    this.focus = () => this.editorReferece.focus()
    this.onChange = (es) => this.setState({ editorState: es })
    this.handleKeyCommand = this._handleKeyCommand.bind(this)
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this)
    this.toggleBlockType = this._toggleBlockType.bind(this)
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this)
  }

  _handleKeyCommand (command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      this.onChange(newState)
      return true
    }
    return false
  }

  _mapKeyToEditorCommand (e) {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        this.state.editorState,
        4 /* maxDepth */,
      )
      if (newEditorState !== this.state.editorState) {
        this.onChange(newEditorState)
      }
      return
    }
    return getDefaultKeyBinding(e)
  }

  _toggleBlockType (blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
  }

  _toggleInlineStyle (inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle),
    )
  }

  setEditorReference = (ref) => {
    this.editorReferece = ref
    // ref.focus()
  }

  getTagButtonComponent = () => {
    const { tagList } = this.props

    return (
      <div>
        {tagList.map((tag) => (
          <Button
            key={tag.id}
            color='info'
            style={{
              marginRight: 2,
              marginBottom: 2,
            }}
            onClick={() => {
              this.tagButtonOnClick(tag.value)
              this.tagButtonHandleClose()
            }}
          >
            {tag.text}
          </Button>
        ))}
      </div>
    )
  }

  tagButtonOnClick = (selectedValue) => {
    const newEditorState = this.insertSelectedTagToEditor(selectedValue)

    this.setState({
      editorState: newEditorState,
    })

    // this.debouncedOnChange(newEditorState)
  }

  _onBlur = () => {
    // this.setState({ isEditorFocused: false })
    const { props } = this
    const { onBlur, delimiter } = props

    const textEditorValue = this.state.editorState
      .getCurrentContent()
      .getPlainText()
    // console.log('_onBlur')
    // console.log(
    //   this.state.editorState.getCurrentContent(),
    //   convertToRaw(this.state.editorState.getCurrentContent()),
    //   this.state.editorState.getCurrentContent().getPlainText('\r\n'),
    //   draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
    // )
    const v = {
      target: {
        value:
          textEditorValue === ''
            ? ''
            : htmlEncodeByRegExp(
                draftToHtml(
                  convertToRaw(this.state.editorState.getCurrentContent()),
                ),
              ),
        // name: props.field.name,
      },
    }
    // console.log(props.field, props.field.onChange)
    if (props.field && props.field.onChange) {
      v.target.name = props.field.name
      props.field.onChange(v)
    }
    if (onBlur) {
      onBlur(
        v.target.value,
        this.state.editorState.getCurrentContent().getPlainText(delimiter),
      )
    }
  }

  getComponent = ({ inputRef, ...props }) => {
    const { editorState } = this.state
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor'
    let contentState = editorState.getCurrentContent()
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder'
      }
    }
    return (
      <div style={{ width: '100%', height: 'auto' }} {...props}>
        <div className='RichEditor-root'>
          <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType}
          />
          <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
          />
          <div className={className} onClick={this.focus}>
            <Editor
              blockStyleFn={getBlockStyle}
              customStyleMap={styleMap}
              editorState={editorState}
              handleKeyCommand={this.handleKeyCommand}
              keyBindingFn={this.mapKeyToEditorCommand}
              onChange={this.onChange}
              stripPastedStyles
              // handlePastedText={() => false}
              // placeholder='Tell a story...'
              // ref='editor'
              ref={this.setEditorReference}
              spellCheck
              onBlur={this._onBlur}
            />
          </div>
        </div>
      </div>
    )
  }

  render () {
    const { props } = this
    const { classes, mode, onChange, tagList, onBlur, ...restProps } = props

    const labelProps = {
      shrink: true,
    }

    return (
      <React.Fragment>
        <CustomInput
          labelProps={labelProps}
          inputComponent={this.getComponent}
          noUnderLine
          preventDefaultChangeEvent
          preventDefaultKeyDownEvent
          {...restProps}
        />
        {/* <TagButton onChange={this.tagButtonOnClick} tagList={tagList} /> */}
        {tagList && this.getTagButtonComponent()}
      </React.Fragment>
    )
  }
}

RichEditor.insertBlock = (editorState, blocks, isBefore) => {
  if (!blocks) return editorState
  const currentEditorSelection = editorState.getSelection()
  const contentState = editorState.getCurrentContent()

  const currentBlock = contentState.getBlockForKey(
    currentEditorSelection.getEndKey(),
  )

  const blockMap = contentState.getBlockMap()
  // Split the blocks
  const blocksBefore = blockMap.toSeq().takeUntil((v) => {
    return v === currentBlock
  })
  const blocksAfter = blockMap
    .toSeq()
    .skipUntil((v) => {
      return v === currentBlock
    })
    .rest()
  let newBlocks = isBefore
    ? [
        ...blocks.map((o) => [
          o.getKey(),
          o,
        ]),
        [
          currentBlock.getKey(),
          currentBlock,
        ],
      ]
    : [
        [
          currentBlock.getKey(),
          currentBlock,
        ],
        ...blocks.map((o) => [
          o.getKey(),
          o,
        ]),
      ]
  const newBlockMap = blocksBefore.concat(newBlocks, blocksAfter).toOrderedMap()

  const newContentState = contentState.merge({
    blockMap: newBlockMap,
    selectionBefore: currentEditorSelection,
    selectionAfter: currentEditorSelection,
  })

  return EditorState.push(editorState, newContentState, 'insert-fragment')
}

export default withStyles(STYLES, { name: 'RichEditor', withTheme: true })(
  RichEditor,
)
