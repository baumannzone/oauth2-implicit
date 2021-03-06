window.a = require('chai').assert
window.eq = a.deepEqual
window.o2i = require('../lib').default



afterEach -> setHash ''



window.hashify = (hash)->
  if typeof hash isnt 'object' then return hash
  Object.keys(hash)
  .reduce ((qsArr, k)-> qsArr.concat(["#{k}=#{hash[k]}"])), []
  .join '&'

window.setHash = (hash)->
  window.location.hash = hashify hash

window.fixData = ->
  beforeEach ->
    @request =
      client_id: 'foo-client'
      response_type: 'token'

    @creds =
      version: '0.5.0'
      expiresAt: null
      id: JSON.stringify @request
      data:
        accessToken: 'foo-token'
        tokenType: 'bearer'
