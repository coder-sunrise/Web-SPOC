import React from 'react'
import _ from 'lodash'
import $ from 'jquery'
import * as Yup from 'yup'
import { Radio } from 'antd'
import { connect } from 'dva'
import { withRouter } from 'react-router'
// formik
import { Field } from 'formik'
// material ui
import { withStyles, List, ListItem } from '@material-ui/core'
import moment from 'moment'
// common component
import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  withFormikExtend,
  ProgressButton,
  CodeSelect,
  DatePicker,
  Tabs,
  CommonTableGrid,
} from '@/components'

// utils
import { getBizSession } from '@/services/queue'
import { navigateDirtyCheck, getModuleSequence } from '@/utils/utils'
import { CLINICAL_ROLE } from '@/utils/constants'
const isMatchRole = (clinicRoleBitValue, clinicRoleBitValues = []) => {
  return (
    !clinicRoleBitValue || clinicRoleBitValues.indexOf(clinicRoleBitValue) >= 0
  )
}

const styles = theme => ({
  container: {
    marginBottom: theme.spacing(2),
    height: 'auto !important',
  },
  verticalSpacing: {
    marginTop: theme.spacing(2),
    '& > h4': {
      fontWeight: 500,
    },
  },
  indent: {
    paddingLeft: theme.spacing(2),
  },
  note: {
    fontSize: '0.9rem',
    fontStyle: 'italic',
  },
  radioButton: {
    width: 70,
    textAlign: 'center',
    fontSize: '0.75rem',
  },
  tabContent: {
    borderRadius: 0,
    marginBottom: 1,
    border: '1px solid #d9d9d9',
    borderStyle: 'solid solid solid none',
    backgroundColor: 'white',
  },
  accessType: {
    fontWeight: 500,
    fontSize: '1rem',
  },
  allButton: {
    cursor: 'pointer',
    width: 70,
    textAlign: 'center',
  },
  moduleContent: {
    height: 550,
    overflow: 'auto',
    paddingRight: 5,
  },
  listRoot: {
    width: '100%',
  },
  listItemRoot: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: '5px !important',
    paddingRight: '4px !important',
  },
})

