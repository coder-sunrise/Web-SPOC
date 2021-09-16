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
import { trim } from '@umijs/core/node_modules/@umijs/deps/compiled/lodash'

const NOTESCOLOR = [
  '#EF5AA1',
  '#99CC66',
  '#66CCFF',
  '#FFCC99',
  '#CCCCCC',
  '#FFFF99',
  '#CCFFFF',
  '#9966FF',
]

const styles = theme => ({
  notesTextStyle: {
    '& > Div > Div': {
      fontSize: '14px !important',
      padding: '5px !important',
      '& > textarea': {
        top: 'unset !important',
        position: 'unset !important',
        marginBottom: 'unset !important',
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
  checkBoxStyle:{
    '& > div > div > label > span:last-child':{
      fontSize:'14px',
    }
  },
})

class PatientStickyNotesBtn extends Component {
  state = {
    openPopper: false,
    stickyNotes: [],
  }

  componentDidMount = () => {
    this.getLatest()
  }

  getLatest = () => {
    const { patient, dispatch } = this.props
    dispatch({
      type: 'patient/getStickyNotes',
      payload: {
        patientProfileFK: patient.id,
      },
    }).then(result => {
      this.setState({ stickyNotes: result || [] })
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
    const { patient, dispatch } = this.props
    dispatch({
      type: 'patient/saveStickyNotes',
      payload: { ...note },
    }).then(result => {
      dispatch({
        type: 'patient/getStickyNotes',
        payload: { patientProfileFK: patient.id },
      }).then(notes => {
        this.setState({
          stickyNotes: notes,
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

  onColorClick = color => {
    const { patient, dispatch } = this.props
    const { index, editedNote } = this.state.editedItem
    this.setState({
      editedItem: { index, editedNote: { ...editedNote, color } },
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
    if(notes.trim().length == 0)
      return
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
          if (!stickyNotesEditable) return
          this.editMode(note, idx)
        }}
      >
        <GridContainer>
          <GridItem style={{ paddingRight: 0, width: '544px' }}>
            <div style={{ paddingTop: 3, minHeight: 33 }}>
              {isEditMode ? (
                <OutlinedTextField
                  autoFocus
                  rows='3'
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
                <span
                  style={{
                    width: '100%',
                    height: '100%',
                    fontSize: 14,
                    wordBreak: 'break-all',
                    color: textContentColor,
                  }}
                >
                  {note.notes}
                </span>
              )}
            </div>
          </GridItem>
          <GridItem width='auto' style={{ paddingRight: 0 }}>
            <div style={{ float: 'right' }}>
              <div>
                <Button
                  justIcon
                  color='transparent'
                  onClick={() => this.onFlagClick(note)}
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
                          <div style={{ fontSize: 12, width: 310 }}>
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
                        {NOTESCOLOR.map(x => (
                          <span
                            style={{
                              display: 'inline-block',
                              cursor: 'pointer',
                              marginRight: 6,
                              height: 24,
                              width: 24,
                              backgroundColor: x,
                            }}
                            onClick={() => this.onColorClick(x)}
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
                        color: NOTESCOLOR[0],
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
                  <div>
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
                    </Popper>
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
    const { patient } = this.props
    const { stickyNotes } = this.state
    const newNote = {
      id: undefined,
      patientProfileFK: patient.id,
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
              ? stickyNotes.filter(x => x.isFlagged)
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

    const { openPopper, stickyNotes = [], currentDeletingNote } = this.state
    const flaggedNoteCount = stickyNotes.filter(x => x.id && x.isFlagged).length
    return (
      <Popper
        open={openPopper}
        overlay={openPopper && this.renderStickyNotes()}
        placement='right-end'
        style={{
          zIndex: 1500,
          marginTop: 100,
        }}
      >
        <span>
          <Button justIcon color='transparent'>
            <MailOutlineIcon
              style={{ color: '#4255BD' }}
              onClick={this.stickyNotesBtnClick}
            />
          </Button>
          {flaggedNoteCount > 0 && (
            <span
              style={{
                display: 'inline-block',
                lineHeight: '1.4em',
                minWidth: 16,
                backgroundColor: 'red',
                color: 'white',
                position: 'relative',
                fontSize: '0.8em !important',
                borderRadius: 8,
                height: 16,
                left: -18,
                top: -5,
              }}
            >
              {flaggedNoteCount}
            </span>
          )}
        </span>
      </Popper>
    )
  }
}

const ConnectedPatientStickyNotesBtn = connect(({ patient }) => ({
  patient: patient.entity || {},
}))(PatientStickyNotesBtn)

export default withStyles(styles, {
  withTheme: true,
  name: 'PatientStickyNotes',
})(ConnectedPatientStickyNotesBtn)
