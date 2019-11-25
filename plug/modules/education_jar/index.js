var BaseModel = require('../../BaseModel.js')
var education_jar = new BaseModel()

education_jar.loadPlug(__dirname)
education_jar.title = 'education_jar'

module.exports = education_jar