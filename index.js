const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

app.use(cors());
app.use(express.json());

const options = {
    swaggerDefinition: {
        openapi: "3.0.1",
        info: {
            title: "TaskManager in swagger",
            version: "1.0.0",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    in: "header",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["index.js"],
};

const swaggerSpecs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
    res.header('Access-Control-Expose-Headers', 'x-access-token, x-refresh-token');
    next();
});

const authenticate = require('./middleware/authenticate');
const verifySession = require('./middleware/verifySession');
const { registerUser, loginUser, refreshAccessToken, updateUserProfile, changeUserPassword, deleteUser } = require('./userFunctions');
const { getAllLists, createList, updateList, deleteList } = require('./listFunctions');
const { getTasksInList, createTaskInList, updateTask, deleteTask } = require('./taskFunctions');
const { getAllUsers, adminChangePassword, adminChangeEmail, grantAdminRights, adminDeleteUser } = require('./adminFunctions');

// User routes
app.post('/users', registerUser);
app.post('/users/login', loginUser);
app.get('/users/me/access-token', verifySession, (req, res) => {
    req.userObject.generateAccessAuthToken().then(accessToken => {
      res.header('Authorization', `Bearer ${accessToken}`).send({ accessToken });
    }).catch(e => res.status(400).send(e));
  });
app.patch('/user', authenticate, updateUserProfile);
app.put('/user/password', authenticate, changeUserPassword);
app.delete('/user', authenticate, deleteUser);

// List routes
app.get('/lists', authenticate, getAllLists);
app.post('/lists', authenticate, createList);
app.patch('/lists/:id', authenticate, updateList);
app.delete('/lists/:id', authenticate, deleteList);

// Task routes
app.get('/lists/:listId/tasks', authenticate, getTasksInList);
app.post('/lists/:listId/tasks', authenticate, createTaskInList);
app.patch('/lists/:listId/tasks/:taskId', authenticate, updateTask);
app.delete('/lists/:listId/tasks/:taskId', authenticate, deleteTask);

// Admin routes
app.get('/users', authenticate, getAllUsers);
app.put('/admin/users/:userId/change-password', authenticate, adminChangePassword);
app.put('/admin/users/:userId/change-email', authenticate, adminChangeEmail);
app.post('/admin/users/:userId/make-admin', authenticate, grantAdminRights);
app.delete('/admin/users/:userId/delete-user', authenticate, adminDeleteUser);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
