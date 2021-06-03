import { useContext } from 'react'
import { Button, message, Form } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import {
  ProInput,
  ProSelect,
  ProForm,
  ProSwitch,
  ModalForm,
} from '@medisys/component'
import { PageContainer } from '@/components'

const Detail = ({ trigger }: { trigger?: JSX.Element }) => {
  const { actionRef } = useContext(PageContainer.Context)
  const form = Form.useForm()

  return (
    <div>
      <ModalForm
        model='user'
        form={form}
        trigger={
          trigger ?? (
            <Button
              type='primary'
              onClick={() => {
                // dispatch({
                //   type: 'updateState',
                //   payload: {
                //     showDetail: true,
                //     currentId: undefined,
                //   },
                // })
              }}
            >
              <PlusOutlined />
              New
            </Button>
          )
        }
        // onFinish={async (values: any) => {
        //   // await sleep(2000);
        //   // console.log(values);
        //   await (values.id ? update!(values) : create!(values))
        //   message.success(values.id ? 'User updated' : 'User created')
        //   dispatch({
        //     type: 'updateState',
        //     payload: {
        //       showDetail: false,
        //       currentId: undefined,
        //     },
        //   })

        //   actionRef?.current?.reloadAndRest!()
        // }}
      >
        <div>test</div>
      </ModalForm>
    </div>
  )
}

export default Detail
