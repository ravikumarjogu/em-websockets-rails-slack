# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/
tabsFn = do ->

  init = ->
    setHeight()
    return

  setHeight = ->
    $tabPane = $('.tab-pane')
    tabsHeight = $('.nav-tabs').height()
    $tabPane.css height: tabsHeight
    return

  $ init
  return
