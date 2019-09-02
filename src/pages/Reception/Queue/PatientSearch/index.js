import React, { PureComponent } from 'react'
import Loadable from 'react-loadable'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { Button, Tooltip } from '@/components'
// medisys components
import { LoadingWrapper } from 'medisys-components'
// sub components
import Loading from '@/components/PageLoading/index'
import RegisterVisitBtn from './RegisterVisitBtn'

const styles = () => ({
  patientNameBtn: {
    paddingLeft: '0px !important',
    fontSize: '1em !important',
    display: 'flex',
    justifyContent: 'flex-start',
    textAlign: 'left',
    textOverflow: 'ellipsis',
  },
})

@connect(({ loading }) => ({ loading }))
class PatientSearch extends PureComponent {
  state = {
    columns: [
      { name: 'name', title: 'Patient Name' },
      { name: 'patientAccountNo', title: 'Acc. No.' },
      { name: 'gender/age', title: 'Gender / Age' },
      { name: 'mobileNo', title: 'Mobile No.' },
      { name: 'action', title: 'Action' },
    ],
    columnExtensions: [
      {
        align: 'left',
        columnName: 'name',
        width: 240,
        render: (row) => (
          <Tooltip title='View patient profile'>
            <Button
              className={this.props.classes.patientNameBtn}
              color='primary'
              size='sm'
              link
              id={row.id}
              onClick={this.viewPatientProfile}
            >
              {row.name}
            </Button>
          </Tooltip>
        ),
      },
      {
        columnName: 'gender/age',
        render: (row) => `${row.gender.substring(0, 1)}/${row.age}`,
      },
      {
        columnName: 'action',
        align: 'center',
        render: (row) => this.Cell(row),
      },
    ],
  }

  SearchPatient = Loadable({
    loader: () => import('@/pages/PatientDatabase/Search'),
    loading: Loading,
    render: (loaded) => {
      const Component = loaded.default
      return (
        <Component
          renderActionFn={this.Cell}
          simple
          size='sm'
          disableQueryOnLoad
          overrideTableParas={{
            columns: this.state.columns,
            columnExtensions: this.state.columnExtensions,
          }}
        />
      )
    },
  })

  registerVisitClick = (patientID) => {
    const { handleRegisterVisitClick } = this.props
    handleRegisterVisitClick({ patientID })
  }

  viewPatientProfile = (event) => {
    const { currentTarget } = event
    const { id } = currentTarget
    this.props.onViewPatientProfileClick(id)
  }

  Cell = (row) => (
    <RegisterVisitBtn row={row} onClick={this.registerVisitClick} />
  )

  render () {
    const { loading } = this.props

    const { SearchPatient = (f) => f } = this
    const show = loading.effects['patientSearch/query']
    return (
      <React.Fragment>
        <LoadingWrapper loading={show} text='Retrieving patient list...'>
          <SearchPatient />
        </LoadingWrapper>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { name: 'PatientSearch' })(PatientSearch)
