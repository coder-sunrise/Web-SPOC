import React, { PureComponent } from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
import _ from 'lodash'
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

@connect(({ systemSetting, global, user }) => ({
  systemSetting,
  global,
  user,
}))
class SystemSetting extends PureComponent {
  constructor (props) {
    super(props)
    this.group = _.groupBy(menuData, 'title')
  }

  menus = () => {
    const { classes, theme, systemSetting } = this.props

    const { filterValues } = systemSetting
    const { searchText } = filterValues
    return Object.keys(this.group).map((o) => {
      return {
        authority: Authority[o],
        title: o,
        items: this.group[o],
        key: o,
        content: (
          <GridContainer style={{ marginTop: theme.spacing(1) }} key={o}>
            {this.group[o]
              .filter((m) => {
                return (
                  m.text.toLocaleLowerCase().indexOf(searchText) >= 0 ||
                  !searchText
                )
              })
              .map((item, i) => {
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

  setActivePanelKey = (activeKeys) => {
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

    let newActives = [
      ...actives,
    ]
    const isMultiple = searchText.length > 0

    if (!isMultiple) {
      const activeKeys = expanded
        ? [
            panel.key,
          ]
        : []
      this.setActivePanelKey(activeKeys)
      return
    }

    if (expanded) {
      newActives = [
        ...newActives,
        panel.key,
      ]
    } else newActives = newActives.filter((key) => key !== panel.key)
    this.setActivePanelKey(newActives)
  }

  onSearchTextChange = (e) => {
    this.props.dispatch({
      type: 'systemSetting/updateState',
      payload: {
        filterValues: {
          actives: [
            0,
          ],
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

  render () {
    const { classes, user, systemSetting } = this.props
    const { filterValues } = systemSetting
    const { actives, searchText } = filterValues

    const { accessRights = [] } = user
    const isMultiple = searchText.length > 0
    const activeConfig = isMultiple
      ? {
          activedKeys: actives,
        }
      : { active: actives[0] }

    return (
      <CardContainer hideHeader>
        <TextField
          className={classes.searchField}
          prefix={<Search />}
          onChange={this.onSearchTextChange}
          autoFocus
          value={searchText}
        />
        <Accordion
          defaultActive={0}
          mode={isMultiple ? 'multiple' : 'default'}
          {...activeConfig}
          onChange={this.onAccordionChange}
          collapses={this.menus().filter((item) => {
            const accessRight = accessRights.find(
              (menuItem) => menuItem.name === item.authority,
            )
            const canAccess =
              accessRight === undefined
                ? true
                : accessRight.rights === 'readwrite'
            return (
              canAccess &&
              (!searchText ||
                item.items.find(
                  (m) => m.text.toLocaleLowerCase().indexOf(searchText) >= 0,
                ))
            )
          })}
        />
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(SystemSetting)
