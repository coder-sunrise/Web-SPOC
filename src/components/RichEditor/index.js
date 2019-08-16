import React, { PureComponent, Component } from 'react'
import PropTypes, { instanceOf } from 'prop-types'
import { EditorState, convertToRaw } from 'draft-js'
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
      shrink: false,
      value: v,
      editorState: EditorState.createEmpty(),
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
  }

  componentDidMount () {
    if (this.state.value && this.props.query && this.state.data.length === 0) {
      // for remote datasouce, get the selected value by default
      // console.log(this.state.value)
      this.fetchData(this.state.value)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { field, value } = nextProps
    let v = this.state.value
    if (field) {
      v = field.value
      this.setState({
        value: field.value,
      })
    } else if (value) {
      v = value

      this.setState({
        value,
      })
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    })
  }

  handleFocus = () => {
    this.setState({ shrink: true })
  }

  handleBlur = () => {
    // console.log(this.state.value)
    if (
      this.state.value === undefined ||
      this.state.value === null ||
      this.state.value === '' ||
      (this.state.value && this.state.value.length === 0)
    ) {
      this.setState({ shrink: false })
    }
  }

  handleValueChange = (val) => {
    const {
      form,
      field,
      all,
      mode,
      onChange,
      options,
      autoComplete,
      query,
      valueField,
    } = this.props
    let newVal = val

    let proceed = true
    if (onChange) {
      const option = (autoComplete || query ? this.state.data : options).find(
        (o) => o[valueField] === newVal,
      )
      proceed = onChange(newVal, option) !== false
    }
    if (proceed) {
      if (form && field) {
        form.setFieldValue(field.name, newVal)
        form.setFieldTouched(field.name, true)
      }
      this.setState({
        shrink: newVal !== undefined,
        value: newVal,
      })
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
    // console.log(options)

    return (
      <div style={{ width: '100%', height: 'auto' }} {...props}>
        <Editor
          editorState={this.state.editorState}
          wrapperClassName={classnames({
            [classes.wrapper]: true,
            [this.wrapperClassName]: true,
          })}
          editorClassName={classnames({
            [classes.editor]: true,
            [this.editorClassName]: true,
          })}
          onEditorStateChange={this.onEditorStateChange}
          {...this.editorCfg}
          {...this.props}
        />
      </div>
    )
  }

  render () {
    const { props } = this
    const { classes, mode, onChange, ...restProps } = props
    const { value } = this.state

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
