import Promise from 'bluebird'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import passportJWT from 'passport-jwt'

import localStrategy from 'passport-local'

import studentConfig from '../models/studentconfig.js'

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
                    const returnUser = {
                        _id: user._id,
                        studentClass: user.studentClass,
                        studentId: user.studentId,
                        studentName: user.studentName,
                    }
                    done(null, returnUser)
                }
            }

        })
}))


let cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) token = req.cookies['token'];
    return token;
};
let opts = {}
opts.jwtFromRequest = cookieExtractor
opts.secretOrKey = secret_key
opts.failureRedirect = '/'
opts.failureMessage = true


passport.use('token', new JWTStrategy(opts,
    (jwtPayload, done) => {
        console.log('user', jwtPayload.studentId, 'get in at', new Date())
        studentConfig.findOne({ _id: jwtPayload._id, studentId: jwtPayload.studentId })
            .then(user => {
                const returnUser = {
                    _id: user._id,
                    studentClass: user.studentClass,
                    studentId: user.studentId,
                    studentName: user.studentName,
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
            token: token,
            status: 200
        })
        // res.setHeader('token', token).redirect(`/home/${req.user.studentId}`)
    }
}

export { signIn, passport } 