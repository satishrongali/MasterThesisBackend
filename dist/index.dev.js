"use strict";

// Import Google Cloud Functions Framework
var functions = require('@google-cloud/functions-framework'); // Import individual functions from function files


var _require = require('./listFunctions'),
    getAllLists = _require.getAllLists,
    createList = _require.createList,
    updateList = _require.updateList,
    deleteList = _require.deleteList;

var _require2 = require('./taskFunctions'),
    getTasksInList = _require2.getTasksInList,
    createTaskInList = _require2.createTaskInList,
    updateTask = _require2.updateTask,
    deleteTask = _require2.deleteTask;

var _require3 = require('./userFunctions'),
    registerUser = _require3.registerUser,
    loginUser = _require3.loginUser,
    refreshAccessToken = _require3.refreshAccessToken,
    updateUserProfile = _require3.updateUserProfile,
    changeUserPassword = _require3.changeUserPassword,
    deleteUser = _require3.deleteUser;

var _require4 = require('./adminFunctions'),
    getAllUsers = _require4.getAllUsers,
    adminChangePassword = _require4.adminChangePassword,
    adminChangeEmail = _require4.adminChangeEmail,
    grantAdminRights = _require4.grantAdminRights,
    adminDeleteUser = _require4.adminDeleteUser; // Register List-related functions


functions.http('getAllLists', getAllLists);
functions.http('createList', createList);
functions.http('updateList', updateList);
functions.http('deleteList', deleteList); // Register Task-related functions

functions.http('getTasksInList', getTasksInList);
functions.http('createTaskInList', createTaskInList);
functions.http('updateTask', updateTask);
functions.http('deleteTask', deleteTask); // Register User-related functions

functions.http('registerUser', registerUser);
functions.http('loginUser', loginUser);
functions.http('refreshAccessToken', refreshAccessToken);
functions.http('updateUserProfile', updateUserProfile);
functions.http('changeUserPassword', changeUserPassword);
functions.http('deleteUser', deleteUser); // Register Admin-related functions

functions.http('getAllUsers', getAllUsers);
functions.http('adminChangePassword', adminChangePassword);
functions.http('adminChangeEmail', adminChangeEmail);
functions.http('grantAdminRights', grantAdminRights);
functions.http('adminDeleteUser', adminDeleteUser);
//# sourceMappingURL=index.dev.js.map
