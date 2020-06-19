import React from 'react'

const AuthStateContext = React.createContext()
const AuthDispatchContext = React.createContext()

function countReducer(state, action) {
  switch (action.type) {
    case 'login': {
      return { isLoggedIn: true, userName: action.userName }
    }
    case 'logout': {
      return { isLoggedIn: false }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function AuthProvider({ children }) {
  const [state, dispatch] = React.useReducer(countReducer, { isLoggedIn: false })
  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}

function useAuthState() {
  const context = React.useContext(AuthStateContext)
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider')
  }
  return context
}

function useAuthDispatch() {
  const context = React.useContext(AuthDispatchContext)
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a AuthProvider')
  }
  return context
}

export { AuthProvider, useAuthState, useAuthDispatch }