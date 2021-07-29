import React, { useContext, useEffect, useState, createContext } from 'react'
import { useSelector } from 'dva'

const WorklistContext = createContext(null)

export const WorklistContextProvider = props => {
  const [detailsId, setDetailsId] = useState(null)

  return (
    // this is the provider providing state
    <WorklistContext.Provider
      value={{
        detailsId,
        setDetailsId,
      }}
    >
      {props.children}
    </WorklistContext.Provider>
  )
}

export default WorklistContext
