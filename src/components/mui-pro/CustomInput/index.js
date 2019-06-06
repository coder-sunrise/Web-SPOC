import React from 'react'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
// nodejs library that concatenates classes
import classNames from 'classnames'
import $ from 'jquery'
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import { InputAdornment, Grid } from '@material-ui/core'
import numeral from 'numeral'
import { Error } from '@material-ui/icons'
import Tooltip from '@material-ui/core/Tooltip'

import Input from '@material-ui/core/Input'
import customInputStyle from 'mui-pro-jss/material-dashboard-pro-react/components/customInputStyle.jsx'
import { extendFunc, currencyFormat } from '@/utils/utils'
// import NumberFormat from 'react-number-format'
import CustomInputWrapper from '../CustomInputWrapper'
import FormatInput from './FormatInput'

const _config = {
  inputPropsArray: {
    key: 'inputProps',
    value: [
      'name',
      'onChange',
      'onBlur',
      'autoFocus',
      'multiline',
      'rows',
      'rowsMax',
      'type',
      'disabled',
    ],
  },
  // formControlPropsArray:{
  //   key:'formControlProps',
  //   value:['fullWidth'],
  // },
}
class CustomInput extends React.PureComponent {
  validationCount = 0

  constructor (props) {
    super(props)
    // this.myRef = React.createRef()
    this.state = {
      value: undefined,
      control: 1,
    }
    if (props.value !== undefined) {
      this.state = {
        value: this.props.value,
      }
    } else if (this.props.field) {
      this.state = {
        value: this.props.field.value,
      }
    }
    // console.log(this.state, props)
  }

  // componentDidMount (){
  //   let {number,currency,field,onChange}=this.props
  //   if((number || currency) && field){
  //     if(field && field.onChange){
  //       onChange=field.onChange
  //     }
  //     $(this.myRef.current)
  //     .on('focus','input',(e)=>{
  //       const el =e.target
  //       let endPos=el.value.length
  //       if(currency){
  //         endPos=el.value.length-3
  //       }
  //       if(el.setSelectionRange){
  //         el.setSelectionRange(0,endPos)
  //       }
  //     })
  //     .on('blur','input',(e)=>{
  //       onChange({
  //         target: {
  //           value: numeral(lastValue).value(),
  //           name:field.name,
  //         },
  //       })
  //     })
  //   }
  // }

  static getDerivedStateFromProps (nextProps, preState) {
    const { value, field, control = 1 } = nextProps
    if (value !== undefined) {
      return {
        value,
        control,
      }
    }
    if (field) {
      return {
        value: field.value,
        // shrink: !!field.value,
        control,
      }
    }
    return null
  }

  // shouldComponentUpdate = (nextProps, nextState) => {
  //   // implement this to avoid heavy rerender on
  //   // pages that have a lot of field, or data input in grid

  //   if (this.props.field && this.props.form) {
  //     const { field: { name }, form: currentForm } = this.props
  //     const { form: nextForm } = nextProps
  //     // if (!name && !nextForm.values[name]) return true

  //     // should rerender when new value !== old value
  //     // or when new value === ''
  //     // or when values[name] IS undefined, need to rerender
  //     // !undefined = true

  //     // return true for all inputs that do not have initialized value(s)
  //     // until input had been touched/updated value
  //     if (currentForm.values[name] === undefined) return true

  //     if (
  //       currentForm.values[name] === '' &&
  //       nextForm.values[name] === '' &&
  //       nextState.shrink === this.state.shrink
  //     ) {
  //       // console.log('should return false', name)
  //       return false
  //     }

  //     if (
  //       nextForm.values[name] !== currentForm.values[name] ||
  //       nextForm.values[name] === '' ||
  //       nextState.shrink !== this.state.shrink
  //     ) {
  //       // console.log('should return true', name)
  //       return true
  //     }
  //   }

  //   return true
  // }

  _onChange = (event) => {
    const { props } = this
    // console.log(event)
    const value = event.target.value
    if (props.readOnly) return
    this.setState({
      value,
    })

    if (props.onChange) {
      props.onChange({
        target: {
          value,
        },
      })
    }
    if (props.inputProps && props.inputProps.onChange) {
      props.inputProps.onChange({
        target: {
          value,
        },
      })
    }
    if (props.field && props.field.onChange) {
      props.field.onChange(
        {
          target: {
            value,
            name: props.field.name,
          },
        },
        props,
      )
    }
  }

