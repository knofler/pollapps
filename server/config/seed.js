/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Acl        = require('../api/acl/acl.model');
var Group      = require('../api/group/group.model');
var Role       = require('../api/role/role.model');
var User       = require('../api/user/user.model');
var Poll       = require('../api/poll/poll.model');
var Category   = require('../api/category/category.model');
var Vote       = require('../api/vote/vote.model');


function convDate(dateString){
    var dataSplit = dateString.split('/');
    var dateConverted;

    // if (dataSplit[2].split(" ").length > 1) {

    //     var hora = dataSplit[2].split(" ")[1].split(':');
    //     dataSplit[2] = dataSplit[2].split(" ")[0];
    //     dateConverted = new Date(dataSplit[2], dataSplit[1]-1, dataSplit[0], hora[0], hora[0]);

    // } else {
        dateConverted = new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0]);
        dateConverted = new Date(dateConverted.getTime() - dateConverted.getTimezoneOffset()*60000)
    // }
    return dateConverted;
    };

Acl.find({}).remove(function() {
    
 });
Group.find({}).remove(function() { Group.create(
  { "name": "Admin","desc":"This is Admin resource management group","resource":"admin","created":new Date(),"created_by":"AUTO_GENERATED"},
  { "name": "AKS","desc":"This is AKS resource management group","resource":"aks","created":new Date(),"created_by":"AUTO_GENERATED"},
  { "name": "Application","desc":"This is Application resource management group","resource":"application","created":new Date(),"created_by":"AUTO_GENERATED"},
  { "name": "CAB","desc":"This is CAB resource management group","resource":"cab","created":new Date(),"created_by":"AUTO_GENERATED"},
  { "name": "Device","desc":"This is Device resource management group","resource":"device","created":new Date(),"created_by":"AUTO_GENERATED"},
  { "name": "IT Full Access","desc":"This group has access to all resources","resource":["admin","accounting","aks","application","cab","device","license","loan","main","purchase","scan","search","settings","signup","uat"],"created":new Date(),"created_by":"AUTO_GENERATED"},
  { "name": "License","desc":"This is License resource management group","resource":"license","created":new Date(),"created_by":"AUTO_GENERATED"},
  { "name": "Loan","desc":"This is Loan resource management group","resource":"loan","created":new Date(),"created_by":"AUTO_GENERATED"},
  { "name": "Login","desc":"This is Login resource management group","resource":"login","created":new Date(),"created_by":"AUTO_GENERATED"},
  { "name": "Main","desc":"This is Main resource management group","resource":"main","created":new Date(),"created_by":"AUTO_GENERATED"},
  { "name": "Purchase","desc":"This is Purchase resource management group","resource":"purchase","created":new Date(),"created_by":"AUTO_GENERATED"},
  { "name": "Scan","desc":"This is Scan resource management group","resource":"scan","created":new Date(),"created_by":"AUTO_GENERATED"},
  { "name": "Search","desc":"This is Search resource management group","resource":"search","created":new Date(),"created_by":"AUTO_GENERATED"},
  { "name": "Settings","desc":"This is Settings resource management group","resource":"settings","created":new Date(),"created_by":"AUTO_GENERATED"},
  { "name": "Signup","desc":"This is Signup resource management group","resource":"signup","created":new Date(),"created_by":"AUTO_GENERATED"},
  { "name": "UAT","desc":"This is UAT resource management group","resource":"uat","created":new Date(),"created_by":"AUTO_GENERATED"}
  )
 });
Role.find({}).remove(function() { Role.create(
  { "roleName": "admin"},{ "roleName": "Finance"},{ "roleName": "IT"},{ "roleName": "Marketing"},{ "roleName": "Vendor"},{ "roleName": "user"}
 ) 
 });
User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  },{
    provider: 'local',
    role: 'SUPER',
    name: 'Rumman Ahmed',
    email: 'rumman@test.com',
    password: '123'
  },{
    provider: 'local',
    role: 'user',
    name: 'Roger Waters',
    email: 'roger@test.com',
    password: '123'
  }
  , function() {
      console.log('finished populating users');
    }
  );
 });
Poll.find({}).remove();
Category.find({}).remove();
Vote.find({}).remove();
