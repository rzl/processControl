var BaseModel = require('../../BaseModel.js')
var education_web = new BaseModel()

education_web.loadPlug(__dirname)
education_web.title = 'education_web'

module.exports = education_web