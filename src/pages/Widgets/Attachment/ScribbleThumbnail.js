import React from 'react'
import classnames from 'classnames'
// material ui
import { MenuList, MenuItem, withStyles } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Return from '@material-ui/icons/KeyboardReturn'
// common components
import { Button, GridContainer, GridItem, Popper, Tooltip } from '@/components'
import MoreButton from './ScribbleMoreButton'
import dummyThumbnail from '@/assets/thumbnail-icons/dummy-thumbnail-icon.png'

const styles = (theme) => ({
  root: {
    display: 'inline-block',
    textAlign: 'left',
    width: 140,
    margin: 8,
  },
  imageBorder: {
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  imageSpacing: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& img': {
      maxWidth: '100%',
      maxHeight: '100%',
      cursor: 'pointer',
    },
  },
  buttonGroup: {
    textAlign: 'center',
    '& > button:last-child': {
      marginRight: '0px !important',
    },
  },
})

const ScribbleThumbnail = ({
  classes,
  dispatch,
  attachment,
  onClick,
  onInsertClick,
  size = { width: 64, height: 64 },
}) => {
  const thumbnailClass = classnames({
    [classes.root]: true,
    [classes.imageBorder]: true,
    [classes.imageSpacing]: true,
  })

  const { subject } = attachment

  const handleClick = async () => {
    const response = await dispatch({
      type: 'scriblenotes/query',
      payload: {
        id: attachment.id,
      },
    })
    onClick({
      ...response,
    })
  }

  return (
    <div className={thumbnailClass}>
      <GridContainer>
        <GridItem md={12}>
          <span style={{ fontSize: '0.75rem' }}>Scribble Note</span>
        </GridItem>

        <GridItem md={12} style={{ cursor: 'pointer' }}>
          <div className={classes.imageContainer} onClick={handleClick}>
            <img
              src={dummyThumbnail}
              alt={subject}
              width={size.width}
              height={size.height}
            />
          </div>
        </GridItem>
        <GridItem md={12}>
          <Tooltip title={subject}>
            <span style={{ fontSize: '0.75rem' }}>{subject}</span>
          </Tooltip>
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default withStyles(styles)(ScribbleThumbnail)
