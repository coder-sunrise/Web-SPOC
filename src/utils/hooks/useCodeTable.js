import { useState, useEffect } from 'react'
import { useDispatch } from 'dva'

export const useCodeTable = params => {
  const dispatch = useDispatch()
  const [data, setData] = useState([])

  useEffect(() => {
    dispatch({
      type: 'codetable/fetchCodes',
      payload: typeof params === 'string' ? { code: params } : { ...params },
    }).then(result => {
      setData(result)
    })
  }, [params])

  return data
}