@connect(({ settingUserRole, global, clinicSettings }) => ({
  settingUserRole,
  userRole: settingUserRole.currentSelectedUserRole,
  mainDivHeight: global.mainDivHeight,
  clinicSettings: clinicSettings,
}))
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: props => {
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
    const { roleClientAccessRight, ...restValues } = values
    let result = _.cloneDeep(restValues)
    result.roleClientAccessRight = roleClientAccessRight.filter(m =>
      isMatchRole(values.clinicRoleBitValue, m.clinicRoleBitValues),
    )
    if (!values.id) {
      result.roleClientAccessRight = result.roleClientAccessRight.map(d => {
        const { id, ...data } = d
        return data
      })
      const { id, concurrencyToken, ...tempValue } = result
      result = tempValue
      result.isUserMaintainable = true
    }

    dispatch({
      type: 'settingUserRole/upsert',
      payload: result,
    }).then(r => {
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
    hasUser: true,
    hasActiveSession: true,
    isActive: false,
    selectAccessRight: undefined,
    filterAccessRight: undefined,
  }

  debouncedAction = _.debounce(
    e => {
      this.setFilterAccessRight(e)
    },
    100,
    {
      leading: true,
      trailing: false,
    },
  )

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
        .then(response => {
          const result = response.data.filter(m => {
            return m.userProfile?.role?.id === userRole.id
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

  handleSearch = (e, option) => {
    const { values } = this.props
    const { roleClientAccessRight, ...restValues } = values
    let result = _.cloneDeep(restValues)
    result.roleClientAccessRight = roleClientAccessRight
    if (typeof e === 'number') {
      result.clinicRoleFK = e
    }
    result.clinicRoleBitValue = option?.clinicRoleBitValue
    this.props.dispatch({
      type: 'settingUserRole/updateState',
      payload: {
        currentSelectedUserRole: result,
      },
    })
  }

  moduleList = () => {
    const { userRole } = this.props
    const { roleClientAccessRight } = userRole
    let filteredList = roleClientAccessRight || []

    let result = Array.from(new Set(filteredList.map(f => f.module))).map(m => {
      const item = filteredList.find(f => f.module === m)
      return {
        name: item.module,
        value: item.module,
        sequence: getModuleSequence(item.module),
      }
    })

    const receptionModule = result.find(r => r.value === 'Reception')
    const consultationModule = result.find(r => r.value === 'Consultation')
    const patientDashboardModule = result.find(
      r => r.value === 'Patient Dashboard',
    )

    if (receptionModule && consultationModule) {
      consultationModule.sequence = receptionModule.sequence + 0.1
    }

    if (receptionModule && patientDashboardModule) {
      patientDashboardModule.sequence = receptionModule.sequence + 0.2
    }
    return _.orderBy(result, ['sequence'], ['asc'])
  }

  goBackToPreviousPage = () => {
    const { history, resetForm } = this.props
    resetForm()
    history.goBack()
  }

  onClickAll = (type, newValue, moduleName) => {
    const { values, setFieldValue } = this.props
    let { roleClientAccessRight = [], clinicRoleFK } = values
    roleClientAccessRight = _.orderBy(
      roleClientAccessRight,
      ['sortOrder'],
      ['asc'],
    )

    const updateRoleClientAccessRight = roleClientAccessRight.filter(
      m =>
        isMatchRole(values.clinicRoleBitValue, m.clinicRoleBitValues) &&
        m.module === moduleName &&
        m.type === type,
    )

    const updateChildrenAccessRight = clientAccessRightFK => {
      let currenAccessRight = roleClientAccessRight.filter(accessRight => {
        return (
          isMatchRole(
            values.clinicRoleBitValue,
            accessRight.clinicRoleBitValues,
          ) && accessRight.parentClientAccessRightFK === clientAccessRightFK
        )
      })
      currenAccessRight.forEach(r => {
        if (newValue === 'Hidden' && r.permission !== 'Hidden') {
          r.permission = newValue
          updateChildrenAccessRight(r.clientAccessRightFK)
        } else if (['Enable', 'ReadWrite'].indexOf(r.permission) >= 0) {
          if (r.type === 'Module') {
            r.permission = 'ReadOnly'
          }
          if (r.type === 'Action') r.permission = 'Disable'
          if (r.type === 'Field') r.permission = 'ReadOnly'
          updateChildrenAccessRight(r.clientAccessRightFK)
        }
      })
    }

    updateRoleClientAccessRight.forEach(r => {
      if (r.permission !== newValue) {
        if (
          !this.isOverParentAccessRight(
            values.clinicRoleBitValue,
            r,
            newValue,
            roleClientAccessRight,
          )
        ) {
          r.permission = newValue
          updateChildrenAccessRight(r.clientAccessRightFK)
        }
      }
    })

    setFieldValue('roleClientAccessRight', [...roleClientAccessRight])
  }

  isParentSelect = (clientAccessRightFK, moduleName) => {
    if (!this.state.selectAccessRight) return false
    if (this.state.selectAccessRight.module !== moduleName) return false
    if (
      clientAccessRightFK === this.state.selectAccessRight.clientAccessRightFK
    )
      return true
    const { values } = this.props
    const { roleClientAccessRight = [] } = values
    const currentRoleClientAccessRight = roleClientAccessRight.filter(m =>
      isMatchRole(values.clinicRoleBitValue, m.clinicRoleBitValues),
    )
    const checkParentSelect = currentClientAccessRightId => {
      if (
        currentClientAccessRightId ===
        this.state.selectAccessRight.clientAccessRightFK
      )
        return true

      const currenClientAccessRight = currentRoleClientAccessRight.find(
        r => r.clientAccessRightFK === currentClientAccessRightId,
      )

      if (
        !currenClientAccessRight ||
        !currenClientAccessRight.parentClientAccessRightFK
      )
        return false

      return checkParentSelect(
        currenClientAccessRight.parentClientAccessRightFK,
      )
    }

    return checkParentSelect(clientAccessRightFK)
  }

  getModuleItems = (mudule, type) => {
    const { values } = this.props
    const { roleClientAccessRight = [] } = values
    const currentRoleClientAccessRight = roleClientAccessRight.filter(
      m =>
        isMatchRole(values.clinicRoleBitValue, m.clinicRoleBitValues) &&
        m.module === mudule &&
        m.type === type &&
        m.displayValue
          .toUpperCase()
          .indexOf((this.state.filterAccessRight || '').toUpperCase()) >= 0,
    )

    return _.orderBy(currentRoleClientAccessRight, ['sortOrder'], ['asc'])
  }

  setFilterAccessRight = e => {
    this.setState({ filterAccessRight: e.target.value })
  }

  accessRightChange = (item, newValue) => {
    if (item.permission === newValue) return
    const { values, setFieldValue } = this.props
    let { roleClientAccessRight = [], clinicRoleFK } = values
    const updateChildrenAccessRight = clientAccessRightFK => {
      let currenAccessRight = roleClientAccessRight.filter(accessRight => {
        return (
          isMatchRole(
            values.clinicRoleBitValue,
            accessRight.clinicRoleBitValues,
          ) && accessRight.parentClientAccessRightFK === clientAccessRightFK
        )
      })
      currenAccessRight.forEach(r => {
        if (newValue === 'Hidden' && r.permission !== 'Hidden') {
          r.permission = newValue
          updateChildrenAccessRight(r.clientAccessRightFK)
        } else if (['Enable', 'ReadWrite'].indexOf(r.permission) >= 0) {
          if (r.type === 'Module') {
            r.permission = 'ReadOnly'
          }
          if (r.type === 'Action') r.permission = 'Disable'
          if (r.type === 'Field') r.permission = 'ReadOnly'
          updateChildrenAccessRight(r.clientAccessRightFK)
        }
      })
    }

    let selectAccessRight = roleClientAccessRight.find(accessRight => {
      return (
        isMatchRole(
          values.clinicRoleBitValue,
          accessRight.clinicRoleBitValues,
        ) && accessRight.clientAccessRightFK === item.clientAccessRightFK
      )
    })
    selectAccessRight.permission = newValue

    if (['Enable', 'ReadWrite'].indexOf(newValue) < 0) {
      updateChildrenAccessRight(item.clientAccessRightFK)
    }

    setFieldValue('roleClientAccessRight', [...roleClientAccessRight])
  }

  isOverParentAccessRight = (
    clinicRoleBitValue,
    accessRight,
    accessValue,
    roleClientAccessRight,
  ) => {
    if (!accessRight.parentClientAccessRightFK) return false

    const parentRoleClientAccessRight = roleClientAccessRight.find(
      m =>
        isMatchRole(clinicRoleBitValue, m.clinicRoleBitValues) &&
        m.clientAccessRightFK === accessRight.parentClientAccessRightFK,
    )
    if (parentRoleClientAccessRight) {
      if (['Enable', 'ReadWrite'].indexOf(accessValue) >= 0) {
        return (
          ['Enable', 'ReadWrite'].indexOf(
            parentRoleClientAccessRight.permission,
          ) < 0
        )
      }
      return parentRoleClientAccessRight.permission === 'Hidden'
    }
    return false
  }

  isDisable = (accessRight, accessValue) => {
    const { values } = this.props
    let { roleClientAccessRight = [] } = values
    if (accessValue === 'Hidden') return false
    return this.isOverParentAccessRight(
      values.clinicRoleBitValue,
      accessRight,
      accessValue,
      roleClientAccessRight,
    )
  }

  renderItems = (moduleName, type) => {
    const { classes } = this.props
    const items = this.getModuleItems(moduleName, type)
    return (
      <GridItem
        xs={12}
        sm={12}
        md={4}
        lg={4}
        container
        style={{
          border: '1px solid #d9d9d9',
          borderStyle: type === 'Field' ? 'none' : 'none solid none none',
          padding: 0,
        }}
      >
        <GridItem
          xs={12}
          sm={12}
          md={12}
          style={{ marginTop: 8, marginBottom: 4 }}
        >
          <div
            style={{
              display: 'flex',
            }}
          >
            <div className={classes.accessType}>{type}</div>
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
              }}
            >
              <Radio.Group
                style={{ width: 210 }}
                size='small'
                value=''
                onChange={e => {
                  this.onClickAll(type, e.target.value, moduleName)
                }}
              >
                <Radio.Button
                  value={type === 'Action' ? 'Enable' : 'ReadWrite'}
                  className={classes.radioButton}
                >
                  All
                </Radio.Button>
                <Radio.Button
                  value={type === 'Action' ? 'Disable' : 'ReadOnly'}
                  className={classes.radioButton}
                >
                  All
                </Radio.Button>
                <Radio.Button value='Hidden' className={classes.radioButton}>
                  All
                </Radio.Button>
              </Radio.Group>
            </div>
          </div>
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={12}
          style={{ marginBottom: 8, paddingRight: 0, paddingLeft: 8 }}
        >
          <div className={classes.moduleContent}>
            <List
              component='nav'
              classes={{
                root: classes.listRoot,
              }}
              disablePadding
              onClick={() => {}}
            >
              {items.map(item => {
                return (
                  <ListItem
                    alignItems='flex-start'
                    classes={{
                      root: classes.listItemRoot,
                    }}
                    selected={
                      this.state.selectAccessRight &&
                      this.state.selectAccessRight.clientAccessRightFK ===
                        item.clientAccessRightFK
                    }
                    divider
                    disableGutters
                    button
                    onClick={() => {
                      if (
                        !this.state.selectAccessRight ||
                        this.state.selectAccessRight.clientAccessRightFK !==
                          item.clientAccessRightFK
                      )
                        this.setState({
                          selectAccessRight: item,
                        })
                    }}
                  >
                    <div
                      style={{
                        marginTop: 5,
                        marginLeft: item.level > 1 ? 10 * (item.level - 1) : 0,
                        color: this.isParentSelect(
                          item.clientAccessRightFK,
                          item.module,
                        )
                          ? '#4255bd'
                          : 'black',
                        fontSize: '0.85rem',
                      }}
                    >
                      {item.displayValue}
                    </div>
                    <div
                      style={{
                        marginLeft: 'auto',
                        display: 'flex',
                        marginTop: 3,
                        marginBottom: 4,
                      }}
                    >
                      <Radio.Group
                        style={{
                          width: 210,
                        }}
                        size='small'
                        value={item.permission}
                        onChange={e => {
                          this.accessRightChange(item, e.target.value)
                        }}
                      >
                        <Radio.Button
                          disabled={this.isDisable(
                            item,
                            type === 'Action' ? 'Enable' : 'ReadWrite',
                          )}
                          value={type === 'Action' ? 'Enable' : 'ReadWrite'}
                          className={classes.radioButton}
                        >
                          {type === 'Action' ? 'Enable' : 'Read Write'}
                        </Radio.Button>
                        <Radio.Button
                          disabled={this.isDisable(
                            item,
                            type === 'Action' ? 'Disable' : 'ReadOnly',
                          )}
                          value={type === 'Action' ? 'Disable' : 'ReadOnly'}
                          className={classes.radioButton}
                        >
                          {type === 'Action' ? 'Disable' : 'Read Only'}
                        </Radio.Button>
                        <Radio.Button
                          value='Hidden'
                          className={classes.radioButton}
                          disabled={this.isDisable(item, 'Hidden')}
                        >
                          Hidden
                        </Radio.Button>
                      </Radio.Group>
                    </div>
                  </ListItem>
                )
              })}
            </List>
          </div>
        </GridItem>
      </GridItem>
    )
  }

  render() {
    const { classes, values, clinicSettings } = this.props
    const { hasUser, hasActiveSession, isActive } = this.state
    const {
      id,
      isUserMaintainable,
      effectiveStartDate,
      effectiveEndDate,
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
            <h4>User Group</h4>
          </GridItem>
          <GridContainer className={classes.indent} alignItems='center'>
            <GridItem md={3}>
              <Field
                name='code'
                render={args => {
                  return <TextField label='Code' disabled={isEdit} {...args} />
                }}
              />
            </GridItem>
            <GridItem md={3}>
              <Field
                name='name'
                render={args => (
                  <TextField
                    label='Name'
                    {...args}
                    disabled={isEdit && !isUserMaintainable}
                  />
                )}
              />
            </GridItem>
            <GridItem md={3}>
              <Field
                name='description'
                render={args => (
                  <TextField
                    label='Description'
                    {...args}
                    disabled={isEdit && !isUserMaintainable}
                  />
                )}
              />
            </GridItem>
            <GridItem md={3} />
            <GridItem md={3}>
              <Field
                name='effectiveStartDate'
                render={args => (
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
                render={args => (
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
            <GridItem md={3}>
              <Field
                name='clinicRoleFK'
                render={args => (
                  <CodeSelect
                    {...args}
                    label='Clinical Role'
                    code='ltclinicalrole'
                    labelField='displayValue'
                    disabled={isEdit}
                    // localFilter={item => {
                    //   return filterArray.includes(item.id)
                    // }}
                    onChange={this.handleSearch}
                  />
                )}
              />
            </GridItem>
            <GridItem md={3}>
              <p className={classes.note}>
                You are not allowed to change clinical role after save.
              </p>
            </GridItem>
          </GridContainer>
          <GridItem md={9} className={classes.verticalSpacing}>
            <h4>Access Right</h4>
          </GridItem>
          <GridItem md={3} className={classes.verticalSpacing}>
            <TextField
              label='Filter Access Right'
              onChange={e => {
                this.debouncedAction(e)
              }}
            />
          </GridItem>
          <Tabs
            md={12}
            tabPosition='left'
            options={this.moduleList().map((m, index) => {
              return {
                id: index,
                name: m.name,
                content: (
                  <div className={classes.tabContent}>
                    <GridContainer style={{ padding: 0 }}>
                      {this.renderItems(m.name, 'Module')}
                      {this.renderItems(m.name, 'Action')}
                      {this.renderItems(m.name, 'Field')}
                    </GridContainer>
                    <CommonTableGrid
                      FuncProps={{
                        pager: false,
                      }}
                      style={{ height: 0 }}
                    />
                  </div>
                ),
              }
            })}
            tabStyle={{
              marginRight: 8,
              marginLeft: -24,
            }}
            tabBarStyle={{ marginLeft: 10 }}
            tabBarGutter={0}
          />
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
              this.props.dispatch({
                type: 'global/updateAppState',
                payload: {
                  openConfirm: true,
                  openConfirmContent: `Save User Group ?`,
                  onConfirmSave: this.props.handleSubmit,
                },
              })
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
