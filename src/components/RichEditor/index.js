import React, { PureComponent, Component } from 'react'
import PropTypes, { instanceOf } from 'prop-types'
import _ from 'lodash'
import {
  EditorState,
  ContentState,
  convertToRaw,
  Modifier,
  Entity,
} from 'draft-js'
import { stateFromHTML } from 'draft-js-import-html'
import draftToHtml from 'draftjs-to-html'
import { Editor } from 'react-draft-wysiwyg'
import withStyles from '@material-ui/core/styles/withStyles'
import classnames from 'classnames'
import htmlToDraft from 'html-to-draftjs'
import htmlEscape from 'react-escape-html'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { control } from '@/components/Decorator'
import { CustomInput } from '@/components'

const STYLES = (theme) => {
  return {
    wrapper: {},
    editor: {
      minHeight: 120,
    },
  }
}

@control()
class RichEditor extends React.PureComponent {
  static propTypes = {
    // optional props
    label: PropTypes.string,
  }

  static defaultProps = {}

  constructor (props) {
    super(props)
    const { form, field } = props
    const v = form && field ? field.value : props.value || props.defaultValue
    let editorState

    if (v) {
      const contentBlock = htmlToDraft(v)
      editorState = EditorState.createWithContent(
        ContentState.createFromBlockArray(contentBlock.contentBlocks),
      )
    } else {
      editorState = EditorState.createEmpty()
    }

    this.state = {
      value: EditorState.moveSelectionToEnd(editorState),
      anchorEl: null,
      isEditorFocused: false,
    }

    this.editorCfg = {
      toolbar: {
        options: [
          'inline',
          'blockType',
          // 'fontSize',
          'list',
          'textAlign',
          // 'colorPicker',
          // 'link',
          // 'embedded',
          // 'emoji',
          // 'image',
          'remove',
          'history',
        ],
        inline: { inDropdown: true },
        list: { inDropdown: true },
        textAlign: { inDropdown: true },
        link: { inDropdown: true },
      },
    }

    this.setDomEditorRef = (ref) => (this.domEditor = ref)

    // this.debouncedOnChange = _.debounce(this._onChange.bind(this), 300)
  }

  componentDidMount () {}

