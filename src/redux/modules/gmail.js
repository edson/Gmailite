// Note: uses gapi coming from "https://apis.google.com/js/client.js?onload=checkAuth"
import { createAction, handleActions } from 'redux-actions'

// ------------------------------------
// Constants
// ------------------------------------
const CLIENT_ID = '238012992844-hctqt1sr83toe6n7uba662c1bd6s4e6k.apps.googleusercontent.com'
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

export const SET_GMAIL_CREDENTIALS = 'SET_GMAIL_CREDENTIALS'
export const CHANGE_LOADING = 'CHANGE_LOADING'

// ------------------------------------
// Default state
// ------------------------------------
let defaultState = {
  email: '',
  loading: true
}

// ------------------------------------
// Actions
// ------------------------------------
export const connect = () => {
  return (dispatch, getState) => {
    gmailAuth(false, populateCredentials(dispatch), clearCredentials(dispatch))
  }
}

export const checkAuth = () => {
  return (dispatch, getState) => {
    gmailAuth(true, populateCredentials(dispatch), clearCredentials(dispatch))
  }
}

export const populateCredentials = (dispatch) => {
  return () => {
    gapi.client.gmail.users.getProfile({ userId: 'me' }).execute((resp) => {
      dispatch(turnLoadingOff())
      dispatch(setCredentials({ email: resp.emailAddress }))
    })
  }
}

export const clearCredentials = (dispatch) => {
  return () => {
    dispatch(turnLoadingOff())
    dispatch(setCredentials({ email: '' }))
  }
}

export const setCredentials = createAction(SET_GMAIL_CREDENTIALS)
export const turnLoadingOn = createAction(CHANGE_LOADING, () => true)
export const turnLoadingOff = createAction(CHANGE_LOADING, () => false)

// Exposed actions

export const actions = {
  connect,
  checkAuth
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [SET_GMAIL_CREDENTIALS]: (state, { payload }) => Object.assign({}, state, payload),
  [CHANGE_LOADING]: (state, { payload }) => Object.assign({}, state, { loading: payload })
}, defaultState)

// ------------------------------------
// GMAIL AUTHENTICATION
// ------------------------------------

/**
 * Auth (or only check if true given as first arg)
 * Wait for gapi API to be ready before running auth
 */
const gmailAuth = (onlyCheck, success, error) => {
  if (gapi && gapi.auth && gapi.auth.authorize) {
    gapi.auth.authorize(
      {
        client_id: CLIENT_ID,
        scope: SCOPES.join(' '),
        immediate: !!onlyCheck
      },
      (authResult) => {
        if (authResult && !authResult.error) {
          gapi.client.load('gmail', 'v1', success) // Load client library and run cb
        } else {
          error(authResult)
        }
      }
    )
  } else {
    setTimeout(() => gmailAuth(onlyCheck, success, error), 500)
  }
}
