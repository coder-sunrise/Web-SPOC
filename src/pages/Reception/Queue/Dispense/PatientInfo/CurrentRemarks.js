import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// umi locale
import { formatMessage, FormattedMessage } from 'umi/locale'
// formik
import { FastField } from 'formik'
// material ui
import {
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  withStyles,
  Tooltip,
  Paper,
} from '@material-ui/core'
import {
  AddPhotoAlternateOutlined,
  RemoveCircleOutline,
} from '@material-ui/icons'
// custom components
import {
  Button,
  GridContainer,
  GridItem,
  OutlinedTextField,
} from '@/components'
// assets
import { tooltip } from 'assets/jss'

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    color: 'white',
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,0.6) 100%)',
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  noImage: {
    width: '100%',
    padding: '10px',
    margin: '10px 5px',
  },
  noImageText: {
    width: '85vh',
  },
  attachButton: { margin: '10px 0px' },
  removeImgButton: {
    color: 'white',
    '&:hover': {
      color: 'red !important',
    },
  },
  buttonsBar: {
    margin: '10px 0px',
  },
  spacing: {
    margin: '10px',
    padding: '10px',
  },
  readOnly: {
    display: 'none',
  },
  tooltip,
})

class CurrentRemarks extends PureComponent {
  state = {
    imgList: [],
  }

  static defaultProps = {
    readOnly: false,
  }

  static propTypes = {
    readOnly: PropTypes.bool,
    handleCancel: PropTypes.func,
  }

  saveFile = (filename, result) => {
    const { imgList } = this.state

    this.setState({
      imgList: [
        ...imgList,
        {
          id: `${filename}-${imgList.length}`,
          img: result,
          title: filename,
        },
      ],
    })
  }

  updateFileUploadProgress = (filename, progress) => {
    // TODO: enhance file upload progress
  }

  handleUpload = (e) => {
    e.preventDefault()
    const { imgList } = this.state
    const readFile = (file) => {
      let reader = new FileReader()
      let filename = file.name
      reader.onload = () => {
        this.saveFile(filename, reader.result)
      }
      // TODO: enhance file upload progress
      // reader.onprogress = (progressEvent) => {}
      reader.readAsDataURL(file)
    }
    for (let i = 0; i < e.target.files.length; i++) {
      let file = e.target.files[i]
      readFile(file)
    }
  }

  resetValue = (event) => {
    event.target.value = null
  }

  handleRemove = (id) => (event) => {
    const { imgList } = this.state
    this.setState({
      imgList: [
        ...imgList.filter((item) => item.id !== id),
      ],
    })
  }

  handleAttachmentClick = () => {
    this.refs.fileInput.click()
  }

  render () {
    const { imgList } = this.state
    const { readOnly, classes, handleCancel } = this.props
    return (
      <React.Fragment>
        <Paper className={classes.spacing}>
          <GridContainer direction='column' alignItems='stretch'>
            <GridItem xs md={12}>
              <FastField
                name='VisitRemarks'
                render={(args) => (
                  <OutlinedTextField
                    {...args}
                    rowsMax={6}
                    rows={4}
                    multiline
                    label={formatMessage({
                      id: 'reception.common.remarks',
                    })}
                  />
                )}
              />
            </GridItem>

            <GridItem xs md={3}>
              <div
                className={`fileinput text-center ${readOnly
                  ? 'readOnly'
                  : ''}`}
              >
                <input
                  type='file'
                  multiple
                  accept='image/x-png,image/jpeg'
                  onInput={this.handleUpload}
                  onClick={this.resetValue}
                  ref='fileInput'
                />
                {!readOnly && (
                  <Button
                    className={classes.attachButton}
                    color='rose'
                    onClick={this.handleAttachmentClick}
                  >
                    <AddPhotoAlternateOutlined />
                    <FormattedMessage id='reception.queue.dispense.visitRemarks.attachImages' />
                  </Button>
                )}
              </div>
            </GridItem>

            <GridItem xs md={12}>
              <div className={classes.root}>
                {imgList.length === 0 && (
                  <Paper className={classes.noImage}>
                    <h4 className={classes.noImageText}>
                      <FormattedMessage id='reception.queue.dispense.visitRemarks.noImages' />
                    </h4>
                  </Paper>
                )}
                <GridList className={classes.gridList} cols={2.5}>
                  {imgList.map((item) => (
                    <GridListTile key={item.id}>
                      <img src={item.img} alt={item.title} />
                      <GridListTileBar
                        title={item.title}
                        actionIcon={
                          <Tooltip
                            title='Remove image'
                            placement='bottom-end'
                            classes={{ tooltip: classes.tooltip }}
                          >
                            <IconButton
                              className={classes.removeImgButton}
                              onClick={this.handleRemove(item.id)}
                            >
                              <RemoveCircleOutline />
                            </IconButton>
                          </Tooltip>
                        }
                        classes={{
                          root: classes.titleBar,
                          title: classes.title,
                        }}
                      />
                    </GridListTile>
                  ))}
                </GridList>
              </div>
            </GridItem>
            <GridItem xs md={12} />
          </GridContainer>
        </Paper>
        {!readOnly && (
          <div className={classes.buttonsBar}>
            <Button color='success'>
              <FormattedMessage id='reception.common.save' />
            </Button>
            <Button color='danger' onClick={handleCancel}>
              <FormattedMessage id='reception.common.cancel' />
            </Button>
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(CurrentRemarks)
