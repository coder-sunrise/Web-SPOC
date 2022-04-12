import React, { Component } from 'react'
import $ from 'jquery'
import { connect } from 'dva'
import classnames from 'classnames'
import { withStyles } from '@material-ui/core'
import {
  GridContainer,
  GridItem,
  CardContainer,
  Accordion,
  withFormikExtend,
} from '@/components'
import Authorized from '@/utils/Authorized'

// utils
import { findGetParameter } from '@/utils/utils'
import * as WidgetConfig from './config'

const styles = theme => ({
  root: {},
  hide: {
    display: 'none',
  },
  title: {
    fontSize: '1em',
  },
  note: {
    fontSize: '0.85em',
    fontWeight: 400,
    lineHeight: '10px',
  },
  listRoot: {
    width: '100%',
  },
  listItemRoot: {
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: '0.85em',
  },
  listItemDate: {
    position: 'absolute',
    right: '21%',
  },
  leftPanel: {
    position: 'sticky',
    width: 400,
    top: 0,
    float: 'left',
    marginRight: theme.spacing(1),
    marginTop: 0,
  },
  rightPanel: {
    marginTop: 0,

    '& h5': {
      textDecoration: 'underline',
      marginTop: theme.spacing(2),
      fontSize: '1em',
    },
  },
  integratedLeftPanel: {
    width: '100%',
  },
  wrapCellTextStyle: {
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  numberstyle: {
    color: 'darkBlue',
    fontWeight: 500,
  },
  negativeNumberstyle: {
    color: 'red',
    fontWeight: 500,
  },
  rightIcon: {
    position: 'relative',
    fontWeight: 600,
    color: 'white',
    fontSize: '0.7rem',
    padding: '2px 3px',
    height: 20,
    cursor: 'pointer',
    margin: '0px 1px',
  },
})
@withFormikExtend({
  mapPropsToValues: ({ patientHistory }) => {},
})
@connect(({ patientHistory, clinicSettings, codetable, user, global }) => ({
  patientHistory,
  clinicSettings,
  codetable,
  user,
  mainDivHeight: global.mainDivHeight,
}))
class DispenseHistory extends Component {
  constructor(props) {
    super(props)

    this.myRef = React.createRef()

    this.widgets = WidgetConfig.widgets(props).filter(o => {
      if (o.authority === undefined) return true
      const accessRight = Authorized.check(o.authority)
      return accessRight && accessRight.rights !== 'hidden'
    })

    this.state = {
      selectedItems: localStorage.getItem('patientHistoryWidgets')
        ? JSON.parse(localStorage.getItem('patientHistoryWidgets'))
        : this.widgets.map(widget => widget.id),
    }
  }

  componentWillMount() {
    const { dispatch, mode } = this.props

    dispatch({
      type: 'patientHistory/queryDispenseHistory',
      payload: {
        id: Number(findGetParameter('pid')) || 0,
      },
    })
  }

  getTitle = row => {
    const { name = '' } = row

    return (
      <div className={this.props.classes.title}>
        <GridContainer>
          <GridItem sm={12}>
            <p>
              <span>{name}</span>
            </p>
          </GridItem>
        </GridContainer>
      </div>
    )
  }

  getContent = data => {
    const Widget = data.component
    const { dispenseHistory } = this.props.patientHistory
    return <Widget current={dispenseHistory || {}} />
  }

  render() {
    const {
      style,
      classes,
      override = {},
      widget,
      mode,
      mainDivHeight = 700,
    } = this.props
    const cfg = {}

    if (mode === 'split') {
      cfg.style = style
    } else if (mode === 'integrated') {
      cfg.style = {}
    }

    let height = mainDivHeight - 240
    if (height < 300) height = 300
    return (
      <div {...cfg}>
        <CardContainer
          hideHeader
          size='sm'
          className={classnames({
            [classes.leftPanel]: !widget,
            [classes.integratedLeftPanel]: mode === 'integrated',
            [override.leftPanel]: !widget,
          })}
        >
          <div
            style={{
              overflow: 'auto',
              height,
            }}
          >
            {this.widgets.map(o => {
              return (
                <div ref={this.myRef}>
                  <Accordion
                    mode='multiple'
                    defaultActive={[0]}
                    onChange={(event, p, expanded) => {
                      if (expanded) {
                        setTimeout(() => {
                          $(this.myRef.current)
                            .find('div[aria-expanded=true]')
                            .next()
                            .find('div[role="button"]:eq(0)')
                            .trigger('click')
                        }, 1)
                      }
                    }}
                    collapses={[
                      {
                        title: this.getTitle(o),
                        hideExpendIcon: false,
                        content: this.getContent(o),
                      },
                    ]}
                  />
                </div>
              )
            })}
          </div>
        </CardContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(DispenseHistory)
