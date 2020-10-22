import React, { Component } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'

import { CardContainer } from '@/components'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import { downloadAttachment } from '@/services/file'
import CardItem from './CardItem'

const styles = () => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  card: {
    width: 250,
    margin: 5,
    height: 200,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  cls1: {
    textAlign: 'center',
  },
  btn: {
    textAlign: 'center',
    display: 'inherit',
  },
  status: {
    fontSize: 20,
    minWidth: 49,
    padding: 8,
    '& > span': {
      right: '46%',
      bottom: -24,
      height: 14,
      width: 14,
    },
  },
})

class CardView extends Component {
  downloadFile = (row) => {
    downloadAttachment(row)
  }

  render () {
    const { classes, attachmentList = {}, selectedFolderFK } = this.props

    return (
      <CardContainer hideHeader>
        <div className={classes.root}>
          {attachmentList
            .filter(
              (f) =>
                f.folderFKs.includes(selectedFolderFK) ||
                selectedFolderFK === -99,
            )
            .map((p) => {
              return (
                <Card className={classes.card}>
                  <CardContent>
                    <CardItem key={p.id} file={p} {...this.props} />
                  </CardContent>
                </Card>
              )
            })}
        </div>
      </CardContainer>
    )
  }
}
export default withStyles(styles)(CardView)
