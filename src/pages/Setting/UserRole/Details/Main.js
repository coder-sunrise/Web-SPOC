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
import moment from 'moment'
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
  DatePicker,
  CommonModal,
} from '@/components'

// utils
import { getBizSession } from '@/services/queue'
import { navigateDirtyCheck } from '@/utils/utils'
import { AccessRightConfig } from './Const'
import Prompt from './Prompt'

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
    fontSize: '0.9rem',
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
    clinicRoleFK: Yup.string().required(),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { dispatch, onConfirm, history } = props
    let { roleClientAccessRight, filteredAccessRight, ...restValues } = values
    restValues.roleClientAccessRight = roleClientAccessRight
      .filter(
        (m) =>
          !values.clinicRoleFK ||
          m.clinicRoleBitValue >= 2 ** (values.clinicRoleFK - 1),
      )
      .map((r) => {
        const data = filteredAccessRight.filter((m) => {
          return m.clientAccessRightFK === r.clientAccessRightFK
        })
        return data.length === 0 ? r : data[0]
      })
    if (!values.id) {
      restValues.roleClientAccessRight = roleClientAccessRight.map((d) => {
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
    hasUser: true,
    hasActiveSession: true,
    isActive: false,
    showModal: false,
    currSelectedValue: undefined,
    currSelectedRow: undefined,
  }

  componentDidMount = () => {
    this.setIsActive()
    this.checkHasUser()
    this.checkHasActiveSession()
  }

  setIsActive = () => {
    const { effectiveStartDate, effectiveEndDate } = this.props.userRole
    if (effectiveStartDate && effectiveEndDate) {
      this.setState({
        isActive:
          moment(effectiveStartDate) <= moment() &&
          moment() <= moment(effectiveEndDate),
      })
    }
  }

  checkHasUser = async () => {
    const { userRole } = this.props
    if (userRole.id) {
      this.props
        .dispatch({
          type: 'settingUserRole/fetchActiveUsers',
        })
        .then((response) => {
          const result = response.data.filter((m) => {
            return m.userProfile.role.clinicRoleFK === userRole.clinicRoleFK
          })
          this.setState({ hasUser: result.length > 0 })
        })
    }
  }

  checkHasActiveSession = async () => {
    try {
      const bizSessionPayload = {
        IsClinicSessionClosed: false,
      }
      const result = await getBizSession(bizSessionPayload)
      const { data } = result.data

      this.setState(() => {
        return {
          hasActiveSession: data.length > 0,
        }
      })
    } catch (error) {
      console.log({ error })
    }
  }

  handleSearch = async (e) => {
    const { filter } = this.state
    const { module, displayValue } = filter
    const { values } = this.props
    const { roleClientAccessRight, filteredAccessRight, ...restValues } = values
    restValues.roleClientAccessRight = roleClientAccessRight
      .map((d) => {
        const data = filteredAccessRight.filter((m) => {
          return m.clientAccessRightFK === d.clientAccessRightFK
        })
        return data.length === 0 ? d : data[0]
      })
      .sort(this.compare)

    restValues.filteredAccessRight = restValues.roleClientAccessRight
      .filter(
        (m) => {
          if (e) {
            let index = values.clinicRoleFK
            if (typeof e === 'number') index = e
            return !index || m.clinicRoleBitValue >= 2 ** (index - 1)
          }
          return true
        },
        // typeof e !== 'number' || m.clinicRoleBitValue >= 2 ** (e - 1),
      )
      .filter((m) => {
        return !module || m.module === module
      })
      .filter((m) => {
        return !displayValue || m.displayValue === displayValue
      })
      .sort(this.compare)

    if (typeof e === 'number') {
      restValues.clinicRoleFK = e
    }

    this.props.dispatch({
      type: 'settingUserRole/updateState',
      payload: {
        currentSelectedUserRole: restValues,
      },
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

  updateSelectedValues = async () => {
    const { values } = this.props
    const { currSelectedValue, currSelectedRow } = this.state
    const { roleClientAccessRight, filteredAccessRight, ...restValues } = values
    restValues.roleClientAccessRight = roleClientAccessRight
      .map((r) => {
        if (r.module === currSelectedRow.module) {
          if (currSelectedValue === 'ReadOnly' && r.type === 'Action') {
            r.permission = 'Disable'
          }
          r.permission = currSelectedValue
        }
        return r
      })
      .sort(this.compare)
    restValues.filteredAccessRight = filteredAccessRight
      .map((r) => {
        if (r.module === currSelectedRow.module) {
          if (currSelectedValue === 'ReadOnly' && r.type === 'Action') {
            r.permission = 'Disable'
          }
          r.permission = currSelectedValue
        }
        return r
      })
      .sort(this.compare)
    await this.props.dispatch({
      type: 'settingUserRole/updateState',
      payload: {
        currentSelectedUserRole: restValues,
      },
    })

    this.toggleModal()
  }

  onConfirmChangeRight = (value, row) => {
    if (row.type === 'Module' && value !== 'ReadWrite')
      this.setState({ currSelectedValue: value, currSelectedRow: row }, () => {
        this.toggleModal()
      })
  }

  onCancel = async () => {
    const { values } = this.props
    const { currSelectedRow } = this.state
    const { roleClientAccessRight, filteredAccessRight, ...restValues } = values
    restValues.roleClientAccessRight = roleClientAccessRight
      .map((r) => {
        if (r.id === currSelectedRow.id) {
          r.permission = currSelectedRow.permission
        }
        return r
      })
      .sort(this.compare)
    restValues.filteredAccessRight = filteredAccessRight
      .map((r) => {
        if (r.id === currSelectedRow.id) {
          r.permission = currSelectedRow.permission
        }
        return r
      })
      .sort(this.compare)

    await this.props.dispatch({
      type: 'settingUserRole/updateState',
      payload: {
        currentSelectedUserRole: restValues,
      },
    })

    this.toggleModal()
  }

  toggleModal = () => {
    const { showModal } = this.state
    this.setState({ showModal: !showModal })
  }

  compare = (a, b) => {
    const f = a.module.localeCompare(b.module)
    if (f !== 0) return f
    return a.sortOrder - b.sortOrder
  }

  render () {
    const { classes, values, footer } = this.props
    const {
      filter,
      hasUser,
      hasActiveSession,
      isActive,
      showModal,
    } = this.state
    const {
      id,
      isUserMaintainable,
      effectiveStartDate,
      effectiveEndDate,
      filteredAccessRight,
    } = values

    const isEdit = !!id

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
            <GridItem md={3}>
              <Field
                name='code'
                render={(args) => {
                  return <TextField label='Code' disabled={isEdit} {...args} />
                }}
              />
            </GridItem>
            <GridItem md={3}>
              <Field
                name='effectiveStartDate'
                render={(args) => (
                  <DatePicker
                    {...args}
                    label='Effective Start Date'
                    disabled={
                      isEdit &&
                      (!isUserMaintainable ||
                        (isActive && (hasUser || hasActiveSession)))
                    }
                    restrictFromTo={[
                      moment('0000-01-01').formatUTC(),
                      effectiveEndDate,
                    ]}
                  />
                )}
              />
            </GridItem>
            <GridItem md={3}>
              <Field
                name='effectiveEndDate'
                render={(args) => (
                  <DatePicker
                    {...args}
                    label='Effective End Date'
                    disabled={
                      isEdit &&
                      (!isUserMaintainable ||
                        (isActive && (hasUser || hasActiveSession)))
                    }
                    restrictFromTo={[
                      effectiveStartDate,
                      moment('2099-12-31').formatUTC(false),
                    ]}
                    endDay
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
                    onChange={this.handleSearch}
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
                dropdownMatchSelectWidth={false}
                onChange={this.onSelectDisplayValue}
              />
            </GridItem>

            <GridItem md={2}>
              <ProgressButton
                icon={<Search />}
                color='primary'
                onClick={this.handleSearch}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>
            </GridItem>

            <SizeContainer size='sm'>
              <CommonTableGrid
                forceRender
                rows={filteredAccessRight}
                {...AccessRightConfig({
                  isEdit,
                  isUserMaintainable,
                  onConfirmChangeRight: this.onConfirmChangeRight,
                })}
                FuncProps={{ pager: true }}
              />
            </SizeContainer>
            <CommonModal
              open={showModal}
              maxWidth='md'
              title='Confirm to change access right'
              onClose={this.onCancel}
              onConfirm={this.onCancel}
            >
              <Prompt updateSelectedValues={this.updateSelectedValues} />
            </CommonModal>
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
      </React.Fragment>
    )
  }
}

export default withRouter(withStyles(styles)(Main))
