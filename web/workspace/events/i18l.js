var path = require('path')
var langParser = require('accept-language-parser')
var lang

var Event = function (req, res, data, callback) {
  // If there's a lang variable passed from pages
  if (data.params && data.params.lang) {
    console.log('here')
    lang = data.params.lang
  }

  // Otherwise redirect to the browser default (fallback to 'en')
  else {
    console.log('or here')
    lang = langParser.parse(req.headers['accept-language'])[0].code ? langParser.parse(req.headers['accept-language'])[0].code : 'en'
    res.writeHead(302, { Location: '/' + lang })
    return res.end()
  }

  // Load the language file (ignore english)
  try {
    data.i18l = lang && lang != 'en' ? require(path.join(__dirname, '/../lang/', lang + '.json')) : null
  } catch(e) {
    res.writeHead(302, { Location: '/en' })
    return res.end()
  }

  // Fin
  callback()
}

module.exports = function (req, res, data, callback) {
  return new Event(req, res, data, callback)
}