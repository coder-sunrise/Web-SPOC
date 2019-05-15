import React, { PureComponent } from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
import debounce from 'lodash/debounce'
// umi/locale
import { formatMessage } from 'umi/locale'
// material ui
import { LinearProgress, CircularProgress, withStyles } from '@material-ui/core'
// custom component
import { GridContainer, GridItem, TextField } from '@/components'
// sub components
import ColorSelector from './ColorSelector'

const styles = () => ({
  searchField: {
    paddingTop: 22,
  },
  addPadding: {
    paddingTop: '15px !important',
  },
  selectorContainer: {
    textAlign: 'left',
  },
  showAllBtn: {
    paddingLeft: '10px',
  },
})

@connect(({ appointment }) => ({ appointment }))
class FilterBar extends PureComponent {
  state = {
    searchQuery: '',
    isTyping: false,
  }

  // shouldComponentUpdate = (nextProps, nextState) => {
  //   const { searchQuery: newQuery } = nextState
  //   const { searchQuery: oldQuery } = this.state

  //   const { appointment: { selectedDoctors: newSelectedDoctors } } = nextProps
  //   const { appointment: { selectedDoctors: oldSelectedDoctors } } = this.props

  //   const isSame =
  //     oldSelectedDoctors.length !== newSelectedDoctors.length
  //       ? false
  //       : compare(oldSelectedDoctors, newSelectedDoctors)

  //   return !isSame || newQuery !== oldQuery
  // }

  onSearchQueryChange = (event) => {
    const { target } = event
    this.setState({ searchQuery: target.value, isTyping: true })

    this.onSearchDebounced(target.value)
  }

  onSearchDebounced = debounce((value) => {
    const { dispatch } = this.props
    dispatch({
      type: 'appointment/updateFilterQuery',
      searchQuery: value,
    })
    this.setState({
      isTyping: false,
    })
  }, 500)

  onColorSelectorChange = (event) => {
    const { dispatch } = this.props
    dispatch({
      type: 'appointment/updateFilterColors',
      selected: event.target.value,
    })
  }

  render () {
    const { searchQuery, isTyping } = this.state
    const { classes, appointment } = this.props
    const { filter } = appointment
    return (
      <GridContainer>
        <GridItem className={classnames(classes.searchField)} xs md={4}>
          <TextField
            value={searchQuery}
            onChange={this.onSearchQueryChange}
            label={formatMessage({ id: 'reception.appt.searchByPatientName' })}
            suffix={isTyping && <CircularProgress size={16} />}
          />
        </GridItem>
        <GridItem
          xs
          md={4}
          className={classnames([
            classes.selectorContainer,
            filter.colors.length === 0 ? classes.addPadding : null,
          ])}
        >
          <ColorSelector
            multiple
            label={formatMessage({ id: 'reception.appt.filterByColor' })}
            selected={filter.colors}
            handleChange={this.onColorSelectorChange}
          />
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles, { name: 'CalendarFilterBar' })(FilterBar)
