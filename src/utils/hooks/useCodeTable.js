import { useState, useEffect } from 'react'
import { useDispatch } from 'dva'

export const useCodeTable = params => {
  const dispatch = useDispatch()
  const [data, setData] = useState([])

  //Codetable has its own internal caching and hooks will now have another layer of caching.
  dispatch({
    type: 'codetable/fetchCodes',
    payload: typeof params === 'string' ? { code: params } : { ...params },
  }).then(result => {
    setData(result)
  })

  return data
}