  _onKeyDown = (e) => {
    if (e.which === 13) {
      // onEnterPressed
      const { onEnterPressed } = this.props
      if (onEnterPressed) onEnterPressed(e)

      let loop = 0
      let target = $(e.target)
      while (loop < 100) {
        const newTarget = $(target.parents('div,tr')[0])
        if (newTarget.length === 0) break
        const btn = newTarget.find("button[data-button-type='progress']")
        if (btn.length > 0) {
          if (this.props.onCommit) {
            this.props.onCommit({
              target: {
                value: this.state.value,
              },
            })
            setTimeout(() => {
              btn.trigger('click')
            }, 200)
          } else {
            btn.trigger('click')
          }
          break
        }
        target = newTarget
        loop += 1
      }
    }
  }

  _onFocus = (e) => {
    this.setState({ shrink: true })
  }

  _onBlur = () => {
    this.setState({ shrink: !!this.state.value })
  }

  shouldFocus = (error) => {
    return error && this.props.form.submitCount !== this.validationCount
  }

  getRef = (ref) => {
    this.refEl = ref
  }

  getClass = (classes) => {
    const {
      field,
      form,
      success,
      simple,
      noUnderline,
      white,
      // validBeforeChange = ,
      showErrorIcon,
      inputProps,
      inputRootCustomClasses,
    } = this.props
    let { error, help } = this.props
    if (field && form) {
      const shouldShow =
        Object.byString(form.touched, field.name) || form.submitCount > 0
      // || !validBeforeChange
      // console.log(
      //   Object.byString(form.touched, field.name),
      //   form.submitCount,
      //   !validBeforeChange,
      // )
      // console.log(shouldShow)
      // console.log(shouldShow)
      if (!error) {
        error = shouldShow && !!Object.byString(form.errors, field.name)
      }
      if (error) {
        if (inputProps) inputProps.autoFocus = true
        help =
          !showErrorIcon && shouldShow
            ? Object.byString(form.errors, field.name)
            : help
      }
    }
    const underlineClasses = classNames({
      [classes.underlineError]: error,
      [classes.underlineSuccess]: success && !error,
      [classes.underline]: !simple,
      [classes.simple]: simple || noUnderline,
      [classes.inputRoot]: true,
      [classes.whiteUnderline]: white,
    })
    // console.log(underlineClasses)
    const marginTop = classNames({
      [inputRootCustomClasses]: inputRootCustomClasses !== undefined,
    })
    const inputClasses = classNames({
      [classes.input]: true,
      [classes.whiteInput]: white,
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
    const { field, form, theme, simple, ...props } = this.props
    for (const key in _config) {
      if (Object.prototype.hasOwnProperty.call(_config, key)) {
        const element = _config[key]
        element.value.forEach((o) => {
          if (props[o]) {
            if (!props[element.key]) props[element.key] = {}
            props[element.key][o] = props[o]
            delete props[o]
          }
        })
      }
    }
    let {
      classes,
      formControlProps = {},
      defaultValue,
      prefixProps,
      suffixProps,
      label,
      id,
      labelProps,
      inputProps = {},
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
      shrink = false,
    } = props
    // console.log(this.state, this.state.value)
    if (this.state && this.state.value !== undefined) {
      inputProps.value = this.state.value
    }
    inputProps.onChange = extendFunc(inputProps.onFocus, this._onChange)

    inputProps.onFocus = extendFunc(inputProps.onFocus, this._onFocus)

    inputProps.onBlur = extendFunc(inputProps.onBlur, this._onBlur)
    // console.log(this.props)
    if (field && form) {
      inputProps.name = field.name

      // inputProps.onChange = extendFunc(inputProps.onChange, field.onChange) // field.onChange

      // inputProps.onBlur = extendFunc(inputProps.onBlur, (e)=>{
      //   if(!realtime)field.onChange(e)
      //   field.onBlur(e)
      // })
      inputProps.onBlur = extendFunc(inputProps.onBlur, field.onBlur)
      const shouldShow =
        Object.byString(form.touched, field.name) || form.submitCount > 0
      // console.log(shouldShow)
      // console.log(shouldShow)
      if (!error) {
        error = shouldShow && !!Object.byString(form.errors, field.name)
      }
      if (error) {
        focus = focus || this.shouldFocus(error)
        // if (inputProps) inputProps.autoFocus = true
        if (focus && this.refEl && !window.alreadyFocused) {
          this.validationCount = form.submitCount
          this.refEl.focus()
          window.alreadyFocused = true
        }
        help =
          !showErrorIcon && shouldShow
            ? Object.byString(form.errors, field.name)
            : help
      }
    }
    if (prefix) {
      // inputProps.startAdornment =
      //   typeof prefix === 'string' ? (
      //     <InputAdornment
      //       position='start'
      //       dangerouslySetInnerHTML={{
      //         __html: `${prefix.replaceAll(' ', '&nbsp;')}${prefix.trim()
      //           .length === 0
      //           ? ''
      //           : colon ? ':' : ''} `,
      //       }}
      //       {...prefixProps}
      //     />
      //   ) : (
      //     <InputAdornment position='start' {...prefixProps}>
      //       {prefix}
      //     </InputAdornment>
      //   )
      inputProps.startAdornment = (
        <InputAdornment position='start' {...prefixProps}>
          {prefix}
        </InputAdornment>
      )
    }
    if (suffix) {
      // inputProps.endAdornment =
      //   typeof suffix === 'string' ? (
      //     <InputAdornment
      //       position='end'
      //       dangerouslySetInnerHTML={{
      //         __html: `${suffix.replaceAll(' ', '&nbsp;')}`,
      //       }}
      //       {...suffixProps}
      //     />
      //   ) : (
      //     <InputAdornment position='end' {...suffixProps}>
      //       {suffix}
      //     </InputAdornment>
      //   )
      inputProps.endAdornment = (
        <InputAdornment position='end' {...suffixProps}>
          {suffix}
        </InputAdornment>
      )
    }
    // console.log(error, showErrorIcon)
    if (error && showErrorIcon) {
      inputProps.endAdornment = (
        <InputAdornment position='end'>
          <Tooltip
            title={
              typeof error === 'string' ? (
                error
              ) : (
                Object.byString(form.errors, field.name)
              )
            }
          >
            <Error color='error' style={{ cursor: 'pointer' }} />
          </Tooltip>
        </InputAdornment>
      )
    }

    // console.log(inputProps)
    // console.log('custominput', inputProps)

    const element = (
      <CustomInputWrapper
        labelProps={{
          shrink: shrink || this.state.shrink || !!this.state.value,
        }}
        {...props}
        error={error}
        help={help}
      >
        {(typeof children === 'function'
          ? children({
              getClass: this.getClass,
              error,
              showErrorIcon,
              form,
              field,
              focus,
              inputProps,
            })
          : false) || (
          <Input
            classes={this.getClass(classes)}
            id={id}
            defaultValue={defaultValue}
            // placeholder={label}
            fullWidth
            inputRef={this.getRef}
            // inputComponent={inputComponent}
            // inputProps={inputProps}
            onKeyDown={this._onKeyDown}
            {...inputProps}
            // name={name}
          />
        )}
        {/* <Grid container spacing={theme.spacing.unit}>
          {Array.from(Array(this.state.control).keys()).map((i) => {
            console.log(i)
            console.log(inputProps)
            const name = `${inputProps.name}${i}`
            console.log(name)
            const k = i + 1
            return (
              <Grid item xs={12 / this.state.control}>
                <Input
                  classes={{
                    input: inputClasses,
                    root: marginTop,
                    disabled: classes.disabled,
                    underline: underlineClasses,
                    multiline: classes.multiline,
                  }}
                  id={`${id}${k}`}
                  // placeholder={label}
                  fullWidth
                  // inputComponent={inputComponent}
                  // inputProps={inputProps}
                  {...inputProps}
                  name={name}
                />
              </Grid>
            )
          })}
        </Grid> */}
      </CustomInputWrapper>
    )
    // return needWarpper?<div ref={this.myRef} style={{display:'inline-flex',width:fullWidth?'100%':'auto'}}>
    //   {element}
    //                    </div>:element

    // field && console.log(field.name, ' hasrerender')
    return element
  }
}

CustomInput.propTypes = {
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

export default withStyles(customInputStyle, { withTheme: true })(CustomInput)
