const azure = require('azure-storage');
const config = require('../common/config');
require('dotenv').config();



const blobService = azure.createBlobService();
var now = new Date();
var fileStamp = (now.getMonth() + 1) + '' + (now.getDate()) + '' + (now.getFullYear()) + '' + (now.getHours()) + '' + (now.getMinutes());



blobService.createBlockBlobFromLocalFile(config.blobContainer, config.db_blobPath + config.db_filename + '_' + fileStamp, config.db_path,
  function (error, result, response) {
    if (error) {
      console.log(error)
    }
    else {
      console.log("uploaded to azure");
    }
  })
