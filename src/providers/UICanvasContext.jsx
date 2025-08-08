// UIVisibilityContext.jsx
'use client'
import React, { createContext, useContext, useState } from 'react'

const UIVisibilityContext = createContext(null)

export const UIVisibilityProvider = ({ children }) => {
  const [topBarVisible, setTopBarVisible] = useState(true)
  const [actionBarVisible, setActionBarVisible] = useState(true)

  const [resizingTopBarVisible, setResizingTopBarVisible] = useState(false)
  const [resizingActionBarVisible, setResizingActionBarVisible] = useState(false)

  const [movingTopBarVisible, setMovingTopBarVisible] = useState(false)
  const [movingActionBarVisible, setMovingActionBarVisible] = useState(false)

  const [removingTopBarVisible, setRemovingTopBarVisible] = useState(false)
  const [removingActionBarVisible, setRemovingActionBarVisible] = useState(false)

  const [ruleringTopBarVisible, setRuleringTopBarVisible] = useState(false)
  const [ruleringActionBarVisible, setRuleringActionBarVisible] = useState(false)

  const [tapperingTopBarVisible, setTapperingTopBarVisible] = useState(false)
  const [tapperingActionBarVisible, setTapperingActionBarVisible] = useState(false)

  const [crushFoldingTopBarVisible, setCrushFoldingTopBarVisible] = useState(false)
  const [crushFoldingActionBarVisible, setCrushFoldingActionBarVisible] = useState(false)

  const [bottomControlsVisible, setBottomControlsVisible] = useState(true)

  return (
    <UIVisibilityContext.Provider
      value={{
        topBarVisible,
        setTopBarVisible,
        actionBarVisible,
        setActionBarVisible,
        bottomControlsVisible,
        setBottomControlsVisible,
        resizingTopBarVisible,
        setResizingTopBarVisible,
        resizingActionBarVisible,
        setResizingActionBarVisible,
        movingTopBarVisible,
        setMovingTopBarVisible,
        movingActionBarVisible,
        setMovingActionBarVisible,
        removingTopBarVisible,
        setRemovingTopBarVisible,
        removingActionBarVisible,
        setRemovingActionBarVisible,
        ruleringTopBarVisible,
        setRuleringTopBarVisible,
        ruleringActionBarVisible,
        setRuleringActionBarVisible,
        tapperingTopBarVisible,
        setTapperingTopBarVisible,
        tapperingActionBarVisible,
        setTapperingActionBarVisible,
        crushFoldingTopBarVisible,
        crushFoldingActionBarVisible,
        setCrushFoldingTopBarVisible,
        setCrushFoldingActionBarVisible,
      }}
    >
      {children}
    </UIVisibilityContext.Provider>
  )
}

export const useUIVisibility = () => {
  const context = useContext(UIVisibilityContext)
  if (!context) throw new Error('useUIVisibility must be used within UIVisibilityProvider')
  return context
}
