import React, { useContext, useEffect, useState, createContext } from 'react'
import { useSelector } from 'dva'

const WorklistContext = createContext(null)

export const WorklistContextProvider = props => {
  const [showDetails, setShowDetails] = useState(false)

  return (
    // this is the provider providing state
    <WorklistContext.Provider
      value={{
        showDetails,
        setShowDetails,
      }}
    >
      {props.children}
    </WorklistContext.Provider>
  )
}

export default WorklistContext
