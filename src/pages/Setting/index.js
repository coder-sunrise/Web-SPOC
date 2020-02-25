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

const menuData = [
  {
    authority: 'settings.mastersetting',
    title: 'Master Setting',
    text: 'Clinic Information',
    url: '/setting/clinicinfo',
  },
  {
    authority: 'settings.mastersetting',
    title: 'Master Setting',
    text: 'GST Setup',
    url: '/setting/gstsetup',
  },
  {
    authority: 'settings.mastersetting',
    title: 'Master Setting',
    text: 'General Setting',
    url: '/setting/generalsetting',
  },
  {
    title: 'Clinic Setting',
    text: 'Service',
    url: '/setting/service',
  },
  {
    title: 'Clinic Setting',
    text: 'Service Center',
    // icon: <Business />,
    url: '/setting/servicecenter',
  },
  {
    title: 'Clinic Setting',
    text: 'Service Center Category',
    // icon: <FolderOpen />,
    url: '/setting/servicecentercategory',
  },
  {
    title: 'Clinic Setting',
    text: 'Service Category',
    // icon: <FolderOpen />,
    url: '/setting/servicecategory',
  },
  {
    title: 'Clinic Setting',
    text: 'Revenue Category',
    // icon: <FolderOpen />,
    url: '/setting/revenuecategory',
  },
  {
    title: 'Clinic Setting',
    text: 'Room',
    url: '/setting/room',
  },
  {
    title: 'Clinic Setting',
    text: 'Clinic Operation Hour',
    url: '/setting/clinicoperationhour',
  },
  {
    title: 'Clinic Setting',
    text: 'Clinic Break Hour',
    url: '/setting/clinicbreakhour',
  },
  {
    title: 'Clinic Setting',
    text: 'Public Holiday',
    url: '/setting/publicholiday',
  },
  {
    title: 'Clinic Setting',
    text: 'Doctor Block',
    url: '/setting/doctorblock',
  },
  // {
  //   title: 'Clinic Setting',
  //   text: 'Participant Role',
  //   url: '/setting/participantrole',
  // },
  {
    title: 'Clinic Setting',
    text: 'Room Block',
    url: '/setting/roomblock',
  },
  {
    title: 'Clinic Setting',
    text: 'Medication UOM',
    url: '/setting/medicationuom',
  },
  {
    title: 'Clinic Setting',
    text: 'Consumable UOM',
    url: '/setting/consumableuom',
  },
  {
    title: 'Clinic Setting',
    text: 'Medication Group',
    url: '/setting/medicationgroup',
  },
  {
    title: 'Clinic Setting',
    text: 'Consumable Category',
    url: '/setting/consumablegroup',
  },
  {
    title: 'Clinic Setting',
    text: 'Medication Dosage',
    url: '/setting/medicationdosage',
  },
  {
    title: 'Clinic Setting',
    text: 'Medication Precaution',
    url: '/setting/medicationprecautions',
  },
  {
    title: 'Clinic Setting',
    text: 'Medication Frequency',
    url: '/setting/medicationfrequency',
  },
  {
    title: 'Clinic Setting',
    text: 'Medication Consumption Method',
    longText: true,
    url: '/setting/medicationconsumptionmethod',
  },
  {
    title: 'Clinic Setting',
    text: 'Payment Mode',
    url: '/setting/paymentmode',
  },
  {
    title: 'Clinic Setting',
    text: 'Appointment Type',
    url: '/setting/appointmenttype',
  },
  {
    title: 'Clinic Setting',
    text: 'Treatment',
    // icon: <FolderOpen />,
    url: '/setting/treatment',
  },
  {
    title: 'Clinic Setting',
    text: 'Treatment Category',
    // icon: <FolderOpen />,
    url: '/setting/treatmentcategory',
  },
  {
    title: 'System User',
    text: 'System User',
    url: '/setting/userprofile',
  },
  {
    title: 'System User',
    text: 'Role',
    url: '/setting/userrole',
  },
  {
    title: 'Print Setup',
    text: 'Printout Setting',
    url: '/setting/printoutsetting',
  },
  {
    title: 'Templates',
    text: 'SMS Template',
    url: '/setting/smstemplate',
  },
  {
    title: 'Templates',
    text: 'Document Template',
    url: '/setting/documenttemplate',
  },
  // {
  //   title: 'Contact',
  //   text: 'Co-Payer',
  //   url: '/setting/company/1',
  // },
  {
    title: 'Contact',
    text: 'Supplier',
    url: '/setting/company/2',
  },
  {
    title: 'Contact',
    text: 'Referral Source',
    url: '/setting/referralsource',
  },
]
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
