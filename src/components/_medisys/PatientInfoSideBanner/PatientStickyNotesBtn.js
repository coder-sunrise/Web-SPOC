import React, { Component, useState } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import {
  Button,
  Popper,
  Checkbox,
  SizeContainer,
  GridContainer,
  GridItem,
  TextField,
  CommonModal,
  Tooltip,
  OutlinedTextField,
} from '@/components'
import { Badge, Avatar } from 'antd'
import { grayColors } from '@/assets/jss'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import FlagIcon from '@material-ui/icons/Flag'
import PaletteIcon from '@material-ui/icons/Palette'
import Close from '@material-ui/icons/Close'
import Delete from '@material-ui/icons/Delete'
import ErrorIcon from '@material-ui/icons/Error'
import Authorized from '@/utils/Authorized'
import { withStyles } from '@material-ui/core'
import { Link } from 'umi'
import { MailOutlined } from '@ant-design/icons'

const NOTESCOLOR = {
  Green: '#CCFF90',
  Cyan: '#A7FFEB',
  Blue: '#80D8FF',
  LightPurple: '#CC99FF',
  White: '#FFFFFF',
  Red: '#FF8A80',
  YellowOrange: '#FFD180',
  Yellow: '#FFFF8D',
}

const styles = theme => ({
  notesTextStyle: {
    '& > Div > Div': {
      fontSize: '14px !important',
      padding: '5px !important',
      '& textarea:first-child': {
        top: 'unset !important',
        position: 'unset !important',
        marginBottom: 'unset !important',
        minHeight: 48,
      },
    },
  },
  noteItemStyle: {
    '& .delNoteBtnClass': {
      display: 'none',
    },
    '&:hover': {
      '& .delNoteBtnClass': {
        display: 'inline-flex',
      },
    },
  },
  checkBoxStyle: {
    '& > div > div > label > span:last-child': {
      fontSize: '14px',
    },
  },
  iconFontStyle: {
    fontSize: '0.7rem !important',
    fontWeight: 500,
  },
})

class PatientStickyNotesBtn extends Component {
  state = {
    openPopper: false,
    stickyNotes: [],
    isFlaggedOnlyShow: true,
    flaggedNoteCount: 0,
  }

  componentWillMount = () => {
    this.getLatest()
  }

  getLatest = () => {
    const stickyNotesViewable =
      this.patientStickyNotesAccessRight &&
      this.patientStickyNotesAccessRight.rights !== 'hidden'
    if (!stickyNotesViewable) return

    const { patient, dispatch, patientProfileFK } = this.props
    dispatch({
      type: 'patient/getStickyNotes',
      payload: {
        patientProfileFK: patientProfileFK,
      },
    }).then(result => {
      this.setState({
        stickyNotes: result || [],
        flaggedNoteCount: (result || []).filter(x => x.id && x.isFlagged)
          .length,
      })
    })
  }

  toggleStickNotes = () => {
    const {
      openPopper,
      stickyNotes,
      editedItem: { editedNote } = {},
      currentEditedNoteBackup,
    } = this.state
    const isOpen = !openPopper
    let newState = { openPopper: isOpen }
    if (!isOpen) {
      newState = {
        ...newState,
        currentDeletingNote: undefined,
        openDeleteItemConfirm: false,
      }
      if (editedNote && !editedNote.id) {
        newState = { ...newState, stickyNotes: stickyNotes.slice(1) }
      } else if (editedNote?.id) {
        editedNote.notes = currentEditedNoteBackup.notes
        editedNote.isFlagged = currentEditedNoteBackup.isFlagged
        editedNote.color = currentEditedNoteBackup.color
      }
      newState = {
        ...newState,
        editedItem: { editedNote: undefined, index: undefined },
      }
    }
    this.setState(newState)
  }

  stickyNotesBtnClick = () => {
    const { openPopper } = this.state
    if (!openPopper) this.getLatest()
    this.toggleStickNotes()
  }

  editMode = (note, idx) => {
    const { index, editedNote } = this.state.editedItem || {}
    if (index !== undefined && idx !== undefined) return
    if (index != idx || idx === undefined) {
      this.setState({
        editedItem: { index: idx, editedNote: note },
        currentEditedNoteBackup: note
          ? JSON.parse(JSON.stringify(note))
          : undefined,
      })
    }
  }

