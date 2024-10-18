import db from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import hashPassword from '../utils/hashPassword.js';
import matchPasswords from '../utils/matchPasswords.js';
import validateEmail from '../utils/validateEmail.js';
import validatePassword from '../utils/validatePassword.js';

const User = db.users;

const userControllers = {
    getRegisterForm: (req, res) => {
        res.status(200).render('register-form');
    },
    register: async (req, res) => {
        const { email, password, rePassword } = req.body;
        const userExist = await User.findOne({ where: { email: email } });

        if (userExist) {
            return res.status(400).render('404', {
                title: 'Your email already exists',
                message: 'Your email already exists. Please login.'
            });
        }
        //validate email, password and check if passwords match
        const isValidEmail = validateEmail(email);
        const isValidPassword = validatePassword(password);
        const doPasswordsMatch = matchPasswords(password, rePassword);

        if (isValidEmail && isValidPassword && doPasswordsMatch) {
            //hash password
            const passwordHashed = hashPassword(password);

            //create user
            const newUser = await User.create({
                email: email,
                password: passwordHashed
            });
            res.status(302).redirect('/api/login');
        } else {
            res.status(400).render('404', {
                title: 'Email or password is not correct',
                message: 'Email or password is not correct'
            });
        }
    },
    getLoginForm: (req, res) => {
        res.status(200).render('login-form');
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        const userExist = await User.findOne({ where: { email: email } });

        if (!userExist) {
            return res.status(400).render('404', {
                title: 'Email does not exist',
                message: 'Email does not exist. Please register.'
            });
        }

        //save user id as a cookie (needed while adding user_id while creating a new book)
        res.cookie('userId', userExist.id);

        //check if the password is correct
        bcrypt.compare(password, userExist.password, (err, isValid) => {
            if (err) {
                console.error(err);
            }
            if (!isValid) {
                return res.status(400).render('404', {
                    title: 'Incorrect email or password',
                    message: 'Incorrect email or password'
                });
            }
            //create token
            const token = jwt.sign(
                { email: userExist.email },
                process.env.TOKEN_SECRET
            );
            //cookies
            res.cookie('token', token, { httpOnly: true });
            res.status(302).redirect('/api/books');
        });
    },
    logout: (req, res) => {
        res.clearCookie('token');
        res.status(302).redirect('/api/books');
    }
};

export default userControllers;
