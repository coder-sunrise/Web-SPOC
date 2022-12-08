import React from 'react'
import { CardContainer } from '@/components'
import CommonSpectacleOrderForm from '@/pages/Widgets/ConsultationDocument/CommonSpectacleOrderForm'
import CommonContactLensOrderForm from '@/pages/Widgets/ConsultationDocument/CommonContactLensOrderForm'
import AuthorizedContext from '@/components/Context/Authorized'
export default props => {
  const {
    values: { orderType },
  } = props
  return (
    <AuthorizedContext.Provider
      value={{
        rights: 'disable',
      }}
    >
      <CardContainer hideHeader size='sm' style={{ margin: 0, width: '100%' }}>
        <div>
          <h4>
            {orderType === 'Spectacle'
              ? 'Spectacle Order Form'
              : 'Contact Lens Order Form'}
          </h4>
          <div style={{ margin: '0px 8px' }}>
            {orderType === 'Spectacle' ? (
              <CommonSpectacleOrderForm
                {...props}
                prefix='corSpectacleOrderFormDto'
              />
            ) : (
              <CommonContactLensOrderForm
                {...props}
                prefix='corContactLensOrderFormDto'
              />
            )}
          </div>
        </div>
      </CardContainer>
    </AuthorizedContext.Provider>
  )
}
