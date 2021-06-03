import React, { useState, useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { ConfigProvider } from 'antd'
// import { useModel } from 'umi'

import { PageContext } from '@medisys/component'

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

  // // @ts-ignore
  // const { reset } = useModel(model)
  // // useWhyDidYouUpdate('PageContainer', { ...props });
  // // const [uid, setUid] = useState(0);
  // useEffect(() => {
  //   // setUid(getUniqueId());
  //   return () => {
  //     if (reset) reset()
  //   }
  // }, [reset])
  return (
    <ConfigProvider
      componentSize='middle'
      form={{
        validateMessages: {
          required: 'This field is required',
          // ...
        },
      }}
    >
      <PageContext.Provider value={values}>
        <PageContainer {...props}>{children}</PageContainer>
      </PageContext.Provider>
    </ConfigProvider>
  )
}

MIPageContainer.Context = PageContext

export default MIPageContainer
