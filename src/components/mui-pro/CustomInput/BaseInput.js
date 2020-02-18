import React from 'react'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
// nodejs library that concatenates classes
import classNames from 'classnames'
import AutosizeInput from 'react-input-autosize'
import $ from 'jquery'
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import { InputAdornment, CircularProgress } from '@material-ui/core'
import numeral from 'numeral'
import Error from '@material-ui/icons/Error'
import Input from '@material-ui/core/Input'
import customInputStyle from 'mui-pro-jss/material-dashboard-pro-react/components/customInputStyle.jsx'
import { Tooltip } from '@/components'
import { extendFunc, currencyFormat } from '@/utils/utils'
import CustomInputWrapper from '../CustomInputWrapper'
import FormatInput from './FormatInput'

const _config = {
  inputPropsArray: {
    key: 'inputProps',
    value: [
      'value',
      'name',
      'defaultValue',
      'onChange',
      // 'onBlur',
      // 'onFocus',
      // 'onMouseLeave',
      'autoFocus',
      'multiline',
      'rows',
      'rowsMax',
      'type',
      'disabled',
      'inputComponent',
      'maxLength',
      'autocomplete',
    ],
  },
}
const inputIdPrefix = 'medsysinput'
let inputIdCounter = 0
class BaseInput extends React.PureComponent {
  constructor (props) {
    super(props)
    this.uid = inputIdPrefix + inputIdCounter
    inputIdCounter += 1
  }

  _onKeyUp = (e) => {
    // console.log(e.target)
    if (this.props.preventDefaultKeyDownEvent) return
    if (e.target.tagName === 'TEXTAREA') return
    // console.log(e, this)
    if (e.which === 13) {
      // onEnterPressed
      const { onEnterPressed, loseFocusOnEnterPressed = false } = this.props
      if (onEnterPressed) onEnterPressed(e)
      if (loseFocusOnEnterPressed) {
        document.activeElement.blur()
      }
      let loop = 0
      let target = $(e.target)
      if (target.attr('enterkey')) {
        const btn = $(`button${target.attr('enterkey')}`)
        setTimeout(() => {
          btn.trigger('click')
        }, 200)
      } else {
        while (loop < 100) {
          const newTarget = $(target.parents('div,tr')[0])
          if (newTarget.length === 0) break
          const btn = newTarget.find(
            "button[data-button-type='progress'][defaultbinding!='none']",
          )

          if (btn.length > 0) {
            if (this.props.onCommit) {
              this.props.onCommit({
                target: {
                  value: e.target.value,
                },
              })
              setTimeout(() => {
                btn.trigger('click')
              }, 200)
            } else {
              setTimeout(() => {
                btn.trigger('click')
              }, 200)
            }
            break
          }
          target = newTarget
          loop += 1
        }
      }
    }
  }

  getRef = (ref) => {
    this.refEl = ref
  }

  getClass = (classes) => {
    const {
      success,
      simple,
      noUnderline,
      normalText,
      white,
      rightAlign,
      currency,
      inputRootCustomClasses,
      negative,
      text,
      inActive,
      defaultCurrencyFontColor,
    } = this.props
    let { error, help } = this.props
    // if (field && form) {
    //   const shouldShow =
    //     Object.byString(form.touched, field.name) || form.submitCount > 0
    //   if (!error) {
    //     error = shouldShow && !!Object.byString(form.errors, field.name)
    //   }
    //   if (error) {
    //     if (inputProps) inputProps.autoFocus = true
    //     help =
    //       !showErrorIcon && shouldShow
    //         ? Object.byString(form.errors, field.name)
    //         : help
    //   }
    // }
    // console.log(this)
    const underlineClasses = classNames({
      [classes.underlineError]: error,
      [classes.underlineSuccess]: success && !error,
      [classes.underline]: true,
      [classes.noUnderline]: noUnderline || text,
      [classes.rightAlign]: rightAlign,
      [classes.simple]: simple,
      [classes.inputRoot]: true,
      [classes.textInput]: !!text,
      [classes.whiteUnderline]: white,
      [classes.currency]: text && currency,
      [classes.negativeCurrency]: text && negative && !defaultCurrencyFontColor,
      [classes.inActive]: text && inActive,
    })

    // console.log(underlineClasses)
    const marginTop = classNames({
      [inputRootCustomClasses]: inputRootCustomClasses !== undefined,
    })
    const inputClasses = classNames({
      [classes.input]: true,
      [classes.whiteInput]: white,
      [classes.text]: !!text,
    })
    return {
      input: inputClasses,
      root: marginTop,
      disabled: classes.disabled,
      underline: underlineClasses,
      multiline: classes.multiline,
    }
  }

