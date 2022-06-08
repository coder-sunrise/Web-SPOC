import React, { PureComponent } from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
import _ from 'lodash'
import $ from 'jquery'
// material ui
import ListAlt from '@material-ui/icons/ListAlt'
import Search from '@material-ui/icons/Search'
import { withStyles } from '@material-ui/core'
// common components
import {
  GridContainer,
  GridItem,
  CardContainer,
  TextField,
  Accordion,
  Button,
} from '@/components'
// variable
import { Authority, menuData } from './variables'
// utils
import Authorized from '@/utils/Authorized'

const styles = () => ({
  baseBtn: {
    minHeight: 56,
    '& svg': {
      width: 24,
      height: 24,
    },
    '& > span': {
      display: 'flex',
      justifyContent: 'space-between',
    },
    '& > span > span': {
      width: '100%',
    },
  },
  bigviewBtn: {
    // width: 180,
    marginRight: 0,
    minHeight: 106,
  },
  longTextBtn: {
    '& span': {
      whiteSpace: 'initial',
    },
    '& svg': {
      width: 50,
      height: 50,
    },
  },
  searchField: {
    width: '20%',
  },
})

@connect(({ systemSetting, global, user, clinicSettings }) => ({
  systemSetting,
  global,
  user,
  clinicSettings,
}))
class SystemSetting extends PureComponent {
  constructor(props) {
    super(props)
    const { clinicSettings } = this.props
    const { settings = [] } = clinicSettings
    let filteredMenu = menuData
    Object.entries(settings).forEach(([key, value]) => {
      if (typeof value === 'boolean' && !value) {
        filteredMenu = filteredMenu.filter(
          set => set.hiddenWhenClinicSettingIsOff !== key,
        )
      }
    })
    this.group = _.groupBy(filteredMenu, 'title')
  }

  menus = () => {
    const { classes, theme, systemSetting, clinicSettings } = this.props

    const { settings = [] } = clinicSettings
    const { filterValues } = systemSetting
    const { searchText } = filterValues

    const filterByAccessRight = (_result, m) => {
      const accessRight = Authorized.check(m.authority)

      if (
        !accessRight ||
        (accessRight && accessRight.rights === 'hidden') ||
        accessRight.rights === 'disable'
      )
        return [..._result]

      if (m.text === 'Package' && !settings.isEnablePackage) return [..._result]

      return [..._result, { ...m, rights: accessRight.rights }]
    }

    return Object.keys(this.group).map(o => {
      const filteredByAccessRight = this.group[o]
        .reduce(filterByAccessRight, [])
        .filter(m => {
          return (
            m.text.toLocaleLowerCase().indexOf(searchText) >= 0 || !searchText
          )
        })

      return {
        authority: Authority[o],
        title: o,
        items: this.group[o],
        key: o,
        itemCount: filteredByAccessRight.length,
        content: (
          <GridContainer style={{ marginTop: theme.spacing(1) }} key={o}>
            {filteredByAccessRight.map((item, i) => {
              // New design concept is hide element from ui when access right is 'disable'
              // const disabled = item.rights === 'disable'
              return (
                <GridItem
                  key={i}
                  xs={4}
                  md={2}
                  style={{ marginBottom: theme.spacing(2) }}
                >
                  <Button
                    fullWidth
                    color='primary'
                    className={classnames({
                      [classes.baseBtn]: true,
                    })}
                    variant='outlined'
                    // disabled={disabled}
                    onClick={() => {
                      this.props.history.push(item.url)
                    }}
                  >
                    <ListAlt />
                    <span>{item.text}</span>
                  </Button>
                </GridItem>
              )
            })}
          </GridContainer>
        ),
      }
    })
  }

  setActivePanelKey = activeKeys => {
    const { dispatch, systemSetting } = this.props
    const { filterValues } = systemSetting
    dispatch({
      type: 'systemSetting/updateState',
      payload: {
        filterValues: { ...filterValues, actives: activeKeys },
      },
    })
  }

  onAccordionChange = (event, panel, expanded) => {
    const { systemSetting } = this.props
    const { filterValues } = systemSetting
    const { actives, searchText } = filterValues

    let newActives = [...actives]
    const isMultiple = searchText.length > 0

    if (!isMultiple) {
      const activeKeys = expanded ? [panel.key] : []
      this.setActivePanelKey(activeKeys)
      return
    }

    if (expanded) {
      newActives = [...newActives, panel.key]
    } else newActives = newActives.filter(key => key !== panel.key)
    this.setActivePanelKey(newActives)
  }

  onSearchTextChange = e => {
    this.props.dispatch({
      type: 'systemSetting/updateState',
      payload: {
        filterValues: {
          actives: [0],
          searchText: e.target.value.toLowerCase(),
        },
      },
    })
  }

  clearSearchText = () => {
    const { systemSetting, dispatch } = this.props
    const { filterValues } = systemSetting
    dispatch({
      type: 'systemSetting/updateState',
      payload: {
        filterValues: {
          ...filterValues,
          searchText: '',
        },
      },
    })
  }

  render() {
    const { classes, user, systemSetting, global } = this.props
    const { filterValues } = systemSetting
    const { actives, searchText } = filterValues

    const { accessRights = [] } = user
    const isMultiple = searchText.length > 0
    const activeConfig = isMultiple
      ? {
          activedKeys: actives,
        }
      : { active: actives[0] }
    const menus = this.menus().filter(item => item.itemCount > 0)

    const { mainDivHeight = 700 } = global
    let height = mainDivHeight - 50 - ($('.filterSettingBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterSettingBar'>
          <TextField
            className={classes.searchField}
            prefix={<Search />}
            onChange={this.onSearchTextChange}
            autoFocus
            value={searchText}
          />
        </div>
        <div style={{ maxHeight: height, overflow: 'auto' }}>
          <Accordion
            defaultActive={0}
            mode={isMultiple ? 'multiple' : 'default'}
            {...activeConfig}
            onChange={this.onAccordionChange}
            collapses={menus.filter(item => {
              const accessRight = accessRights.find(
                menuItem => menuItem.name === item.authority,
              )
              const hide =
                !accessRight || (accessRights && accessRights === 'hidden')
              if (hide) return false
              return (
                !searchText ||
                item.items.find(
                  m => m.text.toLocaleLowerCase().indexOf(searchText) >= 0,
                )
              )
            })}
          />
        </div>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(SystemSetting)
