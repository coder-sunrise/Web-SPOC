import { useReducer, useState, useCallback, useEffect } from 'react'
import { ProForm } from '@medisys/component'
import { APIInterface } from '@medisys/component/lib/pro-table/typing'
export type DefaultActionType = 'updateState' | 'setCurrent' | 'showDetail'
const reducer = (
  state: Record<string, any>,
  action: { type: DefaultActionType; payload: any },
) => {
  // console.log(state, action);
  switch (action.type) {
    case 'updateState':
      return {
        ...state,
        ...action.payload,
      }
    case 'setCurrent':
      return {
        ...state,
        current: action.payload,
      }
    case 'showDetail':
      return {
        ...state,
        showDetail: action.payload,
      }
    default:
      return state
  }
}

export default ({ initialValue = {} }: { initialValue?: any } = {}) => {
  const [state, dispatch] = useReducer(reducer, initialValue || {})

  const [api, setAPI] = useState<APIInterface<any>>({})
  const [form] = ProForm.useForm()

  const initModel = useCallback(
    ({ api: passAPI }: { api: APIInterface<any> }) => {
      setAPI(passAPI)
    },
    [],
  )
  const { currentId } = state
  useEffect(() => {
    const getCurrent = async () => {
      let entity: any
      if (currentId) {
        entity = await api.query!({
          id: currentId,
        })
      }
      return entity?.data
    }
    if (form) {
      getCurrent().then(r => {
        // setCurrent(r);
        if (r) {
          form.setFieldsValue(r || {})
        } else {
          form.resetFields()
        }
      })
    }
  }, [currentId, api?.query, form])

  const reset = useCallback(() => {
    dispatch({
      type: 'updateState',
      payload: {
        currentId: undefined,
        showDetail: false,
      },
    })
    // setCurrentId(undefined);
    // setShowDetail(false);
  }, [])

  // const v = useMemo(
  //   () => ({
  //     state,
  //     dispatch,
  //   }),
  //   [],
  // );
  return {
    state,
    dispatch,
    initModel,
    reset,
    form,
    api,
  }
}
