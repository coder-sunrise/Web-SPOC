import React from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { history, FormattedMessage } from 'umi'

import Search from '@material-ui/icons/Search'
import Add from '@material-ui/icons/Add'
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
  CodeSelect,
  ProgressButton,
  Select,
  TextField,
  Tooltip,
  withSettingBase,
} from '@/components'
import { UserProfileTableConfig } from './const'

const styles = theme => ({
  verticalSpacing: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
})

@connect(({ settingUserProfile, global }) => ({
  settingUserProfile,
  mainDivHeight: global.mainDivHeight,
}))
@withSettingBase({ modelName: 'settingUserProfile' })
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
          render: row => this.Cell(row),
        },
      ],
    },
  }

  componentDidMount = () => {
    this.props.dispatch({
      type: 'settingUserProfile/updateState',
      payload: {
        filter: undefined,
      },
    })
    this.props.dispatch({
      type: 'settingUserProfile/query',
      payload: {
        isActive: this.props.values.status,
      },
    })
  }

  handleActionButtonClick = async event => {
    const { currentTarget } = event
    const { dispatch } = this.props

    const response = await dispatch({
      type: 'settingUserProfile/fetchUserProfileByID',
      payload: { id: currentTarget.id },
    })
    if (response) {
      dispatch({
        type: 'global/updateState',
        payload: {
          showUserProfile: true,
          accountModalTitle: 'Edit User Profile',
        },
      })
    }
  }

  Cell = row => {
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
    console.log(values)
    dispatch({
      type: 'settingUserProfile/query',
      payload: {
        group: [
          {
            name: values.searchQuery,
            'userProfileFKNavigation.userName': values.searchQuery,
            combineCondition: 'or',
          },
        ],
        // current: 1,
        isActive: values.status,
        'userProfileFKNavigation.userRole.roleId': values.userGroupFK,
      },
    })
  }

  onAddNewClick = () => {
    history.push('/setting/userprofile/new')
  }

  openModal = () => {
    this.props.dispatch({
      type: 'global/updateState',
      payload: {
        showUserProfile: true,
        accountModalTitle: 'New User Profile',
      },
    })
  }

  handleDoubleClick = row => {
    this.handleActionButtonClick({ currentTarget: { id: row.id } })
  }

  render() {
    const { classes, mainDivHeight = 700 } = this.props
    let height =
      mainDivHeight - 120 - ($('.filterUserProfileBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterUserProfileBar'>
          <GridContainer>
            <GridItem md={2}>
              <FastField
                name='searchQuery'
                render={args => (
                  <TextField
                    {...args}
                    label='Login Account / Name'
                    autocomplete='off'
                  />
                )}
              />
            </GridItem>
            <GridItem md={2}>
              <FastField
                name='userGroupFK'
                render={args => (
                  <CodeSelect
                    {...args}
                    orderBy={[['name'], ['asc']]}
                    label='User Group'
                    code='role'
                  />
                )}
              />
            </GridItem>
            <GridItem md={2}>
              <FastField
                name='status'
                render={args => (
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
              <ProgressButton
                color='primary'
                onClick={this.handleSearchClick}
                icon={<Search />}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>
              <Button color='primary' onClick={this.openModal}>
                <Add />
                Add New
              </Button>
            </GridItem>
          </GridContainer>
        </div>
        <GridContainer>
          <GridItem md={12}>
            <CommonTableGrid
              type='settingUserProfile'
              {...this.state.gridConfig}
              TableProps={{
                height,
              }}
              forceRender
              onRowDoubleClick={this.handleDoubleClick}
            />
          </GridItem>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'UserProfile' })(UserProfile)
