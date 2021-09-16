import React, { setState } from 'react'
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

@connect(({ settingChecklist }) => ({
  settingChecklist,
}))
class Checklist extends React.Component {
  state = {
    checklistGroups: [],
    openPopup: false,
    openModal: false,
    template: {},
  }

  componentDidMount() {
    this.props
      .dispatch({
        type: 'settingChecklist/query',
      })
      .then(r => {
        if (r.data) {
          this.setState({
            checklistGroups: r.data.filter(
              g => g.checklistCategoryFK === this.props.checklistCategory,
            ),
          })
        }
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
        template: ps.checklistGroups.find(c => c.id === item),
      }
    })
  }

  updateEditor = input => {
    input = JSON.parse(JSON.stringify(input))
    // console.log('updateEditor', input)
    // processing here
    let output = ''
    Object.keys(input).forEach(sub => {
      // console.log('sub', sub)
      const obss = input[sub]
      if (obss) {
        output += `<strong>${sub}</strong><br /><br />`
        Object.keys(obss).forEach(obs => {
          // console.log('obs', obs)
          if (obs !== 'Remarks') {
            const nats = obss[obs]
            if (nats) {
              // console.log('nat', nats)
              output += `${obs}<br />`
              if (typeof nats === 'string') {
                output += ` - ${nats}<br />`
              }
              if (typeof nats === 'object') {
                const panels = nats.map(n => ' - ' + n).join('<br />')
                output += `${panels}<br />`
              }
            }
            const rem = obss['Remarks'][obs] // see checklistmodal
            // console.log('rem', rem)
            if (rem) output += `<br />${rem}<br />`

            output += `<br />`
          }
        })
      }
      output += `<br />`
    })
    // console.log('output', output)
    this.insertIntoEditor(output)
  }

  insertIntoEditor = formatted => {
    const { editorRef } = this.props
    const { editorState } = editorRef.props
    editorRef.update(RichEditor.insertHtml(editorState, formatted))
  }

  render() {
    const { classes, settingChecklist, editorRef } = this.props
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
                {this.state.checklistGroups.map((item, i) => {
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
          <Button color='info'>Checklist</Button>
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

export default withStyles(styles, { withTheme: true })(Checklist)
