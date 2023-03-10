import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { CardContainer, dateFormatLong } from '@/components'
import { VISIT_TYPE } from '@/utils/constants'
import { List, ListItem, ListItemText } from '@material-ui/core'
import classnames from 'classnames'
import * as WidgetConfig from './config'

@connect(({ patientHistory }) => ({
  patientHistory,
}))
class HistoryDetails extends PureComponent {
  constructor(props) {
    super(props)

    this.widgets = WidgetConfig.widgets(
      props,
      props.scribbleNoteUpdateState,
    ).filter(o => {
      return (
        o.id === WidgetConfig.WIDGETS_ID.ClINICALNOTES ||
        props.getCategoriesOptions().find(c => c.value === o.id)
      )
    })
  }

  componentWillMount() {
    const { selectHistory } = this.props
    this.props
      .dispatch({
        type: 'patientHistory/queryOne',
        payload: selectHistory.coHistory[0].id,
      })
      .then(r => {
        if (r) {
          this.props.dispatch({
            type: 'patientHistory/updateState',
            payload: {
              selectedSubRow: selectHistory.coHistory[0],
            },
          })
        }
      })
  }

  leftPanel = () => {
    const { patientHistory, clinicSettings, selectHistory } = this.props
    const { settings = [] } = clinicSettings
    const { selectedSubRow } = patientHistory
    let newArray = []

    if (
      settings.showConsultationVersioning === false ||
      settings.showConsultationVersioning === undefined
    ) {
      if (selectHistory.coHistory.length >= 1) {
        newArray.push(selectHistory.coHistory[0])
      }
    } else {
      newArray = selectHistory.coHistory
    }
    return (
      <List
        component='nav'
        classes={{
          root: this.props.classes.listRoot,
        }}
        disablePadding
        onClick={() => {}}
        style={{ overflow: 'auto', height: window.innerHeight - 96 }}
      >
        {newArray.map(o => {
          const updateByUser = o.userName
            ? `${o.userTitle || ''} ${o.userName || ''}`
            : undefined
          const lastChangeDate = moment(o.signOffDate).format(
            'DD MMM YYYY HH:mm',
          )
          const { visitDate, doctors = [] } = selectHistory
          const student = doctors.find(doctor => !doctor.isPrimaryDoctor)
          const optometrist = doctors.find(doctor => doctor.isPrimaryDoctor)
          return (
            <React.Fragment>
              <ListItem
                style={{ paddingLeft: 15 }}
                alignItems='flex-start'
                classes={{
                  root: this.props.classes.listItemRoot,
                }}
                selected={selectedSubRow && o.id === selectedSubRow.id}
                divider
                disableGutters
                button
                onClick={() => {
                  if (selectedSubRow && selectedSubRow.id === o.id) {
                    return
                  }
                  this.props
                    .dispatch({
                      type: 'patientHistory/queryOne',
                      payload: o.id,
                    })
                    .then(r => {
                      if (r) {
                        this.props.dispatch({
                          type: 'patientHistory/updateState',
                          payload: {
                            selectedSubRow: o,
                          },
                        })
                      }
                    })
                }}
              >
                <ListItemText
                  primary={
                    <div
                      style={{
                        width: '100%',
                      }}
                    >
                      <div style={{ fontWeight: 500 }}>
                        {`${moment(visitDate).format(dateFormatLong)} (${
                          student ? `Student: ${student.name}, ` : ''
                        }${
                          optometrist ? `Optometrist: ${optometrist.name}` : ''
                        })`}
                      </div>
                      <div>
                        {settings.showConsultationVersioning
                          ? `${selectHistory.visitPurposeName} (V${
                              o.versionNumber
                            }), Last Update By: ${updateByUser || ''}${
                              lastChangeDate ? ` on ${lastChangeDate}` : ''
                            }`
                          : `${
                              selectHistory.visitPurposeName
                            }, Last Update By: ${updateByUser || ''}${
                              lastChangeDate ? ` on ${lastChangeDate}` : ''
                            }`}
                      </div>
                    </div>
                  }
                />
              </ListItem>
            </React.Fragment>
          )
        })}
      </List>
    )
  }

  detailPanel = () => {
    const {
      classes,
      override = {},
      patientHistory,
      selectHistory,
      getCategoriesOptions,
    } = this.props
    let visitDetails = {
      visitDate: selectHistory.visitDate,
      patientName: selectHistory.patientName,
      patientAccountNo: selectHistory.patientAccountNo,
    }
    const { visitPurposeFK } = selectHistory
    let current = {
      ...patientHistory.entity,
      visitAttachments: selectHistory.visitAttachments,
      visitRemarks: selectHistory.visitRemarks,
      referralSourceFK: selectHistory.referralSourceFK,
      referralPersonFK: selectHistory.referralPersonFK,
      referralPatientProfileFK: selectHistory.referralPatientProfileFK,
      referralSource: selectHistory.referralSource,
      referralPerson: selectHistory.referralPerson,
      referralPatientName: selectHistory.referralPatientName,
      referralRemarks: selectHistory.referralRemarks,
      visitPurposeFK: visitPurposeFK,
      patientGender: selectHistory.patientGender,
    }
    const selectCategories = getCategoriesOptions().map(sc => sc.value) || []
    return (
      <CardContainer
        hideHeader
        size='sm'
        className={classnames({
          [classes.rightPanel]: true,
          [override.rightPanel]: true,
        })}
        style={{ overflow: 'auto', height: window.innerHeight - 80 }}
      >
        <div>
          {this.widgets
            .filter(_widget => {
              if (visitPurposeFK === VISIT_TYPE.OTC) {
                return (
                  (_widget.id === WidgetConfig.WIDGETS_ID.ORDERS ||
                    _widget.id ===
                      WidgetConfig.WIDGETS_ID.CONSULTATION_DOCUMENT ||
                    _widget.id === WidgetConfig.WIDGETS_ID.VISITREMARKS) &&
                  WidgetConfig.showWidget(current, _widget.id)
                )
              }
              return WidgetConfig.showWidget(
                current,
                _widget.id,
                selectCategories.length === 0
                  ? WidgetConfig.formWidgets()
                  : WidgetConfig.formWidgets().filter(
                      fw => selectCategories.indexOf(fw.id) >= 0,
                    ),
              )
            })
            .map(o => {
              const Widget = o.component
              let selectForms = []
              if (o.id === WidgetConfig.WIDGETS_ID.ClINICALNOTES) {
                selectForms =
                  selectCategories.length === 0
                    ? WidgetConfig.formWidgets().map(fw => fw.id)
                    : WidgetConfig.formWidgets()
                        .filter(fw => selectCategories.indexOf(fw.id) >= 0)
                        .map(fw => fw.id)
              }
              return (
                <div>
                  <span
                    style={{
                      fontWeight: 500,
                      color: 'darkBlue',
                      fontSize: '0.85rem',
                    }}
                  >
                    {o.name}
                  </span>
                  <Widget
                    current={current}
                    visitDetails={visitDetails}
                    {...this.props}
                    setFieldValue={this.props.setFieldValue}
                    selectForms={selectForms}
                  />
                </div>
              )
            })}
        </div>
      </CardContainer>
    )
  }

  render() {
    const { classes } = this.props
    return (
      <div style={{ marginLeft: 8, marginRight: 8 }}>
        <CardContainer hideHeader size='sm' className={classes.leftPanel}>
          {this.leftPanel()}
        </CardContainer>
        {this.detailPanel()}
      </div>
    )
  }
}

export default HistoryDetails
