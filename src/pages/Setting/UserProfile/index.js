import React from 'react'
import { connect } from 'dva'
// formik
import { withFormik, FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
// devexpress react grid
import { Table } from '@devexpress/dx-react-grid-material-ui'
// common component
import {
  Button,
  CardContainer,
  CommonModal,
  CommonTableGrid2,
  GridContainer,
  GridItem,
  Select,
  TextField,
  Tooltip,
} from '@/components'
// sub component
import UserProfileForm from './UserProfileForm'
import { dummyData, UserProfileTableConfig } from './const'

const styles = (theme) => ({
  verticalSpacing: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
})

@connect(({ settingUserProfile }) => ({ settingUserProfile }))
@withFormik({
  mapPropsToValues: () => ({
    status: 'Active',
  }),
})
class UserProfile extends React.Component {
  componentDidMount = () => {
    this.props.dispatch({
      type: 'settingUserProfile/query',
      payload: {
        sorting: [
          { sortby: 'id', order: 'desc' },
        ],
      },
    })
  }

  handleActionButtonClick = (event) => {
    const { dispatch } = this.props
    const { currentTarget } = event
    dispatch({
      type: 'settingUserProfile/fetchUserProfileByID',
      id: currentTarget.id,
    })
  }

  Cell = ({ column, row, classes, ...props }) => {
    if (column.name.toUpperCase() === 'ACTION') {
      return (
        <Table.Cell {...props}>
          <Tooltip title='Edit user profile'>
            <Button
              justIcon
              color='primary'
              onClick={this.handleActionButtonClick}
              id={row.id}
            >
              <Edit />
            </Button>
          </Tooltip>
        </Table.Cell>
      )
    }
    return <Table.Cell {...props} />
  }

  TableCell = (p) => this.Cell({ ...p })

  closeModal = () => {
    this.props.dispatch({ type: 'settingUserProfile/closeModal' })
  }

  openModal = () =>
    this.props.dispatch({ type: 'settingUserProfile/openModal' })

  handleSearchClick = () => {
    const { dispatch, values } = this.props
    const prefix = 'like_'
    dispatch({
      type: 'settingUserProfile/query',
      payload: {
        [`${prefix}userName`]: values.searchQuery,
        [`${prefix}name`]: values.searchQuery,
        combineCondition: 'or',
      },
    })
  }

  handleChangePassword = () => {
    this.props.dispatch({
      type: 'global/updateAppState',
      payload: {
        showChangePasswordModal: true,
      },
    })
  }

  render () {
    const { classes, settingUserProfile } = this.props
    const {
      list,
      showUserProfileModal,
      currentSelectedUser,
    } = settingUserProfile

    const ActionProps = { TableCellComponent: this.TableCell }

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
                    { name: 'Active', value: 'Active' },
                    { name: 'Inactive', value: 'Inactive' },
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
            <CommonTableGrid2
              {...UserProfileTableConfig}
              ActionProps={ActionProps}
              rows={list}
            />
          </GridItem>
        </GridContainer>
        <CommonModal
          title={
            currentSelectedUser.userName ? (
              'Edit User Profile'
            ) : (
              'Add User Profile'
            )
          }
          open={showUserProfileModal}
          onClose={this.closeModal}
          onConfirm={this.closeModal}
        >
          <UserProfileForm
            selectedUser={currentSelectedUser}
            onChangePasswordClick={this.handleChangePassword}
          />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'UserProfile' })(UserProfile)
