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
  CodeSelect,
  SizeContainer,
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
  indent: {
    paddingLeft: theme.spacing(2),
  },
  note: {
    fontSize: 14,
    fontStyle: 'italic',
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
    description: Yup.string(),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { dispatch, onConfirm, history } = props
    let { effectiveDates, filteredAccessRight, isEdit, ...restValues } = values
    restValues.roleClientAccessRight = filteredAccessRight
    if (!isEdit) {
      restValues.roleClientAccessRight = filteredAccessRight.map((d) => {
        const { id, ...data } = d
        return data
      })
      const { id, concurrencyToken, ...tempValue } = restValues
      restValues = tempValue
      restValues.isUserMaintainable = true
    }
    dispatch({
      type: 'settingUserRole/upsert',
      payload: restValues,
    }).then((r) => {
      if (r) {
        resetForm()
        if (onConfirm) onConfirm()
        history.push('/setting/userrole')
      }
    })
  },
  displayName: 'userRoleDetail',
})
class UserRoleDetail extends React.Component {
  state = {
    filter: {
      module: undefined,
      displayValue: undefined,
    },
  }

  componentDidMount = () => {
    const rowId = this.props.match.params.id
    if (rowId) {
      this.props.dispatch({
        type: 'settingUserRole/fetchUserRoleByID',
        payload: {
          id: rowId,
          isEdit: true,
        },
      })
    } else if (this.props.location.state) {
      const newId = this.props.location.state.id
      this.props.dispatch({
        type: 'settingUserRole/fetchUserRoleByID',
        payload: {
          id: newId,
          isEdit: false,
        },
      })
    } else {
      this.props.dispatch({
        type: 'settingUserRole/fetchDefaultAccessRight',
        payload: { isEdit: false },
      })
    }
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

  moduleList = () => {
    const { userRole, settingUserRole } = this.props
    const { roleClientAccessRight } = userRole
    let { moduleList } = settingUserRole
    const { displayValue } = this.state.filter
    let result = moduleList
    if (displayValue) {
      result = roleClientAccessRight
        .filter((r) => r.displayValue === displayValue)
        .map((f) => {
          return { name: f.module, value: f.module }
        })
    }
    return [
      ...new Set(result),
    ]
  }

  displayValueList = () => {
    const { userRole, settingUserRole } = this.props
    const { roleClientAccessRight } = userRole
    let { displayValueList } = settingUserRole
    const { module } = this.state.filter
    let result = displayValueList
    if (module) {
      result = roleClientAccessRight
        .filter((r) => r.module === module)
        .map((f) => {
          return { name: f.displayValue, value: f.displayValue }
        })
    }
    return [
      ...new Set(result),
    ]
  }

  onSelectModule = (e) =>
    this.setState((prev) => {
      return {
        ...prev,
        filter: {
          ...prev.filter,
          module: e,
        },
      }
    })

  onSelectDisplayValue = (e) =>
    this.setState((prev) => {
      return {
        ...prev,
        filter: {
          ...prev.filter,
          displayValue: e,
        },
      }
    })

  goBackToPreviousPage = () => {
    const { history, resetForm } = this.props
    resetForm()
    history.goBack()
  }

  render () {
    const { classes, match, settingUserRole, userRole } = this.props
    const { currentSelectedUserRole } = settingUserRole
    const { params } = match
    const { isEdit } = currentSelectedUserRole

    return (
      <React.Fragment>
        <SizeContainer size='sm'>
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
                  render={(args) => {
                    return (
                      <TextField label='Code' disabled={isEdit} {...args} />
                    )
                  }}
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
                  render={(args) => <TextField label='Name' {...args} />}
                />
              </GridItem>
            </GridContainer>

            <GridContainer className={classes.indent} alignItems='center'>
              <GridItem md={4}>
                <FastField
                  name='description'
                  render={(args) => <TextField label='Description' {...args} />}
                />
              </GridItem>
            </GridContainer>

            <GridContainer className={classes.indent} alignItems='center'>
              <GridItem md={4}>
                <Field
                  name='clinicRoleFK'
                  render={(args) => (
                    <CodeSelect
                      {...args}
                      label='Clinical Role'
                      code='ltclinicalrole'
                      disabled={isEdit}
                    />
                  )}
                />
              </GridItem>
              <GridItem md={8}>
                <p className={classes.note}>
                  You are not allowed to change clinical role after save.
                </p>
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
                    <Select
                      {...args}
                      label='Module'
                      options={this.moduleList()}
                      onChange={this.onSelectModule}
                    />
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
                      options={this.displayValueList()}
                      onChange={this.onSelectDisplayValue}
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
                {...AccessRightConfig}
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
              onClick={() => {
                this.props.handleSubmit()
              }}
            >
              Save
            </ProgressButton>
          </GridItem>
        </SizeContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(UserRoleDetail)
