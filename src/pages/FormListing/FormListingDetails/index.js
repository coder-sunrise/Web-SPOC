import React, { PureComponent } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import FilterBar from './FilterBar'
import FormModuleGrid from './FormModuleGrid'
import VisitFormGrid from './VisitFormGrid'
import { CardContainer, CommonModal, notification } from '@/components'
import { FORM_FROM } from '@/utils/constants'
import model from './models'
import AddForm from './FormDetail/AddForm'
import { commonDataReaderTransform } from '@/utils/utils'
import { formTypes } from '@/utils/codes'
import { download } from '@/utils/request'

window.g_app.replaceModel(model)

export const printRow = async (row, formCategory = 'CORForm') => {
  const type = formTypes.find(
    (o) => o.value === row.type || o.name === row.type || o.code === row.type,
  )
  const { downloadConfig } = type
  if (!downloadConfig) {
    notification.error({ message: 'No configuration found' })
    return
  }
  // return
  download(
    `/api/Reports/${downloadConfig.id}?ReportFormat=pdf&ReportParameters={${downloadConfig.key}:${row.id},"FormCategory":${formCategory}}`,
    {
      subject: row.subject,
      type: 'pdf',
    },
  )
}

export const viewReport = (row, props) => {
  const type = formTypes.find(
    (o) => o.value === row.type || o.name === row.type || o.code === row.type,
  )
  const { downloadConfig } = type
  if (!downloadConfig) {
    notification.error({ message: 'No configuration found' })
    return false
  }

  const { codetable, patient } = props
  const { clinicianprofile = [] } = codetable
  const { entity } = patient
  const obj =
    clinicianprofile.find(
      (o) =>
        o.userProfileFK ===
        (row.issuedByUserFK ? row.issuedByUserFK : row.referredByUserFK),
    ) || {}

  const reportParameters = { ...row }
  reportParameters.doctorName = (obj.title ? `${obj.title} ` : '') + obj.name
  reportParameters.doctorMCRNo = obj.doctorProfile
    ? obj.doctorProfile.doctorMCRNo
    : ''

  reportParameters.patientName = entity.name
  reportParameters.patientAccountNo = entity.patientAccountNo
  window.g_app._store.dispatch({
    type: 'report/updateState',
    payload: {
      reportTypeID: downloadConfig.id,
      reportParameters: {
        isSaved: false,
        reportContent: JSON.stringify(
          commonDataReaderTransform(downloadConfig.draft(reportParameters)),
        ),
      },
    },
  })

  return true
}

const styles = () => ({})

@connect(({ formListing, codetable, patient }) => ({
  formListing,
  codetable,
  patient,
}))
class FormListingDetails extends PureComponent {
  componentDidMount () {
    this.queryFormListing()
  }

  queryFormListing = () => {
    const { formListing, formFrom, formCategory } = this.props

    if (formFrom === FORM_FROM.FORMMODULE) {
      this.props.dispatch({
        type: 'formListing/query',
        payload: {
          apiCriteria: {
            startDate: moment().add(-1, 'month').formatUTC(),
            endDate: moment().formatUTC(false),
          },
        },
      })
    } else if (formFrom === FORM_FROM.QUEUELOG) {
      this.props.dispatch({
        type: 'formListing/getVisitForm',
        payload: {
          id: formListing.visitID,
          formType:
            formCategory === FORM_FROM.FORMMODULE ? 'VisitForm' : 'CORForm',
        },
      })
    }
  }

  toggleModal = () => {
    const { formListing } = this.props
    const { showModal } = formListing
    this.props.dispatch({
      type: 'formListing/updateState',
      payload: {
        showModal: !showModal,
      },
    })
  }

  render () {
    const { formFrom, formListing } = this.props

    const { showModal } = formListing
    return (
      <div>
        {formFrom === FORM_FROM.FORMMODULE && (
          <CardContainer hideHeader>
            <React.Fragment>
              <FilterBar {...this.props} />
              <FormModuleGrid
                {...this.props}
                printRow={printRow}
                editRow={this.editRow}
                queryFormListing={this.queryFormListing}
              />
            </React.Fragment>
          </CardContainer>
        )}
        {formFrom === FORM_FROM.QUEUELOG && (
          <VisitFormGrid
            {...this.props}
            printRow={printRow}
            viewReport={viewReport}
            editRow={this.editRow}
            queryFormListing={this.queryFormListing}
          />
        )}
        <CommonModal
          open={showModal}
          title='Add Form'
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
          observe='AddForm'
          maxWidth='md'
          bodyNoPadding
        >
          <AddForm {...this.props} types={formTypes} />
        </CommonModal>
      </div>
    )
  }
}
export default withStyles(styles)(FormListingDetails)
