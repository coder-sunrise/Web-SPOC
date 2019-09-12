import React, { PureComponent } from 'react'
import Loadable from 'react-loadable'
import { connect } from 'dva'
// mateerial ui
import { Tooltip } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
// medisys components
import { LoadingWrapper } from '@/components/_medisys'
// custom component
import { Button } from '@/components'
// sub components
import Loading from '@/components/PageLoading/index'

@connect(({ loading }) => ({ loading }))
class PatientSearch extends PureComponent {
  state = {
    columns: [
      { name: 'name', title: 'Patient Name' },
      { name: 'patientAccountNo', title: 'Acc. No.' },
      { name: 'gender/age', title: 'Gender / Age' },
      { name: 'mobileNo', title: 'Contact' },
      { name: 'action', title: 'Action' },
    ],
    columnExtensions: [
      // { columnName: 'name', width: 300 },
      { columnName: 'patientAccountNo', width: 140 },
      { columnName: 'mobileNo', width: 140 },
      {
        columnName: 'gender/age',
        width: 95,
        render: (row) => `${row.gender.substring(0, 1)}/${row.age}`,
      },
      {
        columnName: 'action',
        width: 100,
        align: 'center',
        render: (row) => this.ActionButton(row),
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

  ActionButton = (row) => (
    <Tooltip title='Select patient'>
      <div>
        <Button
          // className='noPadding'
          // variant='outlined'
          justIcon
          round
          size='sm'
          color='primary'
          id={row.id}
          onClick={() => this.props.handleSelectClick(row)}
        >
          <Add />
        </Button>
      </div>
    </Tooltip>
  )

  render () {
    const { loading } = this.props
    const show = loading.effects['patientSearch/query']
    const { SearchPatient = (f) => f } = this
    return (
      <React.Fragment>
        <LoadingWrapper loading={show} text='Retrieving patient list...'>
          <SearchPatient />
        </LoadingWrapper>
      </React.Fragment>
    )
  }
}

export default PatientSearch
