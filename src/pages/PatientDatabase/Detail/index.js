import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import PerfectScrollbar from 'perfect-scrollbar'
import Link from 'umi/link'
import { withStyles, MenuItem, MenuList, Divider } from '@material-ui/core'
import {
  PictureUpload,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
  Transition,
} from '@/components'
import avatar from '@/assets/img/faces/marc.jpg'
import { getAppendUrl } from '@/utils/utils'

import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'

let ps

const styles = (theme) => ({
  hide: {
    display: 'none',
  },
})

@connect(({ patient, global }) => ({
  patient,
  global,
}))
class PatientDetail extends PureComponent {
  state = {
    selectedIndex: null,
    showCollectPayment: false,
    columns: [
      { name: 'Id', title: 'id' },
      { name: 'PatientRefNo', title: 'Patient Ref No.' },
      { name: 'PatientName', title: 'Patient Name' },
      { name: 'CardType', title: '' },
      { name: 'FinNumber', title: 'Account' },
      { name: 'copay', title: 'Co-Pay' },
      { name: 'amount', title: 'Amount' },
      { name: 'outstandingBalance', title: 'O/S Balance' },
      { name: 'payAmount', title: 'Pay Amount', nonEditable: false },
      { name: 'balance', title: 'Balance' },
    ],
  }

  constructor (props) {
    super(props)
    this.widgets = [
      {
        id: '1',
        name: 'Demographic',
        component: Loadable({
          loader: () => import('./Demographics'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...props} />
          },
          loading: Loading,
        }),
      },
      {
        id: '2',
        name: 'Emergency Contact',
        component: Loadable({
          loader: () => import('./EmergencyContact'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...props} />
          },
          loading: Loading,
        }),
      },
      {
        id: '3',
        name: 'Allergies',
        component: Loadable({
          loader: () => import('./Allergies'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...props} />
          },
          loading: Loading,
        }),
      },
      {
        id: '4',
        name: 'Schemes',
        component: Loadable({
          loader: () => import('./Schemes'),
          render: (loaded, p) => {
            let Cmpnet = loaded.default
            return <Cmpnet {...props} />
          },
          loading: Loading,
        }),
      },
    ]
  }

  componentDidMount () {
    // if (navigator.platform.indexOf('Win') > -1 && this.refs.sidebarWrapper) {
    //   ps = new PerfectScrollbar(this.refs.sidebarWrapper, {
    //     suppressScrollX: true,
    //     suppressScrollY: false,
    //   })
    // }
    if (this.props.patient.currentId) {
      this.props.dispatch({
        type: 'patient/query',
        payload: {
          id: this.props.patient.currentId,
        },
      })
    }

    // dispatch({
    //   type: 'updateState',
    //   payload: {
    //     currentComponent: query.cmt,
    //     currentId: query.pid,
    //   },
    // })
  }

  componentWillUnmount () {
    if (navigator.platform.indexOf('Win') > -1 && ps) {
      ps.destroy()
    }
  }

  filterList = (item) => {
    const { columns } = this.state
    const cols = columns.map((col) => col.name)
    const list = Object.keys(item).reduce((filtered, key) => {
      return cols.includes(key)
        ? { ...filtered, [key]: item[key] }
        : { ...filtered }
    }, {})
    return list
  }

  handleListItemClick = (e, i) => {
    this.setState({ selectedIndex: i })
  }

  render () {
    const {
      theme,
      classes,
      height,
      linkProps = {},
      onMenuClick = (p) => p,
      ...resetProps
    } = this.props
    // console.log(this.props)

    const { patient, global, history } = resetProps
    if (!patient) return null
    const { currentComponent, currentId } = patient

    const { selectedIndex } = this.state
    const currentMenu =
      this.widgets.find((o) => o.id === currentComponent) || {}
    const CurrentComponent = currentMenu.component

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={2} style={{ paddingTop: 20 }}>
          <Card profile>
            {currentId ? (
              <CardAvatar profile>
                <a href='#pablo' onClick={(e) => e.preventDefault()}>
                  <img src={avatar} alt='...' />
                </a>
              </CardAvatar>
            ) : (
              <PictureUpload style={{ marginTop: '-50px' }} />
            )}
            <CardBody profile>
              {currentId && (
                <React.Fragment>
                  <h6 className={classes.cardCategory}>G1234567X</h6>
                  <h4 className={classes.cardTitle}>Alec Thompson</h4>
                  <h6>{moment().format('DD-MMM-YYYY')}</h6>
                </React.Fragment>
              )}

              <Divider light />
              <div
                ref='sidebarWrapper'
                style={{
                  maxHeight: 'calc(100vh - 329px)',
                  position: 'relative',
                }}
              >
                <MenuList>
                  {this.widgets.map((o) => (
                    <Link
                      key={o.name}
                      to={getAppendUrl({
                        md: 'pt',
                        cmt: o.id,
                      })}
                      {...linkProps}
                    >
                      <MenuItem
                        key={o.name}
                        className={classes.menuItem}
                        selected={currentMenu.name === o.name}
                        onClick={(e) => {
                          onMenuClick(e, o)
                        }}
                      >
                        {o.name}
                      </MenuItem>
                    </Link>
                  ))}
                </MenuList>
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={10}>
          <div
            style={
              height > 0 ? (
                { height: height - 20, overflow: 'auto', padding: '0 2px' }
              ) : (
                { padding: '0 2px' }
              )
            }
          >
            <CurrentComponent />
            {/* {menus.map((o) => {
              const Compont = o.component
              const show = currentComponent === o.url.cmt
              return (
                <Transition
                  key={o.url.cmt}
                  className={show ? '' : classes.hide}
                  show={show}
                  timeout={{
                    enter: 200,
                    exit: 0,
                  }}
                  history={history}
                >
                  <Compont {...resetProps} />
                </Transition>
              )
            })} */}
          </div>
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientDetail)
