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
    forecastAPIKey: $('#forecastAPIKey').val(),
    forecastUnits: $('input[name=units]:checked').val(),
    forecastLanguage: $('#weatherLanguage').val()
  }

  localStorage['forecastAPIKey'] = options.forecastAPIKey
  localStorage['forecastUnits'] = options.forecastUnits
  localStorage['forecastLanguage'] = options.forecastLanguage

  options

$(document).ready ->
  if localStorage['forecastAPIKey']
    $('#forecastAPIKey').val(localStorage['forecastAPIKey'])

  if localStorage['forecastUnits'] and localStorage['forecastUnits'] == 'si'
    $('#unitsMetric').attr('checked', true)
  else
    $('#unitsUSA').attr('checked', true)

  if localStorage['forecastLanguage']
    $('#weatherLanguage').val(localStorage['forecastLanguage'])

  $('#cancelButton').click ->
    document.location = getQueryParam('return_to', 'pebblejs://close')
  $('#submitButton').click ->
    return_to = getQueryParam('return_to', 'pebblejs://close#')
    return_val = encodeURIComponent(JSON.stringify(getConfigData()))
    document.location = return_to + return_val

  null