  render () {
    // console.log(this)
    const { field, form, theme, classes, ...props } = this.props
    for (const key in _config) {
      if (Object.prototype.hasOwnProperty.call(_config, key)) {
        const element = _config[key]
        element.value.forEach((o) => {
          if (props[o] !== undefined) {
            if (!props[element.key]) props[element.key] = {}
            props[element.key][o] = props[o]
            delete props[o]
          }
        })
      }
    }
    let {
      formControlProps = {},
      prefixProps,
      suffixProps,
      label,
      readonly = false,
      inputProps = {},
      labelProps = {},
      children,
      error,
      validBeforeChange = false,
      showErrorIcon,
      white,
      inputRootCustomClasses,
      success,
      help,
      fullWidth,
      number,
      currency,
      creditCard,
      qty,
      control = 1,
      prefix,
      suffix,
      colon = true,
      realtime = true,
      focus = false,
      isDebouncing = false,
      preventDefaultKeyDownEvent,
      preventDefaultChangeEvent,
      size,
      style,
      onKeyUp,
      onKeyDown,
      text,
      simple,
      onBlur,
      onFocus,
    } = props

    // console.log(this.state, this.state.value)
    // if (this.state && this.state.value !== undefined) {
    //   inputProps.value = this.state.value
    // }
    const { rowsMax, ...resetProps } = inputProps
    const cfg = {
      fullWidth: fullWidth !== undefined ? fullWidth : !text,
      readOnly: readonly,
    }
    const adornmentClasses = classNames({
      [classes.adornment]: true,
      // [classes.textAdornment]: !!text,
    })
    if (prefix) {
      cfg.startAdornment = (
        <InputAdornment
          classes={{
            root: adornmentClasses,
          }}
          position='start'
          {...prefixProps}
        >
          {prefix}
        </InputAdornment>
      )
      if (!labelProps) labelProps = {}
      labelProps.shrink = true
    }
    if (suffix || isDebouncing) {
      cfg.endAdornment = isDebouncing ? (
        <InputAdornment
          position='end'
          classes={{
            root: adornmentClasses,
          }}
          {...suffixProps}
        >
          <CircularProgress />
        </InputAdornment>
      ) : (
        <InputAdornment
          position='end'
          classes={{
            root: adornmentClasses,
          }}
          {...suffixProps}
        >
          {suffix}
        </InputAdornment>
      )
    }
    if (!preventDefaultChangeEvent) {
      // console.log('preventDefaultChangeEvent input blur')

      cfg.onBlur = onBlur
      cfg.onFocus = onFocus
    }
    if (!preventDefaultKeyDownEvent) {
      cfg.onKeyUp = extendFunc(onKeyUp, this._onKeyUp)
      cfg.onKeyDown = onKeyDown
    }
    // console.log({ error, showErrorIcon })
    if (error && error.length && showErrorIcon) {
      cfg.endAdornment = (
        <InputAdornment
          position='end'
          classes={{
            root: classNames(adornmentClasses, classes.errorAdornment),
          }}
          style={{ width: 'auto' }}
        >
          <Tooltip
            title={
              typeof error === 'string' ? (
                error
              ) : (
                Object.byString(form.errors, field.name)
              )
            }
            enterDelay={0}
          >
            <Error color='error' style={{ cursor: 'pointer', top: 0 }} />
          </Tooltip>
        </InputAdornment>
      )
    }

    if (text) {
      if (simple && !inputProps.inputComponent && !error) {
        // return (
        //   <Input
        //     classes={this.getClass(classes)}
        //     inputRef={this.getRef}
        //     {...cfg}
        //     inputProps={inputProps}
        //     {...resetProps}
        //   />
        // )
        return (
          <Tooltip title={inputProps.value} enterDelay={750}>
            <span>{inputProps.value}</span>
          </Tooltip>
        )
      }
      cfg.inputComponent = ({ className }) => {
        return (
          <Tooltip title={inputProps.value} enterDelay={750}>
            <AutosizeInput
              readOnly
              inputClassName={className}
              tabIndex='-1'
              {...inputProps}
              title=''
            />
          </Tooltip>
        )
      }
    }
    if (
      !(
        inputProps.value === undefined ||
        inputProps.value === null ||
        inputProps.value === '' ||
        inputProps.value.length === 0
      )
    ) {
      labelProps.shrink = true
    }
    const element = (
      <CustomInputWrapper
        id={inputIdPrefix + inputIdCounter}
        labelProps={labelProps}
        {...props}
        style={style}
        error={error}
        help={help}
      >
        {(typeof children === 'function'
          ? children({
              getClass: this.getClass,
              error,
              help,
              showErrorIcon,
              form,
              field,
              focus,
              ...cfg,
              ...props,
              inputProps,
            })
          : false) || (
          <Input
            id={inputIdPrefix + inputIdCounter}
            classes={this.getClass(classes)}
            inputRef={this.getRef}
            {...cfg}
            inputProps={inputProps}
            {...resetProps}
            // {...inputProps}
            // onBlur={() => {
            //   console.log(123)
            // }}
          />
        )}
      </CustomInputWrapper>
    )
    return element
  }
}

BaseInput.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  inputRootCustomClasses: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
    PropTypes.string,
  ]),
  success: PropTypes.bool,
  white: PropTypes.bool,
  help: PropTypes.node,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
}

export default withStyles(customInputStyle, {
  name: 'BaseInput',
  withTheme: true,
})(BaseInput)