  // eslint-disable-next-line camelcase
  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { field, value } = nextProps
    const { isEditorFocused } = this.state
    let v = value || ''
    if (field) {
      v = field.value || ''
      // v = field.value || ''
      // this.setState({
      //   value: field.value,
      // })
    }
    // console.log(
    //   isEditorFocused,
    //   v,
    //   this.state.value.getCurrentContent().getPlainText(),
    //   this.state.value.getCurrentContent(),
    //   convertToRaw(this.state.value.getCurrentContent()),
    //   draftToHtml(convertToRaw(this.state.value.getCurrentContent())),
    // )
    if (
      !isEditorFocused &&
      draftToHtml(convertToRaw(this.state.value.getCurrentContent())) !== v
    ) {
      // console.log(
      //   'update rich text',
      //   draftToHtml(convertToRaw(this.state.value.getCurrentContent())),
      //   v,
      // )
      if (!v) {
        this.setState({
          value: EditorState.createEmpty(),
        })
      } else {
        this.setState({
          value: EditorState.createEmpty(),
        })
        const contentBlock = htmlToDraft(v)
        const newEditorState = EditorState.createWithContent(
          ContentState.createFromBlockArray(contentBlock.contentBlocks),
        )
        this.setState({
          value: EditorState.moveSelectionToEnd(newEditorState),
        })
      }
    }
  }

  onChange = (editorState) => {
    // console.log(editorState)
    // const {onChange}=this.props
    this.setState({
      value: editorState,
    })
    // this.debouncedOnChange(editorState)
  }

  // _onChange = (editorState) => {
  //   const { props } = this
  //   const { onChange } = props

  //   const textEditorValue = this.state.value.getCurrentContent().getPlainText()

  //   const v = {
  //     target: {
  //       value:
  //         textEditorValue == ''
  //           ? ''
  //           : draftToHtml(convertToRaw(editorState.getCurrentContent())),
  //       // name: props.field.name,
  //     },
  //   }
  //   // console.log(props.field, props.field.onChange)
  //   if (props.field && props.field.onChange) {
  //     v.target.name = props.field.name
  //     props.field.onChange(v)
  //   }
  //   if (onChange) {
  //     onChange(v)
  //   }
  // }

  _onFocus = () => {
    this.setState((prevState) => ({
      isEditorFocused: false,
      // value: EditorState.moveFocusToEnd(prevState.value),
    }))
  }

  _onBlur = () => {
    this.setState({ isEditorFocused: false })
    const { props } = this
    const { onChange } = props

    const textEditorValue = this.state.value.getCurrentContent().getPlainText()
    // console.log('_onBlur')
    const v = {
      target: {
        value:
          textEditorValue === ''
            ? ''
            : draftToHtml(convertToRaw(this.state.value.getCurrentContent())),
        // name: props.field.name,
      },
    }
    // console.log(props.field, props.field.onChange)
    if (props.field && props.field.onChange) {
      v.target.name = props.field.name
      props.field.onChange(v)
    }
    if (onChange) {
      onChange(v)
    }
  }

  tagButtonOnClick = (selectedValue) => {
    const newEditorState = this.insertSelectedTagToEditor(selectedValue)

    this.setState({
      value: newEditorState,
    })

    // this.debouncedOnChange(newEditorState)
  }

  // For the TagButton
  tagButtonHandleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  tagButtonHandleClose = () => {
    this.setState({ anchorEl: null })
  }

  insertSelectedTagToEditor = (selectedValue) => {
    const { value } = this.state
    const currentEditorSelection = value.getSelection()
    const currentContentState = value.getCurrentContent()

    let newContentState
    const selectionEnd = currentEditorSelection.getEndOffset()
    const selectionStart = currentEditorSelection.getStartOffset()

    const entityKey = Entity.create('MENTION', 'SEGMENTED', {
      value: selectedValue,
      url: '',
    })
    if (selectionEnd === selectionStart) {
      newContentState = Modifier.insertText(
        currentContentState,
        currentEditorSelection,
        `@${selectedValue}`,
        null,
        entityKey,
      )
    } else {
      newContentState = Modifier.replaceText(
        currentContentState,
        currentEditorSelection,
        `@${selectedValue}$nbsp;`,
        null,
        entityKey,
      )
    }
    return EditorState.push(value, newContentState, 'insert-fragment')
  }

  setEditorReference = (ref) => {
    this.editorReferece = ref
    // ref.focus()
  }

  getComponent = ({ inputRef, ...props }) => {
    const {
      classes,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      tagList,
      disabled,
      ...restProps
    } = this.props
    const { form, field, value } = restProps
    // console.log('getComponent', restProps)
    let metionCfg = {}
    if (tagList) {
      metionCfg = {
        separator: ' ',
        trigger: '@',
        suggestions: tagList,
      }
    }
    return (
      <div style={{ width: '100%', height: 'auto' }} {...props}>
        <Editor
          readOnly={disabled}
          editorState={this.state.value}
          wrapperClassName={classnames({
            [classes.wrapper]: true,
            [this.wrapperClassName]: true,
          })}
          editorClassName={classnames({
            [classes.editor]: true,
            [this.editorClassName]: true,
          })}
          onEditorStateChange={this.onChange}
          onFocus={this._onFocus}
          onBlur={this._onBlur}
          editorRef={this.setEditorReference}
          {...metionCfg}
          {...this.editorCfg}
          {...this.props}
        />
      </div>
    )
  }

  getTagButtonComponent = () => {
    const { tagList } = this.props
    const { anchorEl } = this.state
    const ITEM_HEIGHT = 64

    return (
      <div>
        <Button
          onClick={this.tagButtonHandleClick}
          aria-controls='customized-menu'
          aria-haspopup='true'
          variant='contained'
          color='primary'
        >
          Tag
        </Button>
        <Menu
          id='long-menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={this.tagButtonHandleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 250,
            },
          }}
        >
          {tagList.map((tag) => (
            <MenuItem
              key={tag.value}
              onClick={() => {
                this.tagButtonOnClick(tag.text)
                this.tagButtonHandleClose()
                setTimeout(() => {
                  this.editorReferece.focus()
                }, 1)
              }}
            >
              {tag.text}
            </MenuItem>
          ))}
        </Menu>
      </div>
    )
  }

  render () {
    const { props } = this
    const { classes, mode, onChange, tagList, ...restProps } = props

    const labelProps = {
      shrink: true,
    }

    if (tagList !== undefined) {
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
          {this.getTagButtonComponent()}
        </React.Fragment>
      )
    }
    return (
      <CustomInput
        labelProps={labelProps}
        inputComponent={this.getComponent}
        noUnderLine
        preventDefaultChangeEvent
        preventDefaultKeyDownEvent
        {...restProps}
      />
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

export default withStyles(STYLES, { name: 'RichEditor' })(RichEditor)
