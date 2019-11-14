import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import { FormattedMessage } from 'umi/locale'
import { Search, Add } from '@material-ui/icons'
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
  TextField,
  Tooltip,
  ProgressButton,
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

class UserRole extends React.Component {
  state = {
    filter: {
      name: '',
      status: '001',
    },
    showUserProfileForm: false,
  }

  onTextFieldChange = (event, value) => {}

  handleActionButtonClick = (row) => {
    this.toggleModal()
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
              id={row.loginAccount}
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

  toggleModal = () => {
    const { showUserProfileForm } = this.state
    this.setState({ showUserProfileForm: !showUserProfileForm })
  }

  render () {
    const { classes } = this.props
    const { filter, showUserProfileForm } = this.state
    const ActionProps = { TableCellComponent: this.TableCell }
    return (
      <CardContainer hideHeader>
        <GridContainer>
          <GridItem md={4}>
            <TextField
              label='Code / Display Value'
              value={filter.name}
              onChange={this.onTextFieldChange}
            />
          </GridItem>

          <GridItem md={12} className={classes.verticalSpacing}>
            <ProgressButton icon={<Search />} color='primary'>
              <FormattedMessage id='form.search' />
            </ProgressButton>
            <Button color='primary' onClick={this.toggleModal}>
              <Add />
              Add New
            </Button>
          </GridItem>
          <GridItem md={12}>
            <CommonTableGrid
              rows={dummyData}
              {...UserRoleTableConfig}
              ActionProps={ActionProps}
            />
          </GridItem>
        </GridContainer>
        <CommonModal
          title='Add User Role'
          open={showUserProfileForm}
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
        >
          <UserRoleForm />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'UserProfile' })(UserRole)
