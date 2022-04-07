import React from 'react'
import Print from '@material-ui/icons/Print'
import { useDispatch, useSelector } from 'umi'
import moment from 'moment'
import { Button, labSpecimenLabelDateFormat } from '@/components'
import { REPORT_ID } from '@/utils/constants'
import withWebSocket from '@/components/Decorator/withWebSocket'

export const usePrintSpecimenLabel = handlePrint => {
  const dispatch = useDispatch()

  const printSpecimentLabel = (id, copies) =>
    dispatch({
      type: 'specimenCollection/getLabSpecimenLabelById',
      payload: { id },
    }).then(labSpecimenData => {
      if (labSpecimenData) {
        const {
          gender,
          patientName,
          patientReferenceNo,
          testPanel,
          accessionNo,
          specimenType,
          specimenCollectionDate,
        } = labSpecimenData

        const data = {
          SampleLabelDetails: [
            {
              Gender: gender,
              Name: patientName,
              AccessionNo: accessionNo,
              TestPanel: testPanel,
              SpecimenType: specimenType,
              SpecimenCollectionDate: moment(specimenCollectionDate).format(
                labSpecimenLabelDateFormat,
              ),
              ReferenceNo: patientReferenceNo,
            },
          ],
        }
        console.log('SampleLabelDetails', data)
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

  return printSpecimentLabel
}

const PrintSpecimenLabel = ({ handlePrint, id, copies = 1 }) => {
  const printSpecimenLabel = usePrintSpecimenLabel(handlePrint)

  return (
    <Button
      color='primary'
      onClick={() => {
        printSpecimenLabel(id, copies)
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
