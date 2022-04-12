import React, { useContext, useEffect, useState, createContext } from 'react'
import { useSelector, useDispatch } from 'dva'
import moment from 'moment'
import { getMappedVisitType } from '@/utils/utils'
import { VISIT_TYPE } from '@/utils/constants'

const WorklistContext = createContext(null)

export const WorklistContextProvider = props => {
  const [isAnyWorklistModelOpened, setIsAnyWorklistModelOpened] = useState(
    false,
  )

  return (
    // this is the provider providing state
    <WorklistContext.Provider
      value={{
        isAnyWorklistModelOpened,
        setIsAnyWorklistModelOpened,
      }}
    >
      {props.children}
    </WorklistContext.Provider>
  )
}

export default WorklistContext