  saveStickyNotes = (note, callback) => {
    const { patient, dispatch, patientProfileFK } = this.props
    dispatch({
      type: 'patient/saveStickyNotes',
      payload: { ...note },
    }).then(result => {
      dispatch({
        type: 'patient/getStickyNotes',
        payload: { patientProfileFK: patientProfileFK },
      }).then(notes => {
        this.setState({
          stickyNotes: notes,
          flaggedNoteCount: (notes || []).filter(x => x.id && x.isFlagged)
            .length,
        })
        callback?.call(this)
      })
    })
  }

  onFlagClick = note => {
    const { index, editedNote } = this.state.editedItem || {}
    if (!editedNote)
      this.saveStickyNotes({ ...note, isFlagged: !note.isFlagged })
    else if (editedNote.id === note.id) {
      note.isFlagged = !note.isFlagged
      this.setState({
        editedItem: {
          index,
          editedNote: note,
        },
      })
    }
  }

  onColorClick = (note, color) => {
    const { patient, dispatch } = this.props
    const { index, editedNote } = this.state.editedItem
    note.color = color
    this.setState({
      editedItem: { index, editedNote: note },
    })
  }

  onCancelClick = e => {
    e?.preventDefault()
    const {
      editedItem: { editedNote },
      stickyNotes,
      currentEditedNoteBackup,
    } = this.state
    if (editedNote && !editedNote.id)
      this.setState({ stickyNotes: stickyNotes.slice(1) })
    else {
      editedNote.notes = currentEditedNoteBackup.notes
      editedNote.isFlagged = currentEditedNoteBackup.isFlagged
      editedNote.color = currentEditedNoteBackup.color
    }
    this.editMode()
  }

  onSaveClick = e => {
    e.preventDefault()
    const { editedNote } = this.state.editedItem
    const notes = editedNote.notes
    if (notes.trim().length == 0) return
    this.saveStickyNotes(editedNote, () => {
      this.editMode()
    })
  }

  onDeleteNoteClick = note => {
    const { editedNote } = this.state.editedItem || {}
    if (!editedNote)
      this.setState({ currentDeletingNote: note, openDeleteItemConfirm: true })
  }

  confirmDeleteClick = () => {
    const { currentDeletingNote } = this.state
    this.saveStickyNotes({ ...currentDeletingNote, isDeleted: true }, () => {
      this.setState({
        currentDeletingNote: undefined,
        openDeleteItemConfirm: false,
      })
    })
  }

  cancelDeleteClick = () => {
    this.setState({
      currentDeletingNote: undefined,
      openDeleteItemConfirm: false,
    })
  }

