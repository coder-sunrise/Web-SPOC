import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
// formik
import { Field, FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// custom component
import { Checkbox, GridContainer, GridItem } from '@/components'
// sub component
import DatePicker from './index'

const styles = () => ({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  noLeftSpacing: {
    paddingLeft: '0px !important',
  },
  label: {
    fontSize: '1.2rem',
    marginTop: 'auto !important',
    marginBottom: '5px !important',
    textAlign: 'right',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 300,
    lineHeight: 1.42857,
  },
  allDate: {
    paddingTop: 20,
  },
})

class DateRangePicker extends Component {
  static propTypes = {
    // required
    nameDateFrom: PropTypes.string.isRequired,
    nameDateTo: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    // optional
    labelDateFrom: PropTypes.string,
    labelDateTo: PropTypes.string,
    values: PropTypes.object,
  }

  static defaultProps = {
    labelDateFrom: 'From',
    labelDateTo: 'To',
  }

  state = {
    checkedAllDate: false,
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const { values, nameDateFrom, nameDateTo } = this.props
    const { values: nextValues } = nextProps

    const { checkedAllDate } = this.state

    const isValuesEmpty =
      Object.entries(values).length === 0 && values.constructor === Object
    const isNextValuesEmpty =
      Object.entries(nextValues).length === 0 &&
      nextValues.constructor === Object

    if (!isValuesEmpty && !isNextValuesEmpty) {
      return (
        nextValues[nameDateFrom] !== values[nameDateFrom] ||
        nextValues[nameDateTo] !== values[nameDateTo] ||
        nextState.checkedAllDate !== checkedAllDate
      )
    }

    return true
  }

  onChange = (value, name) => {
    const { handleChange } = this.props
    handleChange(name, value)
  }

  onCheckAllDateChange = (name, value) => {
    const { handleChange, nameDateFrom, nameDateTo } = this.props
    this.setState({ checkedAllDate: value }, () => {
      handleChange(nameDateFrom, '')
      handleChange(nameDateTo, '')
      handleChange(name, value)
    })
  }

  render () {
    const { checkedAllDate } = this.state
    const {
      classes,
      nameDateFrom,
      nameDateTo,
      labelDateFrom,
      labelDateTo,
    } = this.props

    return (
      <GridContainer className={classnames(classes.container)}>
        {/*
          outerLabel ? (
            <GridItem className={classnames(classes.label)} xs md={2}>
              {<span>{outerLabel}</span>}
            </GridItem>
          ) : (
            <div />
          )
        */}
        <GridItem xs md={4} className={classnames(classes.noLeftSpacing)}>
          <Field
            name={nameDateFrom}
            render={(args) => (
              <DatePicker
                {...args}
                disabled={checkedAllDate}
                onChange={this.onChange}
                label={labelDateFrom}
              />
            )}
          />
        </GridItem>
        <GridItem xs md={4}>
          <Field
            name={nameDateTo}
            render={(args) => (
              <DatePicker
                {...args}
                disabled={checkedAllDate}
                onChange={this.onChange}
                label={labelDateTo}
              />
            )}
          />
        </GridItem>
        <GridItem xs md={3}>
          <div className={classnames(classes.allDate)}>
            <FastField
              name='allDate'
              render={(args) => (
                <Checkbox
                  simple
                  label='All Date'
                  {...args}
                  notCentered
                  onChange={this.onCheckAllDateChange}
                />
              )}
            />
          </div>
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles)(DateRangePicker)
