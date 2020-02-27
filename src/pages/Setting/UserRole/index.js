import React from 'react'
import { connect } from 'dva'
// formik
import { withFormik, FastField, Field } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
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
    filter: {
      name: '',
      status: '001',
    },
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
              <Tooltip title='Edit User Role' placement='bottom'>
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

  componentDidMount = async () => {
    const { settingUserRole } = this.props
    await this.props.dispatch({
      type: 'settingUserRole/query',
    })
    this.genClinicalRoleList()
  }

  onTextFieldChange = (event, value) => {}

  editRow = (row) => {
    this.props.history.push(`/setting/userrole/${row.id}`)
  }

  handleDoubleClick = (row) => {
    this.props.history.push(`/setting/userrole/${row.id}`)
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

  toggleModal = () => {
    const { showUserProfileForm } = this.state
    this.setState({ showUserProfileForm: !showUserProfileForm })
  }

  render () {
    const { classes, settingUserRole, history } = this.props
    const { filter, showUserProfileForm } = this.state
    const { clinicalRoleNameList } = settingUserRole
    // const ActionProps = { TableCellComponent: this.TableCell }

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
            <Button color='primary' onClick={this.toggleModal}>
              <Add />
              Add New
            </Button>
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
            title='New User Role'
            maxWidth='md'
            bodyNoPadding
            onClose={this.toggleModal}
            onConfirm={this.toggleModal}
          >
            <UserRoleForm history={history} />
          </CommonModal>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'UserRole' })(UserRole)