  renderStickyNotesItem = (note, idx, stickyNotesEditable) => {
    const { index, editedNote } = this.state.editedItem || {}
    const { openDeleteItemConfirm, currentDeletingNote } = this.state
    const isEditMode = index === idx
    const textContentColor = note.isFlagged ? 'black' : '#666666'
    const currentEditedNoteColor = isEditMode
      ? editedNote.color
      : note.color || '#FFFFFF'

    const isOpenDeleteItemConfirm =
      openDeleteItemConfirm && currentDeletingNote?.id === note.id

    const { id: currentUserID } = this.props.currentUser
    const isBelongtoCurrentUser =
      !note.createByUserFK || note.createByUserFK === currentUserID

    return (
      <div
        className={this.props.classes.noteItemStyle}
        style={{
          backgroundColor: isEditMode ? '#FFFFFF' : currentEditedNoteColor,
          minHeight: 60,
          border: `1px solid ${
            isEditMode || note.color === '#FFFFFF' ? grayColors[5] : note.color
          }`,
          borderRadius: 5,
          marginBottom: 10,
        }}
        onDoubleClick={() => {
          if (!stickyNotesEditable || !isBelongtoCurrentUser) return
          this.editMode(note, idx)
        }}
      >
        <GridContainer>
          <GridItem style={{ paddingRight: 0, width: '544px' }}>
            <div style={{ paddingTop: 3, minHeight: 33 }}>
              {isEditMode ? (
                <OutlinedTextField
                  autoFocus
                  minRows={3}
                  multiline
                  defaultValue={note.notes}
                  onChange={e => {
                    note.notes = e.target.value
                  }}
                  maxLength={2000}
                  label=''
                  className={this.props.classes.notesTextStyle}
                  style={{
                    fontSize: 14,
                    color: textContentColor,
                    backgroundColor: isEditMode
                      ? currentEditedNoteColor
                      : 'transparent',
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: 14,
                    wordBreak: 'break-all',
                    whiteSpace: 'pre-wrap',
                    color: textContentColor,
                    margin: 0,
                  }}
                >
                  {note.notes}
                </div>
              )}
            </div>
          </GridItem>
          <GridItem width='auto' style={{ paddingRight: 0 }}>
            <div style={{ float: 'right' }}>
              <div>
                <Button
                  justIcon
                  color='transparent'
                  onClick={() => {
                    this.onFlagClick(note)
                  }}
                  style={{
                    margin: 0,
                    color: note.isFlagged ? 'red' : 'gray',
                  }}
                  disabled={!stickyNotesEditable}
                >
                  {note.archivedDate ? (
                    <Tooltip
                      placement='right-start'
                      title={
                        note.archivedDate && (
                          <div style={{ fontSize: 12 }}>
                            {`Archived by ${note.archivedByUser} (${
                              note.archivedByUserRole
                            }) ${moment(note.archivedDate).format(
                              'DD MMM YYYY HH:mm',
                            )}`}
                          </div>
                        )
                      }
                    >
                      <FlagIcon />
                    </Tooltip>
                  ) : (
                    <FlagIcon />
                  )}
                </Button>
              </div>
              {isEditMode && (
                <div>
                  <Popper
                    placement='right-end'
                    overlay={
                      <div
                        style={{ paddingTop: 6, paddingLeft: 6, width: 126 }}
                      >
                        {Object.values(NOTESCOLOR).map(x => (
                          <span
                            style={{
                              display: 'inline-block',
                              cursor: 'pointer',
                              marginRight: 6,
                              height: 24,
                              width: 24,
                              backgroundColor: x,
                              border: '1px solid gray',
                              boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.1)',
                            }}
                            onClick={() => this.onColorClick(note, x)}
                          />
                        ))}
                      </div>
                    }
                    style={{ zIndex: 1500, marginLeft: 0, marginBottom: -10 }}
                  >
                    <Button
                      justIcon
                      color='transparent'
                      style={{
                        color: NOTESCOLOR.Red,
                        margin: 0,
                      }}
                    >
                      <PaletteIcon />
                    </Button>
                  </Popper>
                </div>
              )}
            </div>
          </GridItem>
          <GridItem md={12}>
            <div>
              {isEditMode ? (
                <div style={{ float: 'right', marginRight: 40, marginTop: -5 }}>
                  <Link
                    style={{ marginRight: 10 }}
                    onClick={this.onCancelClick}
                  >
                    Cancel
                  </Link>
                  <Link onClick={this.onSaveClick}>Save</Link>
                </div>
              ) : (
                stickyNotesEditable && (
                  <div style={{ height: 25 }}>
                    <Popper
                      open={isOpenDeleteItemConfirm}
                      placement='right-end'
                      style={{ zIndex: 1500, marginLeft: 0, marginBottom: -10 }}
                      overlay={
                        isOpenDeleteItemConfirm && (
                          <div
                            style={{
                              width: 224,
                              height: 80,
                              paddingTop: 10,
                              paddingLeft: 8,
                            }}
                          >
                            <span style={{ margin: '20%' }}>
                              <ErrorIcon
                                style={{
                                  position: 'relative',
                                  top: 4,
                                  marginRight: 5,
                                }}
                                htmlColor='orange'
                              />
                              Sure to delete?
                            </span>
                            <div style={{ marginTop: 8 }}>
                              <Button
                                size='sm'
                                color='white'
                                onClick={this.cancelDeleteClick}
                              >
                                No
                              </Button>
                              <Button
                                size='sm'
                                color='primary'
                                onClick={this.confirmDeleteClick}
                              >
                                Yes
                              </Button>
                            </div>
                          </div>
                        )
                      }
                    >
                      {isBelongtoCurrentUser && (
                        <Button
                          className={
                            isOpenDeleteItemConfirm ? null : 'delNoteBtnClass'
                          }
                          justIcon
                          color='transparent'
                          style={{ color: 'gray', margin: '0 0 0 -9px' }}
                          onClick={() => this.onDeleteNoteClick(note)}
                        >
                          <Delete />
                        </Button>
                      )}
                    </Popper>
                    <Tooltip
                      title={
                        <div style={{ fontSize: 12 }}>
                          {`Created by ${note.createByUser} (${
                            note.createByUserRole
                          }) ${moment(note.createDate).format(
                            'DD MMM YYYY HH:mm',
                          )}`}
                        </div>
                      }
                    >
                      <span
                        style={{
                          float: 'right',
                          fontSize: 12,
                          color: 'gray',
                          position: 'relative',
                          bottom: -8,
                        }}
                      >
                        {`Updated by ${note.updateByUser} (${
                          note.updateByUserRole
                        }) ${moment(note.updateDate).format(
                          'DD MMM YYYY HH:mm',
                        )}`}
                      </span>
                    </Tooltip>
                  </div>
                )
              )}
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }

