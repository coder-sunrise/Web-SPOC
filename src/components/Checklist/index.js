import React, { setState } from 'react'
import { compose } from 'redux'
import classnames from 'classnames'
import withStyles from '@material-ui/core/styles/withStyles'
import CustomInput from 'mui-pro-components/CustomInput'
import { Checkbox, FormControlLabel, Tooltip } from '@material-ui/core'
import regularFormsStyle from 'mui-pro-jss/material-dashboard-pro-react/views/regularFormsStyle'
import { control } from '@/components/Decorator'
import Authorized from '@/utils/Authorized'
import { connect } from 'dva'
import {
  GridContainer,
  GridItem,
  Button,
  CommonModal,
  Popover,
  RichEditor,
} from '@/components'
import ChecklistModal from './ChecklistModal'
import { primaryColor } from 'mui-pro-jss'
import color from 'color'

const styles = theme => ({
  item: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    cursor: 'pointer',

    '&:hover': {
      background: color(primaryColor)
        .lighten(0.9)
        .hex(),
    },
    '& > svg': {
      marginRight: theme.spacing(1),
    },
    '& > span': {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
  },
  popoverContainer: {
    width: 200,
    textAlign: 'left',
  },
  listContainer: {
    maxHeight: 300,
    overflowY: 'auto',
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
})

const ListItem = ({ classes, title, onClick }) => {
  return (
    <Tooltip title={title}>
      <div className={classes.item} onClick={onClick}>
        <span>{title}</span>
      </div>
    </Tooltip>
  )
}

class Checklist extends React.Component {
  state = {
    checklistGroups: [],
    openPopup: false,
    openModal: false,
    template: {},
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctchecklist',
      },
    })
  }

  toggleVisibleChange = () =>
    this.setState(ps => {
      return {
        openPopup: !ps.openPopup,
      }
    })

  openModal = () => {
    this.setState({
      openModal: true,
    })
  }

  setChecklist = item => {
    this.setState(ps => {
      return {
        template: this.getCurrentChecklistGroup().find(c => c.id === item),
      }
    })
  }

  updateEditor = input => {
    input = JSON.parse(JSON.stringify(input))
    // processing here
    let output = ''
    let selectSubject = []
    Object.keys(input).forEach(sub => {
      const obss = input[sub]
      if (obss) {
        let observations = []
        Object.keys(obss).forEach(obs => {
          const obsObj = obss[obs]
          if (obsObj) {
            const isShowTitle = obs.substr(0, obs.indexOf('-'))
            const title = obs.substr(obs.indexOf('-') + 1)
            let remarks
            let nature

            const nats = obss[obs]['Nature']
            if (nats) {
              if (typeof nats === 'string') {
                nature = `- ${nats}<br />`
              }
              if (typeof nats === 'object' && nats.length) {
                const panels = nats.map(n => '- ' + n).join('<br />')
                nature = `${panels}<br />`
              }
            }
            const rem = obss[obs]['Remarks']
            if (rem && rem.trim().length) {
              remarks = `${rem}<br />`
            }

            if (nature || remarks) {
              observations.push({
                isShowTitle: isShowTitle,
                title: title,
                nature: nature,
                remarks: remarks,
              })
            }
          }
        })
        if (observations.length) {
          selectSubject.push({ name: sub, selectObservation: observations })
        }
      }
    })
    selectSubject.forEach(subject => {
      if (subject.selectObservation) {
        output += `<strong>${subject.name}</strong><br /><br />`
        subject.selectObservation.forEach(observation => {
          if (observation.isShowTitle === 'true') {
            output += `${observation.title}<br />`
          }
          if (observation.nature) {
            output += observation.nature
          }
          if (observation.remarks) {
            output += observation.remarks
          }
          output += `<br />`
        })
        output += `<br />`
      }
    })
    this.props.onChecklistConfirm(output)
  }

  getCurrentChecklistGroup = () => {
    const { ctchecklist } = this.props.codetable

    return (ctchecklist || []).filter(
      g => g.checklistCategoryFK === this.props.checklistCategory,
    )
  }

  render() {
    const {
      classes,

      onChecklistConfirm,
      buttonStyle,
      buttonProps,
    } = this.props

    return (
      <React.Fragment>
        <Popover
          icon={null}
          trigger='click'
          placement='bottom'
          visible={this.state.openPopup}
          onVisibleChange={this.toggleVisibleChange}
          content={
            <div className={classes.popoverContainer}>
              <div className={classes.listContainer}>
                {this.getCurrentChecklistGroup().map((item, i) => {
                  return (
                    <ListItem
                      key={`checklist-${item.id}`}
                      title={item.displayValue}
                      classes={classes}
                      onClick={e => {
                        this.setChecklist(item.id)
                        this.toggleVisibleChange()
                        this.openModal()
                      }}
                      {...item}
                    />
                  )
                })}
              </div>
            </div>
          }
        >
          <Button style={buttonStyle} size='sm' color='info' {...buttonProps}>
            Checklist
          </Button>
        </Popover>
        <ChecklistModal
          open={this.state.openModal}
          title='Checklist'
          showFooter
          onClose={o => {
            this.setState({
              openModal: false,
            })
          }}
          onConfirm={o => {
            this.setState({
              openModal: false,
            })
            this.updateEditor(o)
          }}
          selectedChecklist={this.state.template}
          {...this.props}
        />
      </React.Fragment>
    )
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ codetable }) => ({
    codetable,
  })),
)(Checklist)
