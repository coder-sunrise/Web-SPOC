import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { getAppendUrl } from '@/utils/utils'

import { Tooltip, withStyles } from '@material-ui/core'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Assignment from '@material-ui/icons/Assignment'

import { compare } from '@/layouts'
import { CardContainer, Button } from '@/components'
import FilterBar from './FilterBar'
import Grid from './Grid'

const styles = () => ({})

@connect(({ patientSearch }) => ({
  patientSearch,
}))
@compare('patientSearch')
class PatientSearch extends PureComponent {
  constructor (props) {
    super(props)
    // console.log(this)

    const showPatient = (row) => {
      this.props.history.push(
        getAppendUrl({
          md: 'pt',
          cmt: 'dmgp',
          pid: row.id,
        }),
      )
    }
    this.defaultAction = (row) => (
      <Tooltip title='Detail' placement='bottom'>
        <Button
          size='sm'
          onClick={() => showPatient(row)}
          justIcon
          round
          color='primary'
          style={{ marginRight: 5 }}
        >
          <AccountCircle />
        </Button>
      </Tooltip>
    )
    this.defaultOnDblClick = showPatient
    // props.dispatch({
    //   type: 'patientSearch/query',
    // })
    // console.log('c PatientSearch')
  }

  componentDidMount () {
    if (!this.props.disableQueryOnLoad) {
      this.props.dispatch({
        type: 'patientSearch/query',
      })
    }
  }

  render () {
    const { props } = this
    const {
      classes,
      renderActionFn = this.defaultAction,
      onRowDblClick = this.defaultOnDblClick,
      ...restProps
    } = props
    return (
      <CardContainer hideHeader>
        <FilterBar {...restProps} />
        <Grid
          renderActionFn={renderActionFn}
          onRowDblClick={onRowDblClick}
          {...restProps}
        />
      </CardContainer>
    )
  }
}

export default withStyles(styles)(PatientSearch)
