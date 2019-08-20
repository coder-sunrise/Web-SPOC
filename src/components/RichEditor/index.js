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
    this.state = {
      value: v
        ? EditorState.createWithContent(ContentState.createFromText(v))
        : EditorState.createEmpty(),
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
    let v = this.state.value
    if (field) {
      v = field.value
      // this.setState({
      //   value: field.value,
      // })
      Modifier.replaceText(
        this.state.value.getCurrentContent(),
        this.state.value.getSelection(),
        v,
      )
    } else if (value) {
      v = value

      this.setState({
        value: v,
      })
    }
  }

  onChange = (editorState) => {
    // console.log(event)
    this.setState({
      value: editorState,
    })
    this.debouncedOnChange(editorState)
  }

  _onChange = (editorState) => {
    const { props } = this
    const { onChange } = props

    const v = {
      target: {
        value: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        // name: props.field.name,
      },
    }
    if (props.field && props.field.onChange) {
      v.target.name = props.field.name
      props.field.onChange(v)
    }
    if (onChange) {
      onChange(v)
    }
  }

  getComponent = ({ inputRef, ...props }) => {
    const {
      classes,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      ...restProps
    } = this.props
    const { form, field, value } = restProps
    // console.log(this.state.value)

    return (
      <div style={{ width: '100%', height: 'auto' }} {...props}>
        <Editor
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
          {...this.editorCfg}
          {...this.props}
        />
      </div>
    )
  }

  render () {
    const { props } = this
    const { classes, mode, onChange, ...restProps } = props

    const labelProps = {
      shrink: true,
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
