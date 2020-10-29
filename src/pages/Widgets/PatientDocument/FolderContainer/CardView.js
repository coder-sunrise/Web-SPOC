import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
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
    width: 300,
    margin: 5,
    height: 330,
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

const CardZoom = [
  {
    zoom: 5,
    width: 800,
    height: 750,
  },
  {
    zoom: 4,
    width: 650,
    height: 750,
  },
  {
    zoom: 3,
    width: 400,
    height: 400,
  },
  {
    zoom: 2,
    width: 330,
    height: 390,
  },
  {
    zoom: 1,
    width: 260,
    height: 300,
  },
]

class CardView extends Component {
  downloadFile = (row) => {
    downloadAttachment(row)
  }

  render () {
    const {
      classes,
      attachmentList = {},
      selectedFolderFK,
      zoom = 4,
    } = this.props
    const zoomStyle = CardZoom.find((c) => c.zoom === zoom)

    return (
      <div className={classes.root}>
        {attachmentList
          .filter(
            (f) =>
              f.folderFKs.includes(selectedFolderFK) ||
              selectedFolderFK === -99,
          )
          .map((p) => {
            return (
              <Card
                style={{
                  width: zoomStyle.width,
                  height: zoomStyle.height,
                  margin: 5,
                }}
              >
                <CardContent>
                  <CardItem
                    key={p.id}
                    file={p}
                    {...this.props}
                    {...zoomStyle}
                  />
                </CardContent>
              </Card>
            )
          })}
      </div>
    )
  }
}
export default withStyles(styles)(CardView)
