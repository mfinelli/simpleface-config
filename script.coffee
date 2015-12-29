getQueryParam = (variable, defaultValue) ->
  query = location.search.substring(1)
  vars = query.split('&')

  for v in vars
    pair = v.split('=')

    if pair[0] == variable
      return decodeURIComponent(pair[1])

  return defaultValue or false

getConfigData = () ->
  options = {
    forecastAPIKey: $('#forecastAPIKey').val()
  }

  localStorage['forecastAPIKey'] = options.forecastAPIKey

  options

$(document).ready ->
  if localStorage['forecastAPIKey']
    $('#forecastAPIKey').val(localStorage['forecastAPIKey'])

  $('#cancelButton').click ->
    document.location = getQueryParam('return_to', 'pebblejs://close')
  $('#submitButton').click ->
    return_to = getQueryParam('return_to', 'pebblejs://close#')
    return_val = encodeURIComponent(JSON.stringify(getConfigData()))
    document.location = return_to + return_val

  null
