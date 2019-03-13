const clientExist = 'client exist';
const clientAdded = 'client added';
const clientNotAdded = 'client not added';
const clientNotExist = 'client not exist';
const clientUpdated = 'client updated';
const clientNotUpdated = 'client not updated';
const clientDeleted = 'client deleted';
const clientNotDeleted = 'client not deleted';
const passwordComplexityIsInsufficient = 'password complexity is insufficient';

const userExist = 'user exist';
const userAdded = 'user added';
const userNotAdded = 'user not added';
const userNotExist = 'user not exist';
const userUpdated = 'user updated';
const userNotUpdated = 'user not updated';
const userDeleted = 'user deleted';
const userNotDeleted = 'user not deleted';

const devLogFilePath = './logs/logger.log';  // todo перенести в параметы
const prodLogFilePath = './logs/prodlogger.log';

module.exports.CLIENT_EXISTS = clientExist;
module.exports.CLIENT_ADDED = clientAdded;
module.exports.CLIENT_UPDATED = clientUpdated;
module.exports.CLIENT_NOT_UPDATED = clientNotUpdated;
module.exports.CLIENT_DELETED = clientDeleted;
module.exports.CLIENT_NOT_DELETED = clientNotDeleted;
module.exports.CLIENT_NOT_ADDED = clientNotAdded;
module.exports.CLIENT_NOT_EXISTS = clientNotExist;

module.exports.USER_EXISTS = userExist;
module.exports.USER_ADDED = userAdded;
module.exports.USER_UPDATED = userUpdated;
module.exports.USER_NOT_UPDATED = userNotUpdated;
module.exports.USER_DELETED = userDeleted;
module.exports.USER_NOT_DELETED = userNotDeleted;
module.exports.USER_NOT_ADDED = userNotAdded;
module.exports.USER_NOT_EXISTS = userNotExist;

module.exports.DEV_LOG_FILE_PATH = devLogFilePath;
module.exports.PROD_LOG_FILE_PATH = prodLogFilePath;
module.exports.BAD_PASSWORD = passwordComplexityIsInsufficient;
