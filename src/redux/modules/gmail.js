// Note: uses gapi coming from "https://apis.google.com/js/client.js"
import { createAction, handleActions } from 'redux-actions'

// ------------------------------------
// Constants
// ------------------------------------
const CLIENT_ID = '238012992844-hctqt1sr83toe6n7uba662c1bd6s4e6k.apps.googleusercontent.com'
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

export const SET_GMAIL_CREDENTIALS = 'SET_GMAIL_CREDENTIALS'
export const CHANGE_LOADING = 'CHANGE_LOADING'
export const SET_GMAIL_LABELS = 'SET_GMAIL_LABELS'
export const SELECT_GMAIL_LABEL = 'SELECT_GMAIL_LABEL'
export const SET_GMAIL_EMAILS = 'SET_GMAIL_EMAILS'

// ------------------------------------
// Default state
// ------------------------------------
let defaultState = {
  profile: {
    emailAddress: ''
  },
  loading: true,
  labels: [],
  currentLabel: null,
  emails: []
}

/*
// Proposal for state architecture
let proposal = {
  loading,

  profile: {
    emailAddress
  },

  labels: [{
    id, text, numEmails
  }, ...],

  emails: [{
    id, text, ...
  }, ...],

  openEmail: {
    id, text, ...
  },

  currentLabel: {
    id, text, numEmails
  }
}
*/

// ------------------------------------
// Actions
// ------------------------------------
export const connect = () => {
  return (dispatch, getState) => {
    dispatch(turnLoadingOn())
    gmailAuth(false, populateCredentials(dispatch), clearCredentials(dispatch))
  }
}

export const checkAuth = () => {
  return (dispatch, getState) => {
    dispatch(turnLoadingOn())
    gmailAuth(true, () => {
      populateCredentials(dispatch)()
      listLabels(dispatch)()
    }, clearCredentials(dispatch))
  }
}

export const selectLabel = (label) => {
  return (dispatch, getState) => {
    dispatch(selectGmailLabel(label))
  }
}

export const listEmailsByLabel = (label) => {
  return (dispatch, getState) => {
    dispatch(selectGmailLabel(label))
    listEmails(dispatch)(label)
  }
}

// Internal Actions
// ------------------------------------
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

export const listLabels = (dispatch) => {
  return () => {
    gapi.client.gmail.users.labels.list({ userId: 'me' }).execute((resp) => {
      dispatch(setLabels(resp.labels))
    })
  }
}

export const listEmails = (dispatch) => {
  return (label) => {
    gapi.client.gmail.users.messages.list({ userId: 'me', labelIds: label.id }).execute((resp) => {
      // ToDo: fetch all of the messages if paginated
      let promises = resp.messages
        .map((message) => {
          return getEmail(message.id)
        })

      Promise.all(promises).then((emails) => {
        dispatch(setEmails(emails))
      })
    })
  }
}

function getEmail (id, format = 'metadata') {
  return new Promise((resolve) => {
    gapi.client.gmail.users.messages.get({
      userId: 'me',
      id: id,
      format: format
    }).execute(resolve)
  })
}

// Redux actions (they call the reducer)
// ------------------------------------
export const setCredentials = createAction(SET_GMAIL_CREDENTIALS)
export const turnLoadingOn = createAction(CHANGE_LOADING, () => true)
export const turnLoadingOff = createAction(CHANGE_LOADING, () => false)
export const setLabels = createAction(SET_GMAIL_LABELS)
export const selectGmailLabel = createAction(SELECT_GMAIL_LABEL, (label) => label)
export const setEmails = createAction(SET_GMAIL_EMAILS)

// Exposed actions

export const actions = {
  connect,
  checkAuth,
  selectLabel,
  listEmailsByLabel
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [SET_GMAIL_CREDENTIALS]: (state, { payload }) => Object.assign({}, state, { profile: { emailAddress: payload.email } }),
  [CHANGE_LOADING]: (state, { payload }) => Object.assign({}, state, { loading: payload }),
  [SET_GMAIL_LABELS]: (state, { payload }) => Object.assign({}, state, { labels: payload }),
  [SELECT_GMAIL_LABEL]: (state, {payload}) => Object.assign({}, state, { currentLabel: payload }),
  [SET_GMAIL_EMAILS]: (state, { payload }) => Object.assign({}, state, { emails: payload })
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
    console.log('Google API not ready, waiting...')
    setTimeout(() => gmailAuth(onlyCheck, success, error), 500)
  }
}
