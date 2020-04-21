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
import * as WidgetConfig from './config'
import { findGetParameter } from '@/utils/utils'


const styles = (theme) => ({
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
  paragraph: {
    marginLeft: theme.spacing(1),
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
})
@withFormikExtend({
  mapPropsToValues: ({ patientHistory }) => {
  },
})
@connect(({ patientHistory, clinicSettings, codetable, user }) => ({
  patientHistory,
  clinicSettings,
  codetable,
  user,
}))

class DispenseHistory extends Component {

  constructor (props) {
    super(props)

    this.myRef = React.createRef()

    this.widgets = WidgetConfig.widgets(props).filter((o) => {
      const accessRight = Authorized.check(o.authority)
      return accessRight && accessRight.rights !== 'hidden'
    })

    this.state = {
      selectedItems: localStorage.getItem('patientHistoryWidgets')
        ? JSON.parse(localStorage.getItem('patientHistoryWidgets'))
        : this.widgets.map((widget) => widget.id),
    }
  }

  componentWillMount () {
    const { dispatch, mode } = this.props

    dispatch({
      type: 'patientHistory/queryDispenseHistory',
      payload: {
          id:Number(findGetParameter('pid')) || 0,
      },
    })

  }

  getTitle = (row) => {
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

  getContent =(data,)=>{
    const Widget = data.component
    const {dispenseHistory} = this.props.patientHistory
    return <Widget
      current={dispenseHistory|| {}}
    />
  }

  render () {
    const {
      style,
      classes,
      override = {},
      widget,
      mode,
    } = this.props
    const cfg = {}

    if (mode === 'split') {
      cfg.style = style
    } else if (mode === 'integrated') {
      cfg.style = {}
    }
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
        >{this.widgets.map((o)=> {
          return (
            <div ref={this.myRef}>
              <Accordion
                defaultActive={0}
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
                collapses={[{
                  title:this.getTitle(o),
                  hideExpendIcon:false,
                  content: this.getContent(o),
                }]
                }
              />
            </div>
          )

        })}
        </CardContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(DispenseHistory)
