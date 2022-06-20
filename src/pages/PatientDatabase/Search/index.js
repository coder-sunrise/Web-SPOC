import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { getAppendUrl } from '@/utils/utils'
import { compare } from '@/layouts'
import { CardContainer, Button, Tooltip } from '@/components'
import Authorized from '@/utils/Authorized'
import FilterBar from './FilterBar'
import Grid from './Grid'

const styles = () => ({})

const { Secured } = Authorized
@connect(({ patientSearch, global }) => ({
  patientSearch,
  mainDivHeight: global.mainDivHeight,
}))
@compare('patientSearch')
@Secured('patientdatabase/searchpatient')
class PatientSearch extends PureComponent {
  constructor(props) {
    super(props)
    const showPatient = row => {
      const viewPatProfileAccessRight = Authorized.check(
        'patientdatabase.patientprofiledetails',
      )
      const disableRights = ['disable', 'hidden']
      if (
        !this.props.history ||
        (viewPatProfileAccessRight &&
          disableRights.includes(viewPatProfileAccessRight.rights))
      )
        return

      this.props.history.push(
        getAppendUrl({
          md: 'pt',
          cmt: '1',
          pid: row.id,
          v: Date.now(),
        }),
      )
    }
    this.defaultAction = row => (
      <Tooltip title='View Patient Profile' placement='bottom'>
        <span>
          <Authorized authority='patientdatabase.patientprofiledetails'>
            <Button
              size='sm'
              onClick={() => showPatient(row)}
              justIcon
              authority='none'
              round
              color='primary'
              style={{ marginRight: 5 }}
            >
              <AccountCircle />
            </Button>
          </Authorized>
        </span>
      </Tooltip>
    )
    this.defaultOnDblClick = showPatient
  }

  componentDidMount() {
    if (!this.props.disableQueryOnLoad) {
      this.props.dispatch({
        type: 'patientSearch/query',
        payload: {
          apiCriteria: {
            includeinactive: window.location.pathname.includes('patient'),
          },
          sorting: [{ columnName: 'name', direction: 'asc' }],
        },
      })
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'patientSearch/updateState',
      payload: {
        filter: {},
      },
    })
  }

  render() {
    const { props } = this
    const {
      classes,
      renderActionFn = this.defaultAction,
      onRowDblClick = this.defaultOnDblClick,
      simple,
      mainDivHeight = 700,
      ...restProps
    } = props

    let height = 0
    if (simple) {
      height =
        mainDivHeight - 330 - ($('.filterPatientSearchBar').height() || 55)
    } else {
      height =
        mainDivHeight - 120 - ($('.filterPatientSearchBar').height() || 55)
    }
    if (height < 300) height = 300
    const newChildren = (
      <React.Fragment>
        <div style={{ maxWidth: 1000 }} className='filterPatientSearchBar'>
          <FilterBar {...restProps} simple={simple} />
        </div>
        <Grid
          simple={simple}
          renderActionFn={renderActionFn}
          onRowDblClick={onRowDblClick}
          {...restProps}
          height={height}
        />
      </React.Fragment>
    )
    return simple ? (
      <div>{newChildren}</div>
    ) : (
      <CardContainer hideHeader>{newChildren}</CardContainer>
    )
  }
}

export default withStyles(styles)(PatientSearch)
