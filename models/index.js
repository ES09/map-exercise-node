var Sequelize = require('sequelize');
var path = require('path');
var fs = require('fs');
var dotenv = require('dotenv');
var wkx = require('wkx');

dotenv.config(); //LOAD CONFIG

Sequelize.GEOMETRY.prototype._stringify = function _stringify(value, options) {
    return `ST_GeomFromText(${options.escape(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
}
Sequelize.GEOMETRY.prototype._bindParam = function _bindParam(value, options) {
    return `ST_GeomFromText(${options.bindParam(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
}
Sequelize.GEOGRAPHY.prototype._stringify = function _stringify(value, options) {
    return `ST_GeomFromText(${options.escape(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
}
Sequelize.GEOGRAPHY.prototype._bindParam = function _bindParam(value, options) {
    return `ST_GeomFromText(${options.bindParam(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
}

const sequelize = new Sequelize( process.env.DATABASE,
    process.env.DB_USER, process.env.DB_PASSWORD,{
        host: process.env.DB_HOST,
        dialect: 'mysql',
        timezone: '+09:00', //한국 시간 셋팅
        operatorsAliases: Sequelize.Op,
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    }
);

let db = [];

fs.readdirSync(__dirname)
    .filter(file => {
        return file.indexOf('.js')&& file !== 'index.js'
    })
    .forEach(file => {
        var model = sequelize.import(path.join(__dirname,
            file));
            db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if("associate" in db[modelName]){
        db[modelName].associate(db);
    }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;