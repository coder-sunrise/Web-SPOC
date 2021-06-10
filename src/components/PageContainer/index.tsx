import React, { useState } from 'react'
// import { useModel } from 'umi'
import { ProLayout, PageContext } from '@medisys/component'

const MIPageContainer = ({
  model = 'list',
  children,
  ...props
}: {
  model?: string
  children?: React.ReactNode
}) => {
  return (
    <PageContext.Provider>
      <ProLayout.PageContainer {...props}>{children}</ProLayout.PageContainer>
    </PageContext.Provider>
  )
}

MIPageContainer.Context = PageContext

export default MIPageContainer
