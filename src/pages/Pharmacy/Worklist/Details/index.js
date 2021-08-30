import React, { useEffect, useState, useContext } from 'react'
import { useDispatch } from 'dva'
import { CommonModal } from '@/components'
import WorklistContext from '@/pages/Radiology/Worklist/WorklistContext'
import Details from './Details'

const PharmacyDetails = ({ refreshClick }) => {
  const dispatch = useDispatch()
  const { detailsId, setDetailsId } = useContext(WorklistContext)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (detailsId) {
      dispatch({
        type: 'codetable/fetchCodes',
        payload: { code: 'inventorymedication' },
      })
      dispatch({
        type: 'codetable/fetchCodes',
        payload: { code: 'ctmedicationunitofmeasurement' },
      })
      dispatch({ type: 'pharmacyDetails/query', payload: { id: detailsId } })
      setShowModal(true)
    }
  }, [detailsId])

  return (
    <CommonModal
      open={showModal}
      title='Pharmacy Details'
      showFooter={true}
      onClose={() => {
        setDetailsId(null)
        setShowModal(false)
      }}
      fullScreen
      overrideLoading
      observe='PharmarcyWorklistDetail'
      showFooter={false}
      onConfirm={() => {
        refreshClick()
        setDetailsId(null)
        setShowModal(false)
      }}
    >
      <Details />
    </CommonModal>
  )
}

export default PharmacyDetails
