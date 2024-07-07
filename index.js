// Import Google Cloud Functions Framework
const functions = require('@google-cloud/functions-framework');

// Import individual functions from function files
const { getAllLists, createList, updateList, deleteList } = require('./listFunctions');
const { getTasksInList, createTaskInList, updateTask, deleteTask } = require('./taskFunctions');
const { registerUser, loginUser, refreshAccessToken, updateUserProfile, changeUserPassword, deleteUser } = require('./userFunctions');
const { getAllUsers, adminChangePassword, adminChangeEmail, grantAdminRights, adminDeleteUser } = require('./adminFunctions');

// Register List-related functions
functions.http('getAllLists', getAllLists);
functions.http('createList', createList);
functions.http('updateList', updateList);
functions.http('deleteList', deleteList);

// Register Task-related functions
functions.http('getTasksInList', getTasksInList);
functions.http('createTaskInList', createTaskInList);
functions.http('updateTask', updateTask);
functions.http('deleteTask', deleteTask);

// Register User-related functions
functions.http('registerUser', registerUser);
functions.http('loginUser', loginUser);
functions.http('refreshAccessToken', refreshAccessToken);
functions.http('updateUserProfile', updateUserProfile);
functions.http('changeUserPassword', changeUserPassword);
functions.http('deleteUser', deleteUser);

// Register Admin-related functions
functions.http('getAllUsers', getAllUsers);
functions.http('adminChangePassword', adminChangePassword);
functions.http('adminChangeEmail', adminChangeEmail);
functions.http('grantAdminRights', grantAdminRights);
functions.http('adminDeleteUser', adminDeleteUser);
