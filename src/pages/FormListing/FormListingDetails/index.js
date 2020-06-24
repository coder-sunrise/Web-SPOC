import React, { PureComponent } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import FilterBar from './FilterBar'
import FormModuleGrid from './FormModuleGrid'
import VisitFormGrid from './VisitFormGrid'
import { CardContainer, CommonModal, notification } from '@/components'
import { FORM_CATEGORY, FORM_FROM } from '@/utils/constants'
import model from './models'
import AddForm from './FormDetail/AddForm'
import { commonDataReaderTransform } from '@/utils/utils'
import { formTypes } from '@/utils/codes'
import { download } from '@/utils/request'

window.g_app.replaceModel(model)

export const printRow = async (row, formCategory = '2') => {
  const type = formTypes.find(
    (o) => o.value === row.type || o.name === row.type || o.code === row.type,
  )
  const { downloadConfig } = type
  if (!downloadConfig) {
    notification.error({ message: 'No configuration found' })
    return
  }
  download(
    `/api/Reports/${downloadConfig.id}?ReportFormat=pdf&ReportParameters={${downloadConfig.key}:${row.id},FormCategory:"${formCategory ===
    FORM_CATEGORY.VISITFORM
      ? 'VisitForm'
      : 'CORForm'}"}`,
    {
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

  const { codetable } = props
  const { clinicianprofile = [] } = codetable
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

  reportParameters.patientName = row.formData.patientName
  reportParameters.patientAccountNo = row.formData.patientAccountNo
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

@connect(({ formListing, codetable, user }) => ({
  formListing,
  codetable,
  user,
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
      if (formCategory === FORM_CATEGORY.VISITFORM) {
        this.props.dispatch({
          type: 'formListing/getVisitForms',
          payload: {
            id: formListing.visitID,
          },
        })
      } else {
        this.props.dispatch({
          type: 'formListing/getCORForms',
          payload: {
            id: formListing.visitID,
          },
        })
      }
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
    const { formFrom, formListing, user } = this.props

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
          maxWidth='lg'
          bodyNoPadding
        >
          <AddForm {...this.props} types={formTypes} />
        </CommonModal>
      </div>
    )
  }
}
export default withStyles(styles)(FormListingDetails)
