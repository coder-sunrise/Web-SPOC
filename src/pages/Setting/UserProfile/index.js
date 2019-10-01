import React from 'react'
import { connect } from 'dva'
import router from 'umi/router'
// formik
import { withFormik, FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
// common component
import {
  Button,
  CardContainer,
  CommonTableGrid,
  GridContainer,
  GridItem,
  Select,
  TextField,
  Tooltip,
} from '@/components'
import { UserProfileTableConfig } from './const'

const styles = (theme) => ({
  verticalSpacing: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
})

@connect(({ settingUserProfile }) => ({ settingUserProfile }))
@withFormik({
  mapPropsToValues: () => ({
    status: true,
  }),
})
class UserProfile extends React.Component {
  state = {
    gridConfig: {
      ...UserProfileTableConfig,
      columnExtensions: [
        ...UserProfileTableConfig.columnExtensions,
        {
          columnName: 'action',
          width: 90,
          align: 'center',
          render: (row) => this.Cell(row),
        },
      ],
    },
  }

  componentDidMount = () => {
    this.props.dispatch({
      type: 'settingUserProfile/query',
    })
  }

  handleActionButtonClick = (event) => {
    const { currentTarget } = event
    const { dispatch } = this.props

    dispatch({
      type: 'settingUserProfile/fetchUserProfileByID',
      payload: { id: currentTarget.id },
    })
    this.openModal()
  }

  Cell = (row) => {
    return (
      <Tooltip title='Edit User Profile' placement='bottom'>
        <Button
          justIcon
          color='primary'
          onClick={this.handleActionButtonClick}
          id={row.id}
        >
          <Edit />
        </Button>
      </Tooltip>
    )
  }

  handleSearchClick = () => {
    const { dispatch, values } = this.props
    dispatch({
      type: 'settingUserProfile/query',
      payload: {
        'userProfileFKNavigation.userName': values.searchQuery,
        name: values.searchQuery,
        isActive: values.status,
        combineCondition: 'or',
      },
    })
  }

  onAddNewClick = () => {
    router.push('/setting/userprofile/new')
  }

  openModal = () => {
    this.props.dispatch({
      type: 'global/updateState',
      payload: {
        showUserProfile: true,
      },
    })
  }

  handleDoubleClick = (row) => {
    this.handleActionButtonClick({ currentTarget: { id: row.id } })
  }

  render () {
    const { classes } = this.props
    return (
      <CardContainer hideHeader>
        <GridContainer>
          <GridItem md={4}>
            <FastField
              name='searchQuery'
              render={(args) => (
                <TextField {...args} label='Name / Login Account' />
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='status'
              render={(args) => (
                <Select
                  {...args}
                  label='Status'
                  options={[
                    { name: 'Active', value: true },
                    { name: 'Inactive', value: false },
                  ]}
                />
              )}
            />
          </GridItem>
          <GridItem md={12} className={classes.verticalSpacing}>
            <Button color='primary' onClick={this.handleSearchClick}>
              Search
            </Button>
            <Button color='primary' onClick={this.openModal}>
              Add New
            </Button>
          </GridItem>
          <GridItem md={12}>
            <CommonTableGrid
              type='settingUserProfile'
              {...this.state.gridConfig}
              onRowDoubleClick={this.handleDoubleClick}
            />
          </GridItem>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'UserProfile' })(UserProfile)