  addNewClick = (e, isDisabled) => {
    e.preventDefault()
    if (isDisabled) return
    const { patient, patientProfileFK } = this.props
    const { stickyNotes } = this.state
    const newNote = {
      id: undefined,
      patientProfileFK: patientProfileFK,
      notes: '',
      isFlagged: true,
      color: '#FFFFFF',
    }
    this.setState({ stickyNotes: [newNote, ...stickyNotes] })
    this.editMode(newNote, 0)
  }

  filterFlaggedNotes = e => {
    this.setState(prevState => ({
      isFlaggedOnlyShow: !prevState.isFlaggedOnlyShow,
    }))
  }

  renderStickyNotes = () => {
    const {
      stickyNotes,
      isFlaggedOnlyShow,
      currentDeletingNote,
      editedItem: { editedNote } = {},
    } = this.state
    const isEditPending = currentDeletingNote || editedNote
    const enableRights = ['enable', 'readwrite']
    const stickyNotesEditable =
      this.patientStickyNotesAccessRight &&
      enableRights.includes(this.patientStickyNotesAccessRight.rights)
    return (
      <div style={{ width: 605, height: 370, padding: 5 }}>
        <div>
          <span style={{ fontSize: 18, marginLeft: 6 }}>Sticky Notes</span>
          <Button
            justIcon
            color='transparent'
            style={{ float: 'right', marginRight: 0 }}
            onClick={this.toggleStickNotes}
          >
            <Close />
          </Button>
          <Checkbox
            style={{ float: 'right', display: 'inline-block' }}
            disabled={isEditPending}
            simple
            checked={isFlaggedOnlyShow}
            label='Show Flagged Only'
            onChange={this.filterFlaggedNotes}
          />
          {stickyNotesEditable && (
            <Link
              style={{
                float: 'right',
                fontSize: 16,
                marginRight: 10,
                marginTop: 3,
              }}
              disabled={isEditPending}
              onClick={e => this.addNewClick(e, isEditPending)}
            >
              +New
            </Link>
          )}
        </div>
        <SizeContainer>
          <div
            style={{
              margin: 5,
              overflow: 'auto',
              maxHeight: 326,
              width: 590,
              paddingRight: 5,
            }}
          >
            {(isFlaggedOnlyShow
              ? stickyNotes.filter(x => x.isFlagged || !x.id)
              : stickyNotes
            ).map((item, index) =>
              this.renderStickyNotesItem(item, index, stickyNotesEditable),
            )}
          </div>
        </SizeContainer>
      </div>
    )
  }

  patientStickyNotesAccessRight = Authorized.check(
    'patientdatabase.patientprofiledetails.stickynotes',
  )

  render() {
    const stickyNotesViewable =
      this.patientStickyNotesAccessRight &&
      this.patientStickyNotesAccessRight.rights !== 'hidden'
    if (!stickyNotesViewable) return null
    const {
      openPopper,
      stickyNotes = [],
      currentDeletingNote,
      flaggedNoteCount,
    } = this.state

    const defaultPopperStyle = {
      zIndex: 1500,
    }

    const { popperStyle = defaultPopperStyle } = this.props

    return (
      <Popper
        open={openPopper}
        overlay={openPopper && this.renderStickyNotes()}
        placement='right'
        style={popperStyle}
      >
        <span style={{ cursor: 'pointer', marginLeft: 8 }}>
          <Badge
            style={{
              paddingLeft: '4px',
              paddingRight: '4px',
            }}
            size='small'
            onClick={this.stickyNotesBtnClick}
            count={flaggedNoteCount}
          >
            <MailOutlined style={{ color: '#4255bd', fontSize: 20 }} />
          </Badge>
        </span>
      </Popper>
    )
  }
}

const ConnectedPatientStickyNotesBtn = connect(({ patient, user }) => ({
  patient: patient.entity || {},
  currentUser: user.data,
}))(PatientStickyNotesBtn)

export default withStyles(styles, {
  withTheme: true,
  name: 'PatientStickyNotes',
})(ConnectedPatientStickyNotesBtn)
