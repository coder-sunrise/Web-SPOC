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
  // if (!model) throw new Error('modal parameter is not passed');
  // const actionRef = useRef<ActionType>();
  const [values, setValues] = useState({
    model,
    actionRef: undefined,
    setValues: (newValues: any) => {
      setValues({
        ...values,
        ...newValues,
      })
    },
  })

  return (
    <PageContext.Provider>
      <ProLayout.PageContainer {...props}>{children}</ProLayout.PageContainer>
    </PageContext.Provider>
  )
}

MIPageContainer.Context = PageContext

export default MIPageContainer
