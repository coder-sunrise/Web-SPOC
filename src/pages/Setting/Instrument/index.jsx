import React, { useEffect } from 'react'
import { CardContainer, CommonModal } from '@/components'
import { connect } from 'dva'
import $ from 'jquery'
import Filter from './Filter'
import Detail from './Detail'
import Grid from './Grid'

let _connect = connect(({ global, settingInstrument }) => ({
  mainDivHeight: global?.mainDivHeight,
  settingInstrument,
}))

let Instrument = props => {
  let { mainDivHeight, settingInstrument, dispatch } = props

  useEffect(() => {
    dispatch({
      type: 'settingInstrument/query',
      payload: {
        isActive: true,
      },
    })
  }, [])

  let toggleModal = () => {
    dispatch({
      type: 'settingInstrument/updateState',
      payload: {
        showModal: !settingInstrument.showModal,
      },
    })
  }

  let height = mainDivHeight - 120 - ($('.instrumentFilterBar').height() || 0)
  if (height < 300) height = 300
  return (
    <div>
      <CardContainer hideHeader>
        <div className='instrumentFilterBar'>
          <Filter {...props} />
        </div>
        <Grid height={height} {...props} />
        <CommonModal
          open={settingInstrument.showModal}
          title={
            settingInstrument.entity
              ? 'Edit Instrument (Posterior Eye Examination)'
              : 'Add Instrument (Posterior Eye Examination)'
          }
          maxWidth='md'
          bodyNoPadding
          onClose={toggleModal}
          onConfirm={toggleModal}
        >
          <Detail toggleModal={toggleModal} {...props} />
        </CommonModal>
      </CardContainer>
    </div>
  )
}
export default _connect(Instrument)
