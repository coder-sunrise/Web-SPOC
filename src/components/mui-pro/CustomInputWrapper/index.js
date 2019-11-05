import React from 'react'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
// nodejs library that concatenates classes
import classNames from 'classnames'
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'
import customInputStyle from 'mui-pro-jss/material-dashboard-pro-react/components/customInputStyle.jsx'
import { extendFunc } from '@/utils/utils'
import { Tooltip } from '@/components'

const _config = {
  formControlPropsArray: {
    key: 'formControlProps',
    value: [
      'fullWidth',
    ],
  },
}

function CustomInputWrapper ({ classes, theme, ...props }) {
  // console.log(props)
  // formControlProps.fullWidth =fullWidth || formControlProps.fullWidth
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
    formControlProps = {},
    label,
    label2,
    noFloatLabel,
    id,
    labelProps,
    inputProps = {},
    error,
    rawError,
    text,
    white,
    inputRootCustomClasses,
    success,
    help,
    fullWidth = true,
    children,
    simple = false,
    size = 'medium',
    strongLabel,
  } = props
  const { style, ...resetProps } = props
  const labelClasses = classNames({
    [` ${classes.labelRootError}`]: error,
    [` ${classes.labelRootSuccess}`]: success && !error,
    [classes.labelRoot]: true,
    // [classes.labelMedium]:
    //   size === 'default' || size === 'medium' || size === 'md',
    // [classes.labelSmall]: size === 'small' || size === 'sm',
    // [classes.labelLarge]: size === 'large' || size === 'lg',
  })
  const formControlClasses = classNames({
    [formControlProps.className]: true,
    [classes.formControl]: true,
    [classes.noLabel]: !label,
    [props.className]: true,
    [classes.simple]: simple,
    [classes.textControl]: !!text,
    [classes.strongLabel]: !!strongLabel,

    // [classes.medium]: size === 'default' || size === 'medium' || size === 'md',
    // [classes.small]: size === 'small' || size === 'sm',
    // [classes.large]: size === 'large' || size === 'lg',
  })
  let helpTextClasses = classNames({
    [classes.labelRootError]: error,
    [classes.labelRootSuccess]: success && !error,
  })

  let newChildren
  switch (typeof children) {
    case 'function':
      newChildren = children({
        // inputClass:{
        //   input: inputClasses,
        //   root: marginTop,
        //   disabled: classes.disabled,
        //   underline: underlineClasses,
        //   multiline:classes.multiline,
        // },
        ...resetProps,
      })
      break

    default:
      newChildren = children
      break
  }
  // console.log(props)

  return simple ? (
    <div style={style}>{newChildren}</div>
  ) : (
    <FormControl
      fullWidth={fullWidth}
      {...formControlProps}
      className={formControlClasses}
      style={style}
    >
      <React.Fragment>
        {label !== undefined ? (
          <InputLabel
            className={labelClasses}
            htmlFor={id}
            title={label}
            {...labelProps}
          >
            <React.Fragment>
              {label}
              {label && rawError && <span className={classes.required}>*</span>}
            </React.Fragment>
          </InputLabel>
        ) : null}
        {label2 ? (
          <InputLabel
            title={label2}
            className={labelClasses}
            {...labelProps}
            style={{ left: '44%', marginLeft: 20 }}
          >
            {label2}
          </InputLabel>
        ) : null}
        {newChildren}
        {help !== undefined ? (
          <FormHelperText id={`${id}-text`} className={helpTextClasses}>
            {help}
          </FormHelperText>
        ) : null}
      </React.Fragment>
    </FormControl>
  )
}

CustomInputWrapper.propTypes = {
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

export default withStyles(customInputStyle)(CustomInputWrapper)
