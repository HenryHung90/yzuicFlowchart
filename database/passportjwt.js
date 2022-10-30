import Promise from 'bluebird'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import passportJWT from 'passport-jwt'

import localStrategy from 'passport-local'

import studentConfig from '../models/studentconifg.js'

const LocalStrategy = localStrategy.Strategy
const JWTStrategy = passportJWT.Strategy
const extractJWT = passportJWT.ExtractJwt

const secret_key = 'secret-cat'

const EXPRIE_SECOND = 10
const EXPIRE_MIN = 1
const EXPIRE_TIME = EXPIRE_MIN * EXPRIE_SECOND * 1000

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

passport.use('token', new JWTStrategy({
    jwtFromRequest: extractJWT.fromExtractors([
        extractJWT.versionOneCompatibility({ authScheme: 'Bearer' }),
    ]),
    secretOrKey: secret_key
},
    (jwtPayload, done) => {
        console.log('user', jwtPayload, 'get')
        studentConfig.findOne({ _id: jwtPayload._id })
            .then(user => {
                done(null, user)
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
        const token = jwt.sign({ _id: req.user._id.toString(), expiresIn: EXPIRE_TIME }, secret_key)
        res.setHeader('Authorization', 'Bearer ' + token).json({
            userId: req.user.studentId,
            status: 200,
        })
    }
}

export { signIn, passport } 