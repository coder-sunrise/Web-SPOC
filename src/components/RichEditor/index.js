import React, { PureComponent, Component } from 'react'
import PropTypes, { instanceOf } from 'prop-types'
import _ from 'lodash'
import { EditorState, ContentState, convertToRaw, Modifier } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { Editor } from 'react-draft-wysiwyg'
import withStyles from '@material-ui/core/styles/withStyles'
import classnames from 'classnames'
import { CustomInput } from '@/components'
import { control } from '@/components/Decorator'
import htmlToDraft from 'html-to-draftjs'
import htmlEscape from 'react-escape-html'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

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
      value: editorState,
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

    this.debouncedOnChange = _.debounce(this._onChange.bind(this), 300)
  }

  componentDidMount () {}

  componentWillReceiveProps (nextProps) {
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
    if (!isEditorFocused) {
      console.log('componentWillReceiveProps', v)

      if (!v) {
        this.setState({
          value: EditorState.createEmpty(),
        })
      } else if (!this.state.value.getCurrentContent().getPlainText().length) {
        const contentBlock = htmlToDraft(v)
        this.setState({
          value: EditorState.createWithContent(
            ContentState.createFromBlockArray(contentBlock.contentBlocks),
          ),
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
    this.debouncedOnChange(editorState)
  }

  _onChange = (editorState) => {
    const { props } = this
    const { onChange } = props

    const textEditorValue = this.state.value.getCurrentContent().getPlainText()

    const v = {
      target: {
        value:
          textEditorValue == ''
            ? ''
            : draftToHtml(convertToRaw(editorState.getCurrentContent())),
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

  _onFocus = () => {
    this.setState({ isEditorFocused: true })
  }

  _onBlur = () => {
    this.setState({ isEditorFocused: false })
  }

  tagButtonOnClick = (selectedValue) => {
    const newEditorState = this.insertSelectedTagToEditor(selectedValue)

    this.setState({
      value: EditorState.push(
        this.state.value,
        newEditorState.getCurrentContent(),
        'insert-fragment',
      ),
    })

    this.debouncedOnChange(newEditorState)
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

    let newEditorState
    let newContentState

    // 判断是否有选中，有则替换，无则插入
    const selectionEnd = currentEditorSelection.getEndOffset()
    const selectionStart = currentEditorSelection.getStartOffset()
    if (selectionEnd === selectionStart) {
      newContentState = Modifier.insertText(
        currentContentState,
        currentEditorSelection,
        selectedValue.toLowerCase(),
      )
    } else {
      newContentState = Modifier.replaceText(
        currentContentState,
        currentEditorSelection,
        selectedValue.toLowerCase(),
      )
    }

    newEditorState = EditorState.push(value, newContentState, 'insert-fragment')

    const selectedValueHtml = htmlEscape`${selectedValue.toLowerCase()}`.__html

    const currentEditorHtml = draftToHtml(
      convertToRaw(newEditorState.getCurrentContent()),
    )

    const editorToHtml = currentEditorHtml.replace(
      selectedValueHtml,
      `&nbsp;<a class="wysiwyg-mention" data-mention data-value="${selectedValue}">${selectedValue}</a>&nbsp;`,
    )

    const contentBlock = htmlToDraft(editorToHtml)

    newEditorState = EditorState.createWithContent(
      ContentState.createFromBlockArray(contentBlock.contentBlocks),
    )

    return newEditorState
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
          mention={{
            // trigger: '<',
            suggestions: tagList,
          }}
          onFocus={this._onFocus}
          onBlur={this._onBlur}
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
              key={tag.id}
              onClick={() => {
                this.tagButtonOnClick(tag.text)
                this.tagButtonHandleClose()
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

    if (tagList != undefined) {
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

export default withStyles(STYLES, { name: 'RichEditor' })(RichEditor)
