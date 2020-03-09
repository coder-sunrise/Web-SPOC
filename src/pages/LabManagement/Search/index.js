import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { getAppendUrl } from '@/utils/utils'
import { compare } from '@/layouts'
import { CardContainer, Button, Tooltip, Tabs } from '@/components'
import FilterBar from './FilterBar'
import Grid from './Grid'
import FilterBar2 from './FilterBar2'
import Grid2 from './Grid2'

const styles = () => ({})

@connect(({ patientSearch }) => ({
  patientSearch,
}))
@compare('patientSearch')
class WardSearch extends PureComponent {
  constructor (props) {
    super(props)
    // console.log(this)

    const showPatient = (row) => {
      if (!this.props.history) return
      this.props.history.push(
        getAppendUrl({
          md: 'pt',
          cmt: '1',
          pid: row.id,
          v: Date.now(),
        }),
      )
    }
    this.defaultAction = (row) => (
      <Tooltip title='View Patient Profile' placement='bottom'>
        <span>
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
        </span>
      </Tooltip>
    )
    this.defaultOnDblClick = showPatient
    // props.dispatch({
    //   type: 'patientSearch/query',
    // })
    // console.log('c WardSearch')
  }

  componentDidMount () {
    if (!this.props.disableQueryOnLoad) {
      this.props.dispatch({
        type: 'patientSearch/query',
        payload: {
          sorting: [
            // { columnName: 'isActive', direction: 'asc' },
            { columnName: 'name', direction: 'asc' },
          ],
        },
      })
    }
  }

  componentWillUnmount () {
    this.props.dispatch({
      type: 'patientSearch/updateState',
      payload: {
        // list: [],
        filter: {},
      },
    })
  }

  render () {
    const { props } = this
    // console.log(props)
    const {
      classes,
      renderActionFn = this.defaultAction,
      onRowDblClick = this.defaultOnDblClick,
      simple,
      ...restProps
    } = props
    const newChildren = (
      <Tabs
        options={[
          {
            id: 1,
            name: 'Order',
            content: (
              <React.Fragment>
                <FilterBar {...restProps} />
                <Grid {...restProps} />
              </React.Fragment>
            ),
          },
          {
            id: 2,
            name: 'Result',
            content: (
              <React.Fragment>
                <FilterBar2 {...restProps} />
                <Grid2 {...restProps} />
              </React.Fragment>
            ),
          },
        ]}
        tabStyle={{}}
      />
    )
    return simple ? (
      <div>{newChildren}</div>
    ) : (
      <CardContainer hideHeader>{newChildren}</CardContainer>
    )
  }
}

export default withStyles(styles)(WardSearch)
