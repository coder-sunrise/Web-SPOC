import React from 'react'
import _ from 'lodash'
import * as Yup from 'yup'
import { connect } from 'dva'
import { withRouter } from 'react-router'
// formik
import { Field } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import { FormattedMessage } from 'umi/locale'
import Search from '@material-ui/icons/Search'
// common component
import {
  Button,
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
import { FilterBarDate } from '@/components/_medisys'

// utils
import { navigateDirtyCheck } from '@/utils/utils'
import { AccessRightConfig } from './const'

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
    }
  },
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    name: Yup.string().required(),
    effectiveStartDate: Yup.date().required(),
    effectiveEndDate: Yup.date().required(),
    description: Yup.string(),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { dispatch, onConfirm, history } = props
    let { filteredAccessRight, isEdit, ...restValues } = values
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
class Main extends React.Component {
  state = {
    filter: {
      module: undefined,
      displayValue: undefined,
    },
  }

  componentWillUnmount () {
    this.props.dispatch({
      type: 'settingUserRole/updateState',
      payload: {
        currentSelectedUserRole: undefined,
      },
    })
  }

  handleSearchClick = () => {
    const { filter } = this.state
    const { module, displayValue } = filter
    let criteria = {}
    if (module) {
      criteria = { ...criteria, module }
    }
    if (displayValue) {
      criteria = { ...criteria, displayValue }
    }
    this.props.dispatch({
      type: 'settingUserRole/filter',
      criteria,
    })
  }

  moduleList = () => {
    const { userRole } = this.props
    const { roleClientAccessRight } = userRole
    const { displayValue } = this.state.filter
    let filteredList = roleClientAccessRight || []
    if (displayValue) {
      filteredList = roleClientAccessRight.filter(
        (r) => r.displayValue === displayValue,
      )
    }

    let result = Array.from(
      new Set(filteredList.map((f) => f.module)),
    ).map((m) => {
      const item = filteredList.find((f) => f.module === m)
      return { name: item.module, value: item.module }
    })
    return result
  }

  displayValueList = () => {
    const { userRole } = this.props
    const { roleClientAccessRight } = userRole
    const { module } = this.state.filter
    let filteredList = roleClientAccessRight || []
    if (module) {
      filteredList = roleClientAccessRight.filter((r) => r.module === module)
    }

    let result = Array.from(
      new Set(filteredList.map((f) => f.displayValue)),
    ).map((m) => {
      const item = filteredList.find((f) => f.displayValue === m)
      return { name: item.displayValue, value: item.displayValue }
    })
    return result
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
    const { classes, userRole } = this.props
    const { filter } = this.state
    const { isEdit, isUserMaintainable } = userRole

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
              <GridItem md={3}>
                <Field
                  name='code'
                  render={(args) => {
                    return (
                      <TextField label='Code' disabled={isEdit} {...args} />
                    )
                  }}
                />
              </GridItem>
              <GridItem md={3}>
                <Field
                  name='effectiveStartDate'
                  render={(args) => (
                    <FilterBarDate
                      args={args}
                      label='Effective Start Date'
                      disabled={isEdit && !isUserMaintainable}
                    />
                  )}
                />
              </GridItem>
              <GridItem md={3}>
                <Field
                  name='effectiveEndDate'
                  render={(args) => (
                    <FilterBarDate
                      args={args}
                      label='Effective End Date'
                      isEndDate
                      disabled={isEdit && !isUserMaintainable}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>

            <GridContainer className={classes.indent} alignItems='center'>
              <GridItem md={3}>
                <Field
                  name='name'
                  render={(args) => (
                    <TextField
                      label='Name'
                      {...args}
                      disabled={isEdit && !isUserMaintainable}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>

            <GridContainer className={classes.indent} alignItems='center'>
              <GridItem md={3}>
                <Field
                  name='description'
                  render={(args) => (
                    <TextField
                      label='Description'
                      {...args}
                      disabled={isEdit && !isUserMaintainable}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>

            <GridContainer className={classes.indent} alignItems='center'>
              <GridItem md={3}>
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
                <Select
                  value={filter.module}
                  label='Module'
                  options={this.moduleList()}
                  onChange={this.onSelectModule}
                />
              </GridItem>
              <GridItem md={2}>
                <Select
                  value={filter.displayValue}
                  label='Function Access'
                  options={this.displayValueList()}
                  onChange={this.onSelectDisplayValue}
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
                {...AccessRightConfig({ isEdit, isUserMaintainable })}
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
              disabled={isEdit && !isUserMaintainable}
            >
              Save
            </ProgressButton>
          </GridItem>
        </SizeContainer>
      </React.Fragment>
    )
  }
}

export default withRouter(withStyles(styles)(Main))
