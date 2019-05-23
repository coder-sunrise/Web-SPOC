import React from 'react'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import classNames from 'classnames'
import Select from 'react-select'
import {
  FormControl,
  Typography,
  TextField,
  Input,
  MenuItem,
  Menu as MuiMenu,
  Chip,
  Paper,
} from '@material-ui/core'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputLabel from '@material-ui/core/InputLabel'
// import Select from '@material-ui/core/Select'
import { extendFunc } from '@/utils/utils'
import CustomInput from 'mui-pro-components/CustomInput'

import InputAdornment from '@material-ui/core/InputAdornment'
import { DateRange, Clear } from '@material-ui/icons'
import CustomInputWrapper from 'mui-pro-components/CustomInputWrapper'

// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from 'react-datetime'
import moment from 'moment'
import CancelIcon from '@material-ui/icons/Cancel'

import selectStyle from './selectStyle.jsx'

function NoOptionsMessage (props) {
  return (
    <Typography
      color='textSecondary'
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

function Option (props) {
  // console.log(props)
  // const { options, data } = props
  // if (!options.slice(0, 10).find((o) => o.value === data.value)) return null
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      disabled={props.isDisabled}
      component='div'
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  )
}

function Placeholder (props) {
  return (
    <Typography
      color='textSecondary'
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

function SingleValue (props) {
  return (
    <Typography
      className={classNames({
        [props.selectProps.classes.singleValue]: true,
        [props.selectProps.classes.disabled]: props.isDisabled,
      })}
      // classes={{
      //   root:props.selectProps.classes.input,
      // }}
      {...props.innerProps}
    >
      {props.data.selected || props.children}
    </Typography>
  )
}

function ValueContainer (props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  )
}

function MultiValue (props) {
  // console.log('m',props)
  return (
    <Chip
      tabIndex={-1}
      label={props.data.selected || props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  )
}

function Menu (props) {
  // console.log(props)
  // const longestOption=props.options.reduce((a,b)=>{
  //   return a.label.length>b.label.length?a:b
  // })
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
      style={{ width: props.selectProps.dropWidth || 'auto' }}
    >
      {props.children}
    </Paper>
  )
}
function MenuList (props) {
  // console.log('MenuList', props)
  const { selectProps } = props
  const { max = 50, classes } = selectProps
  return (
    <div className={classes.menuContainer}>
      {props.children.length > max ? (
        props.children.splice(0, max)
      ) : (
        props.children
      )}
      {/* <span>Load more....</span> */}
      {props.children.length > max && (
        <MenuItem disabled component='div'>
          Search for more
        </MenuItem>
      )}
    </div>
  )
}

const inputComponent = ({ inputRef, ...props }) => {
  return <div ref={inputRef} {...props} a='1' />
}

function Control (props) {
  // console.log(props)
  // console.log( props.innerProps)
  // const {classes,error,success,white,inputRootCustomClasses} =props
  // const underlineClasses = classNames({
  //   [classes.underlineError]: error,
  //   [classes.underlineSuccess]: success && !error,
  //   [classes.underline]: true,
  //   [classes.whiteUnderline]: white,
  // })
  const className = classNames({
    [props.selectProps.classes.input]: true,
  })
  const { endAdornment } = props.selectProps
  const cfg = {
    ...(endAdornment ? { endAdornment } : {}),
  }

  return (
    <Input
      fullWidth
      className={`${classNames({
        [props.selectProps.classes.disabled]: props.isDisabled,
        [props.selectProps.classes.selectRoot]: props.selectProps.noWrapper,
        [props.selectProps.classes.selectRootWithWrapper]: !props.selectProps
          .noWrapper,
      })} ${props.selectProps.classes.underline}`}
      inputComponent={inputComponent}
      inputProps={{
        className,
        inputRef: props.innerRef,
        children: props.children,
        ...props.innerProps,
      }}
      {...cfg}
      {...props.selectProps.textFieldProps}
    />
  )
}

const components = {
  Control,
  Menu,
  MenuList,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
}

class CustomSelect extends React.Component {
  state = {
    shrink: this.props.field ? !!this.props.field.value : false,
    value: this.props.field ? this.props.field.value : this.props.defaultValue,
  }

  constructor (props) {
    super(props)

    const {
      labelField = 'name',
      valueField = 'value',
      options = [],
      classes: cx,
      onChange,
      onFocus,
      onBlur,
      theme,
      isClearable = true,
      width,
      filterOption,
      ...restProps
    } = this.props

    this.selectStyles = {
      input: (base) => {
        return {
          ...base,
          color: theme.palette.text.primary,
          '& input': {
            font: 'inherit',
          },
        }
      },
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    }
    this.onFocus = extendFunc(onFocus, () => {
      this.setState({ shrink: true })
    })

    this.onBlur = extendFunc(onBlur, () =>
      this.setState((prevState) => ({
        shrink: !!prevState.value,
      })),
    )
  }

  getRef = (ref) => {
    this.refEl = ref
  }

  static getDerivedStateFromProps (nextProps, preState) {
    // console.log('select', nextProps)
    if (nextProps.field && nextProps.field.value !== preState.value) {
      return {
        value: nextProps.field.value,
        shrink: !!nextProps.field.value,
      }
    }
    return null
  }

  handleChange = (name) => (option) => {
    // console.log(name, option)
    const { label, value = '' } = option || {}
    const { field, form, onChange, options } = this.props
    this.setState(
      {
        value,
        shrink: !!value,
      },
      () => {
        if (field) {
          form.setFieldValue(field.name, value)
        }
        if (onChange) {
          onChange(
            {
              target: option,
            },
            options,
          )
        }
      },
    )
  }

  render () {
    const {
      labelField = 'name',
      valueField = 'value',
      options = [],
      classes: cx,
      onChange,
      onFocus,
      onBlur,
      theme,
      isClearable = true,
      width,
      filterOption,
      ...restProps
    } = this.props
    const { noWrapper, label } = restProps
    const newOpts = options.map((s) => ({
      ...s,
      value: s[valueField],
      label: s[labelField],
    }))
    console.log('select', { newOpts })
    // console.log(this.state.value, options, restProps)
    return (
      <CustomInput {...restProps} shrink={this.state.shrink}>
        {({ getClass, error, showErrorIcon, form, focus, inputProps }) => {
          // console.log(getClass)
          // console.log(cx)
          // console.log(error, showErrorIcon, inputProps)
          const newCx = getClass(cx)
          if (focus && !window.alreadyFocused) {
            this.refEl.focus()
            window.alreadyFocused = true
          }
          // [classes.underlineError]: error,
          // [classes.underlineSuccess]: success && !error,
          // [classes.underline]: !simple,
          // [classes.simple]: simple,
          // [classes.whiteUnderline]: white,
          // console.log(newOpts, this.state.value)

          return (
            <Select
              {...inputProps}
              classes={{
                ...cx,
                ...newCx,
              }}
              ref={this.getRef}
              // closeMenuOnSelect={false}
              // defaultMenuIsOpen
              styles={this.selectStyles}
              // styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
              menuPortalTarget={document.body}
              dropWidth={width}
              options={newOpts}
              components={components}
              // defaultValue={newOpts.filter((o) => o.value === this.state.value)}
              value={newOpts.filter((o) => o.value === this.state.value)}
              onChange={this.handleChange('single')}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              placeholder={noWrapper ? label : ''}
              filterOption={filterOption}
              isClearable={isClearable}
              isDisabled={restProps.disabled}
              noWrapper={noWrapper}
              isOptionDisabled={(option) => !!option.disabled}
              {...restProps}
            />
          )
        }}
      </CustomInput>
      // <CustomInputWrapper
      //   {...restProps}
      //   labelProps={{ shrink: this.state.shrink }}
      // >
      //   {(p) => {
      //     return (
      //       <Select
      //         classes={classes}
      //         styles={selectStyles}
      //         // styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
      //         menuPortalTarget={document.body}
      //         dropWidth={width}
      //         options={newOpts}
      //         components={components}
      //         defaultValue={newOpts.filter((o) => o.value === this.state.value)}
      //         // value={this.state.value}
      //         onChange={this.handleChange('single')}
      //         onFocus={extendFunc(onFocus, () =>
      //           this.setState({ shrink: true }),
      //         )}
      //         onBlur={extendFunc(onBlur, () =>
      //           this.setState({ shrink: !!this.state.value }),
      //         )}
      //         placeholder={noWrapper ? label : ''}
      //         filterOption={filterOption}
      //         isClearable={isClearable}
      //         // defaultMenuIsOpen
      //         // closeMenuOnSelect={false}
      //         isDisabled={restProps.disabled}
      //         noWrapper={noWrapper}
      //       />
      //     )
      //   }}
      // </CustomInputWrapper>
    )
  }
}

CustomSelect.propTypes = {}

// export default withStyles(extendedFormsStyle)(CustomSelect)
export default withStyles(selectStyle, { withTheme: true })(CustomSelect)
