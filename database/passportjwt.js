import Promise from 'bluebird'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import passportJWT from 'passport-jwt'

import localStrategy from 'passport-local'

import studentConfig from '../models/studentconfig.js'
import adminConfig from '../models/adminconfig.js'

const LocalStrategy = localStrategy.Strategy
const JWTStrategy = passportJWT.Strategy
const extractJWT = passportJWT.ExtractJwt

const secret_key = 'secret-cat'

const EXPIRE_TIME = '1h'
//ms 毫秒單位
const EXPIRE_SECOND = 60 * 60 * 1000

const checkPassword = async (user, inputPassword) => {
    let compareResult = false
    await bcrypt.compare(inputPassword, user.studentPassword)
        .then(result => {
            compareResult = result
        })
    return compareResult
}

const checkPasswordAdmin = async (user, inputPassword) => {
    let compareResult = false
    await bcrypt.compare(inputPassword, user.adminPassword)
        .then(result => {
            compareResult = result
        })
    return compareResult
}

passport.use('login', new LocalStrategy({ usernameField: 'studentId', passwordField: 'studentPassword' }, (username, password, done) => {
    studentConfig.findOne({ studentId: username, studentAccess: true })
        .then(async (user) => {
            if (user == null) {
                console.log('user error')
                done(null, { message: '無此用戶' })
            } else {
                let compareResult = false

                await checkPassword(user, password).then(response => {
                    if (response) {
                        compareResult = user
                    }
                })

                if (compareResult == false) {
                    console.log('password error')
                    done(null, { message: '帳號或密碼錯誤' })
                } else {
                    console.log('success')
                    console.log('user', user.studentId, 'get in at', new Date())
                    const returnUser = {
                        _id: user._id,
                        studentClass: user.studentClass,
                        studentId: user.studentId,
                        studentName: user.studentName,
                        studentChatRoomId: user.studentChatRoomId,
                    }
                    done(null, returnUser)
                }
            }

        })
}))

passport.use('admin-login', new LocalStrategy({ usernameField: 'adminId', passwordField: 'adminPassword' }, (username, password, done) => {
    adminConfig.findOne({ adminId: username })
        .then(async (user) => {
            if (user == null) {
                console.log('user error')
                done(null, { message: '無此用戶' })
            } else {
                let compareResult = false

                await checkPasswordAdmin(user, password).then(response => {
                    if (response) {
                        compareResult = user
                    }
                })

                if (compareResult == false) {
                    console.log('password error')
                    done(null, { message: '帳號或密碼錯誤' })
                } else {
                    console.log('success')
                    console.log('admin', user.adminId, 'get in at', new Date())
                    const returnUser = {
                        _id: user._id,
                        adminId: user.adminId,
                        adminName: user.adminName,
                    }
                    done(null, returnUser)
                }
            }

        })
}))


const cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) token = req.cookies['token'];
    return token;
};
const cookieExtractorAdmin = (req) => {
    let token = null;
    if (req && req.cookies) token = req.cookies['tokenADMIN'];
    return token;
}



passport.use('token', new JWTStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: secret_key,
    failureRedirect: '/',
    failureMessage: true
},
    (jwtPayload, done) => {
        studentConfig.findOne({ _id: jwtPayload._id, studentId: jwtPayload.studentId })
            .then(user => {
                const returnUser = {
                    _id: user._id,
                    studentClass: user.studentClass,
                    studentId: user.studentId,
                    studentName: user.studentName,
                    studentChatRoomId: user.studentChatRoomId,
                }
                done(null, returnUser)
            })
            .catch(err => {
                done(err)
            })
    }))
passport.use('admin-token', new JWTStrategy(
    {
        jwtFromRequest: cookieExtractorAdmin,
        secretOrKey: secret_key,
        failureRedirect: '/',
        failureMessage: true
    },
    (jwtPayload, done) => {
        adminConfig.findOne({ _id: jwtPayload._id, adminId: jwtPayload.adminId })
            .then(user => {
                const returnUser = {
                    _id: user._id,
                    adminId: user.adminId,
                    adminName: user.adminName,

                }
                done(null, returnUser)
            })
            .catch(err => {
                done(err)
            })
    }))

const signIn = (req, res) => {
    if (req.user._id == undefined) {
        res.json({
            message: req.user.message,
            status: 401
        })
    } else {
        const token = jwt.sign({ _id: req.user._id.toString(), studentId: req.user.studentId.toString() }, secret_key, { expiresIn: EXPIRE_TIME })
        // res.setHeader('Authorization',token).redirect(`/home/${req.user.studentId}`)
        res.cookie('token', token, { maxAge: EXPIRE_SECOND }).cookie('studentId', req.user.studentId, { maxAge: EXPIRE_SECOND }).json({
            studentId: req.user.studentId,
            studentClass: req.user.studentClass,
            status: 200
        })
        // res.setHeader('token', token).redirect(`/home/${req.user.studentId}`)
    }
}

const signInAdmin = (req, res) => {
    if (req.user._id == undefined) {
        res.json({
            message: req.user.message,
            status: 401,
        })
    } else {
        const token = jwt.sign({ _id: req.user._id.toString(), adminId: req.user.adminId.toString() }, secret_key, { expiresIn: EXPIRE_TIME })
        // res.setHeader('Authorization',token).redirect(`/home/${req.user.studentId}`)
        res.cookie('tokenADMIN', token, { maxAge: EXPIRE_SECOND }).cookie('adminId', req.user.adminId, { maxAge: EXPIRE_SECOND }).json({
            adminId: req.user.adminId,
            status: 200
        })
    }
}

export { signIn, signInAdmin, passport } 