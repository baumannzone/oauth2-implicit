import { formatURI } from './utils'



const base64Encode = window.btoa

const serializeState = (object) => (
  base64Encode(JSON.stringify(object))
)

const inferRedirectURI = ({ protocol, host }) => (
  `${protocol}//${host}`
)

const processRedirectURI = ({ redirect_uri }) => (
  /* eslint-disable camelcase */
  redirect_uri || inferRedirectURI(window.location)
  /* eslint-enable camelcase */
)



/* Spec for access_token request params:
http://tools.ietf.org/html/rfc6749#section-4.2.1 */

// processGrantRequest :: InitialGrantRequest -> GrantRequest
const processGrantRequest = (config) => {
  /* Add useful defaults for response_type (we know this is
  an Implicit Grant) and redirect_uri (we have the current
  browser location). */
  const obj = {
    response_type: 'token',
    redirect_uri: processRedirectURI(config)
  }

  if (config.client_id) obj.client_id = config.client_id
  if (config.state !== undefined) {
    obj.state = serializeState(config.state)
  }
  if (config.scope !== undefined) {
    if (!Array.isArray(config.scope)) throw new Error(`If specified "scope" must be an array. Got: ${config.scope}`)
    obj.scope = config.scope.join(' ')
  }

  return obj
}



// start :: {} -> undefined (window location is changed!)
const start = (config) => {
  location.assign(
    formatURI({
      origin: config.auth_uri,
      query: processGrantRequest(config)
    })
  )
}



export {
  start as default,
  serializeState,
  processGrantRequest,
  inferRedirectURI,
}
