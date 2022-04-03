import React from 'react'
import Print from '@material-ui/icons/Print'
import { useDispatch, useSelector } from 'umi'
import moment from 'moment'
import { Button, labSpecimenLabelDateFormat } from '@/components'
import { REPORT_ID } from '@/utils/constants'
import withWebSocket from '@/components/Decorator/withWebSocket'

export const usePrintLabLabel = handlePrint => {
  const dispatch = useDispatch()
  const { entity: patient } = useSelector(s => s.patient)

  const printLabLabel = (id, copies) =>
    dispatch({
      type: 'specimenCollection/getLabSpecimenById',
      payload: { id },
    }).then(labSpecimenData => {
      if (labSpecimenData) {
        let testPanel = labSpecimenData?.labWorkitems
          .map(labWorkitem => labWorkitem.testPanel)
          .join(', ')
        const data = {
          SampleLabelDetails: [
            {
              Gender:
                patient.genderFK === 1
                  ? 'Male'
                  : patient.genderFK === 2
                  ? 'Female'
                  : 'Unknown',
              Name: patient.name,
              AccessionNo: labSpecimenData.accessionNo,
              TestPanel: testPanel,
              SpecimenType: labSpecimenData.specimenType,
              SpecimenCollectionDate: moment(
                labSpecimenData.specimenCollectionDate,
              ).format(labSpecimenLabelDateFormat),
              ReferenceNo: patient.patientReferenceNo,
            },
          ],
        }
        const payload = [
          {
            Copies: copies,
            ReportId: REPORT_ID.LAB_SPECIMEN_LABEL_50MM_34MM,
            ReportData: JSON.stringify({
              ...data,
            }),
          },
        ]
        handlePrint(JSON.stringify(payload))
      }
    })

  return printLabLabel
}

const PrintSpecimenLabel = ({ handlePrint, id, copies = 1 }) => {
  const printLabLabel = usePrintLabLabel(handlePrint)

  return (
    <Button
      color='primary'
      onClick={() => {
        printLabLabel(id, copies)
      }}
      size='sm'
      justIcon
      style={{ height: 25, marginTop: 2 }}
    >
      <Print />
    </Button>
  )
}

export default withWebSocket()(PrintSpecimenLabel)
