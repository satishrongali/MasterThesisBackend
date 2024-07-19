const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    sessions: [{
        token: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Number,
            required: true
        }
    }]
});

// Hash the password before saving
UserSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

// Compare hashed passwords
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Generate an access auth token (method)
UserSchema.methods.generateAccessAuthToken = function () {
    const user = this;
    const accessToken = jwt.sign({ _id: user._id.toHexString() }, process.env.JWT_SECRET, { expiresIn: '15m' });
    return Promise.resolve(accessToken);
};

// Generate a refresh auth token (method)
UserSchema.methods.generateRefreshAuthToken = function () {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (err) reject(err);
            const token = buf.toString('hex');
            return resolve(token);
        });
    });
};

// Create a session (instance method)
UserSchema.methods.createSession = function () {
    let user = this;
    return user.generateRefreshAuthToken().then((refreshToken) => {
        return saveSessionToDatabase(user, refreshToken);
    }).then((refreshToken) => {
        return refreshToken;
    }).catch((err) => {
        return Promise.reject('Failed to save session to database.\n' + err);
    });
};

// Static method to find user by credentials
UserSchema.statics.findByCredentials = function (email, password) {
    let User = this;
    return User.findOne({ email }).then((user) => {
        if (!user) return Promise.reject('Login user failed');
        return user.comparePassword(password).then((isMatch) => {
            if (!isMatch) return Promise.reject('Login users failed');
            return user;
        });
    });
};

// Static method to find user by ID and token
UserSchema.statics.findByIdAndToken = function (_id, token) {
    const User = this;
    return User.findOne({
        _id,
        'sessions.token': token
    });
};

// Check if the refresh token has expired
UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
    let secondsSinceEpoch = Date.now() / 1000;
    return expiresAt < secondsSinceEpoch;
};

let saveSessionToDatabase = (user, refreshToken) => {
    return new Promise((resolve, reject) => {
        let expiresAt = generateRefreshTokenExpiryTime();

        user.sessions.push({ token: refreshToken, expiresAt });

        user.save().then(() => {
            return resolve(refreshToken);
        }).catch((err) => {
            return reject(err);
        });
    });
};

let generateRefreshTokenExpiryTime = () => {
    let daysUntilExpire = "10";
    let secondsUntilExpire = ((daysUntilExpire * 24) * 60) * 60;
    return ((Date.now() / 1000) + secondsUntilExpire);
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };
