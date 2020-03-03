import React from 'react'
import { connect } from 'dva'
import classNames from 'classnames'
// formik
import { withFormik, FastField, Field } from 'formik'
// material ui
import {
  withStyles,
  MenuList,
  ClickAwayListener,
  MenuItem,
} from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import { FormattedMessage } from 'umi/locale'
import Search from '@material-ui/icons/Search'
import Add from '@material-ui/icons/Add'
// devexpress react grid
import { Table } from '@devexpress/dx-react-grid-material-ui'
// common component
import {
  Button,
  CardContainer,
  CommonModal,
  CommonTableGrid,
  GridContainer,
  GridItem,
  Select,
  TextField,
  Tooltip,
  ProgressButton,
  withSettingBase,
  CodeSelect,
  Popper,
} from '@/components'
// sub component
import UserRoleForm from './UserRoleForm'
import { dummyData, UserRoleTableConfig } from './const'

const styles = (theme) => ({
  verticalSpacing: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
})
@connect(({ settingUserRole }) => ({ settingUserRole }))
@withSettingBase({ modelName: 'settingUserRole' })
@withFormik({
  mapPropsToValues: () => ({
    status: true,
  }),
})
class UserRole extends React.Component {
  state = {
    openPopper: false,
    showUserProfileForm: false,
    gridConfig: {
      ...UserRoleTableConfig,
      columnExtensions: [
        ...UserRoleTableConfig.columnExtensions,
        {
          columnName: 'action',
          width: 90,
          align: 'center',
          render: (row) => {
            return (
              <Tooltip title='Edit Role & Access Right' placement='bottom'>
                <Button
                  justIcon
                  color='primary'
                  onClick={() => this.editRow(row)}
                  id={row.id}
                >
                  <Edit />
                </Button>
              </Tooltip>
            )
          },
        },
      ],
    },
  }

  genClinicalRoleList = () => {
    const { settingUserRole } = this.props
    this.props.dispatch({
      type: 'settingUserRole/genList',
      data: settingUserRole.list,
      name: 'clinicalRoleName',
    })
  }

  componentDidMount = () => {
    this.props.dispatch({
      type: 'settingUserRole/query',
      payload: {
        isActive: this.props.values.status,
      },
    })
  }

  editRow = (row) => {
    this.props.history.push(`/setting/userrole/${row.id}`)
  }

  handleDoubleClick = (row) => {
    this.editRow(row)
  }

  handleSearchClick = () => {
    const { codeDisplayValue, clinicalRole, status } = this.props.values
    let payload = {
      group: [
        {
          code: codeDisplayValue,
          Name: codeDisplayValue,
          combineCondition: 'or',
        },
      ],
      isActive: status,
    }
    if (clinicalRole !== 0) {
      payload = { ...payload, ClinicRoleFK: clinicalRole }
    }
    this.props.dispatch({
      type: 'settingUserRole/query',
      payload,
    })
  }

  handleAddNew = () => {
    this.setState({ openPopper: true })
  }

  handleClickPopper = (i) => {
    switch (i) {
      case 1:
      default:
        this.props.history.push(`/setting/userrole/new`)
        break
      case 2:
        this.toggleModal()
        this.closePopper()
        break
    }
  }

  closePopper = () => {
    this.setState({ openPopper: false })
  }

  toggleModal = () => {
    const { showUserProfileForm } = this.state
    this.setState({ showUserProfileForm: !showUserProfileForm })
  }

  render () {
    const { classes } = this.props
    const { showUserProfileForm, openPopper } = this.state

    return (
      <CardContainer hideHeader>
        <GridContainer>
          <GridItem md={4}>
            <FastField
              name='codeDisplayValue'
              render={(args) => {
                return <TextField label='Code / Name' {...args} />
              }}
            />
          </GridItem>
          <GridItem md={2}>
            <Field
              name='clinicalRole'
              render={(args) => (
                <CodeSelect
                  {...args}
                  label='Clinical Role'
                  code='ltclinicalrole'
                  onChange={(value) => {
                    // console.log(value)
                  }}
                />
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
            <ProgressButton
              icon={<Search />}
              color='primary'
              onClick={this.handleSearchClick}
            >
              <FormattedMessage id='form.search' />
            </ProgressButton>

            <Popper
              open={openPopper}
              transition
              className={classNames({
                [classes.pooperResponsive]: true,
                [classes.pooperNav]: true,
              })}
              overlay={
                <ClickAwayListener onClickAway={this.closePopper}>
                  <MenuList role='menu'>
                    <MenuItem onClick={() => this.handleClickPopper(1)}>
                      Add New
                    </MenuItem>
                    <MenuItem onClick={() => this.handleClickPopper(2)}>
                      Add From Existing
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              }
            >
              <Button color='primary' onClick={this.handleAddNew}>
                <Add />
                Add New
              </Button>
            </Popper>
          </GridItem>
          <GridItem md={12}>
            <CommonTableGrid
              type='settingUserRole'
              {...this.state.gridConfig}
              onRowDoubleClick={this.handleDoubleClick}
              FuncProps={{ pager: true }}
            />
          </GridItem>
          <CommonModal
            open={showUserProfileForm}
            observe='RoomDetail'
            title='Add From Existing'
            maxWidth='md'
            bodyNoPadding
            onClose={this.toggleModal}
            onConfirm={this.toggleModal}
          >
            <UserRoleForm />
          </CommonModal>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'UserRole' })(UserRole)
