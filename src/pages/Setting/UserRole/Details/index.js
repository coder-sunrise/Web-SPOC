import React from 'react'
import _ from 'lodash'
import * as Yup from 'yup'
import moment from 'moment'
import { connect } from 'dva'
// formik
import { FastField, Field } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import { FormattedMessage } from 'umi/locale'
import Search from '@material-ui/icons/Search'
// common component
import {
  Button,
  DateRangePicker,
  GridContainer,
  GridItem,
  TextField,
  withFormikExtend,
  Select,
  CommonTableGrid,
  ProgressButton,
} from '@/components'

// utils
import { navigateDirtyCheck } from '@/utils/utils'
import { dummyData, AccessRightConfig } from './const'

const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing(2),
  },
  verticalSpacing: {
    marginTop: theme.spacing(3),
    '& > h4': {
      fontWeight: 500,
    },
    // marginBottom: theme.spacing(1),
  },
  isDoctorCheck: {
    paddingTop: `${theme.spacing(2)}px !important`,
  },
  indent: {
    paddingLeft: theme.spacing(2),
  },
})

@connect(({ settingUserRole }) => ({
  settingUserRole,
  userRole: settingUserRole.currentSelectedUserRole,
}))
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { userRole } = props
    console.log(props)
    return {
      ...userRole,
      effectiveDates: [
        moment(userRole.effectiveStartDate).formatUTC(),
        moment(userRole.effectiveEndDate).formatUTC(),
      ],
    }
  },
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    name: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { dispatch, onConfirm } = props
    console.log(values)
    dispatch({
      type: 'settingUserRole/upsert',
      payload: values,
    }).then((r) => {
      if (r) {
        resetForm()
        if (onConfirm) onConfirm()
        dispatch({
          type: 'settingUserRole/query',
        })
      }
    })
  },
  displayName: 'userRoleDetail',
})
class UserRoleDetail extends React.Component {
  state = {
    gridConfig: { ...AccessRightConfig },
  }

  componentDidMount = () => {
    const rowId = this.props.match.params.id
    this.props.dispatch({
      type: 'settingUserRole/fetchUserRoleByID',
      payload: {
        id: rowId || 1,
      },
    })
  }

  handleSearchClick = () => {
    const { module, functionAccess } = this.props.values
    let criteria = {}
    if (module) {
      criteria = { ...criteria, module }
    }
    if (functionAccess) {
      criteria = { ...criteria, displayValue: functionAccess }
    }
    this.props.dispatch({
      type: 'settingUserRole/filter',
      criteria,
    })
  }

  goBackToPreviousPage = () => {
    const { history, resetForm } = this.props
    resetForm()
    history.goBack()
  }

  render () {
    const { classes, match, settingUserRole, userRole } = this.props
    const {
      currentSelectedUserRole,
      moduleList,
      displayValueList,
    } = settingUserRole
    const { gridConfig } = this.state
    const { params } = match

    return (
      <React.Fragment>
        <GridContainer
          alignItems='center'
          justify='space-between'
          className={classes.container}
        >
          <GridItem md={12} className={classes.verticalSpacing}>
            <h4>User Role</h4>
          </GridItem>
          <GridContainer className={classes.indent} alignItems='center'>
            <GridItem md={4}>
              <FastField
                name='code'
                render={(args) => (
                  <TextField label='Code' autoFocus {...args} />
                )}
              />
            </GridItem>
            <GridItem md={4}>
              <FastField
                name='effectiveDates'
                render={(args) => (
                  <DateRangePicker
                    {...args}
                    label='Effective Start Date'
                    label2='Effective End Date'
                  />
                )}
              />
            </GridItem>
          </GridContainer>

          <GridContainer className={classes.indent} alignItems='center'>
            <GridItem md={4}>
              <FastField
                name='name'
                render={(args) => (
                  <TextField label='name' autoFocus {...args} />
                )}
              />
            </GridItem>
          </GridContainer>

          <GridContainer className={classes.indent} alignItems='center'>
            <GridItem md={4}>
              <FastField
                name='description'
                render={(args) => (
                  <TextField label='description' autoFocus {...args} />
                )}
              />
            </GridItem>
          </GridContainer>

          <GridItem md={12} className={classes.verticalSpacing}>
            <h4>Access Right</h4>
          </GridItem>
          <GridContainer className={classes.indent} alignItems='center'>
            <GridItem md={2}>
              <Field
                name='module'
                render={(args) => (
                  <Select {...args} label='Module' options={moduleList} />
                )}
              />
            </GridItem>
            <GridItem md={2}>
              <Field
                name='functionAccess'
                render={(args) => (
                  <Select
                    {...args}
                    label='Function Access'
                    options={displayValueList}
                  />
                )}
              />
            </GridItem>

            <GridItem md={2}>
              <ProgressButton
                icon={<Search />}
                color='primary'
                onClick={this.handleSearchClick}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>
            </GridItem>

            <CommonTableGrid
              rows={userRole.filteredAccessRight}
              {...gridConfig}
              onRowDoubleClick={this.handleDoubleClick}
              FuncProps={{ pager: true }}
            />
          </GridContainer>
        </GridContainer>
        <GridItem
          container
          style={{
            marginTop: 10,
            marginBottom: 10,
            justifyContent: 'center',
          }}
        >
          <Button
            color='danger'
            onClick={navigateDirtyCheck({
              onProceed: this.goBackToPreviousPage,
            })}
          >
            Close
          </Button>
          <ProgressButton
            color='primary'
            // disabled={mode === 'Add' && this.state.selectedRows.length <= 0}
            onClick={() => {
              this.props.handleSubmit()
            }}
            disabled
          >
            Save
          </ProgressButton>
        </GridItem>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(UserRoleDetail)
