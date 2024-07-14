const express = require('express');
const app = express();

app.use(express.json());

const { getAllLists, createList, updateList, deleteList } = require('./listFunctions');
const { getTasksInList, createTaskInList, updateTask, deleteTask } = require('./taskFunctions');
const { registerUser, loginUser, refreshAccessToken, updateUserProfile, changeUserPassword, deleteUser } = require('./userFunctions');
const { getAllUsers, adminChangePassword, adminChangeEmail, grantAdminRights, adminDeleteUser } = require('./adminFunctions');


//routes
app.get('/lists', getAllLists);
app.post('/lists', createList);
app.patch('/lists/:id', updateList);
app.delete('/lists/:id', deleteList);

app.get('/tasks/:listId', getTasksInList);
app.post('/tasks/:listId', createTaskInList);
app.patch('/tasks/:taskId', updateTask);
app.delete('/tasks/:taskId', deleteTask);

app.post('/register', registerUser);
app.post('/login', loginUser);
app.get('/refresh', refreshAccessToken);
app.patch('/user', updateUserProfile);
app.patch('/user/password', changeUserPassword);
app.delete('/user', deleteUser);

app.get('/users', getAllUsers);
app.patch('/users/:userId/password', adminChangePassword);
app.patch('/users/:userId/email', adminChangeEmail);
app.patch('/users/:userId/rights', grantAdminRights);
app.delete('/users/:userId', adminDeleteUser);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
