import React from 'react'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import classNames from 'classnames'

import {
  MenuItem,
  InputAdornment,
  Select,
  Input,
  TextField,
} from '@material-ui/core'
import Clear from '@material-ui/icons/Clear'
import CustomInputWrapper from 'mui-pro-components/CustomInputWrapper'

// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from 'react-datetime'
import moment from 'moment'

import extendedFormsStyle from 'mui-pro-jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx'

let _dateFormat = 'DD-MM-YYYY'
const getValue = (v) => {
  return moment.isMoment(v) ? v.format(_dateFormat) : v
}
let currentSearchInput = null
class MUISelect extends React.Component {
  state = {
    shrink: this.props.field ? !!this.props.field.value : false,
    open: false,
    searchValue: '',
    currentAutoOptionIndex: 0,
    options: [],
    filteredOptions: [],
  }

  static getDerivedStateFromProps (nextProps, preState) {
    const {
      options,
      searchable,
      multiple,
      field,
      defaultValue,
      value,
    } = nextProps
    if (options) {
      if (preState.filteredOptions.length === 0) {
        return {
          options,
          filteredOptions: options,
        }
      }
      return {
        options,
      }
    }
    if (multiple) {
      return {
        value: [
          field ? getValue(value) : defaultValue,
        ],
      }
    }
    if (value !== undefined) {
      return {
        value: field ? getValue(value) : defaultValue,
      }
    }

    return null
  }

  componentDidMount () {
    // window.onkeyup = (e) => {
    //   let key = e.keyCode ? e.keyCode : e.which
    //   if (!e.ctrlKey && !e.altKey) {
    //     const {currentAutoOptionIndex, filteredOptions}=this.state
    //     switch (key) {
    //       case 38:// UP
    //         if(currentAutoOptionIndex>0){
    //           this.setState({
    //             currentAutoOptionIndex: currentAutoOptionIndex-1,
    //           })
    //         }
    //         break
    //       case 40:// DOWN
    //       if(currentAutoOptionIndex<filteredOptions.length-1){
    //         this.setState({
    //           currentAutoOptionIndex: currentAutoOptionIndex+1,
    //         })
    //       }
    //       break
    //       case 9:// TAB
    //         break
    //       default:
    //         break
    //     }
    //   }
    // }
  }

  render () {
    const {
      label,
      disabled,
      multiple = false,
      field,
      form,
      searchable = true,
      theme,
    } = this.props
    const {
      value,
      options,
      searchValue,
      filteredOptions,
      open,
      shrink,
      currentAutoOptionIndex,
    } = this.state
    const { classes, onChange, ...restProps } = this.props
    console.log(currentAutoOptionIndex, value)
    return (
      <CustomInputWrapper {...restProps} labelProps={{ shrink }}>
        <React.Fragment>
          <Select
            open={open}
            style={{ marginTop: 1 }}
            MenuProps={{ className: classes.selectMenu }}
            classes={{ select: classes.select }}
            multiple={multiple}
            value={multiple ? value || [] : value || ''}
            fullWidth
            //   onChange={this.handleSimple}
            onClose={(e) => {
              console.log(e)

              console.log(e.target)
              console.log(e.target.nodeName)

              if (e.target.nodeName !== 'INPUT') {
                this.setState({
                  open: false,
                })
              }
            }}
            onOpen={(e) => {
              // console.log(e)
              this.setState({
                open: true,
              })
              setTimeout(() => {
                console.log(currentSearchInput)
                if (currentSearchInput) {
                  currentSearchInput.focus()
                }
              }, 200)
            }}
            onChange={(event) => {
              this.setState(
                {
                  value: event.target.value,
                  shrink: !!event.target.value,
                },
                () => {
                  if (field) {
                    form.setFieldValue(field.name, event.target.value)
                  }
                  if (onChange) {
                    onChange(event)
                  }
                },
              )
            }}
            {...restProps}
          >
            {label &&
            !searchable && (
              <MenuItem
                disabled
                classes={{
                  root: classes.selectMenuItem,
                }}
              >
                {label}
              </MenuItem>
            )}
            {label &&
            searchable && (
              <TextField
                autoFocus
                fullWidth
                style={{ padding: theme.spacing.unit }}
                inputRef={(input) => {
                  console.log(input)
                  currentSearchInput = input
                }}
                onFocus={(e) => {
                  console.log(e, 'focus')
                  return false
                }}
                onChange={(e) => {
                  const sv = e.target.value.toLowerCase()
                  this.setState({
                    searchValue: sv,
                    filteredOptions: options.filter(
                      (o) => o.name.toLowerCase().indexOf(sv) >= 0,
                    ),
                  })
                }}
              />
            )}
            {(filteredOptions.length > 0
              ? filteredOptions
              : options).map((o, i) => {
              console.log(o, i)
              const isSelected = multiple
                ? value.indexOf(o.value) >= 0
                : value === o.value

              return (
                <MenuItem
                  key={o.value}
                  //   classes={{
                  //   root: classes.selectMenuItem,
                  //   selected: multiple
                  //     ? classes.selectMenuItemSelectedMultiple
                  //     : classes.selectMenuItemSelected,
                  // }}
                  style={{
                    fontWeight: isSelected ? 500 : 400,
                  }}
                  {...o}
                >
                  {o.name}
                </MenuItem>
              )
            })}
          </Select>
          {!disabled &&
          value && (
            <InputAdornment
              style={{
                position: 'absolute',
                right: '24px',
                bottom: '17px',
              }}
            >
              <Clear
                onClick={() => {
                  this.setState(
                    {
                      value: multiple ? [] : '',
                      shrink: false,
                    },
                    () => form.setFieldValue(name, multiple ? [] : ''),
                  )
                }}
                style={{ cursor: 'pointer' }}
              />
            </InputAdornment>
          )}
        </React.Fragment>
      </CustomInputWrapper>

      //   <FormControl
      //     fullWidth
      //     className={classes.selectFormControl}
      //   >
      //     <InputLabel
      //       className={classNames({[classes.selectLabel]:true, [classes.labelRoot]:true})}
      //       shrink={this.state.shrink}
      //     >
      //       {label}
      //     </InputLabel>

      //   </FormControl>
    )
  }
}

MUISelect.propTypes = {}

export default withStyles(extendedFormsStyle, { withTheme: true })(MUISelect)
