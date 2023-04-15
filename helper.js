const db = require("./db.js")
const bcrypt = require("bcryptjs")

const emailExists = async (email) => { 
    try {
        const user = await db.one("SELECT * FROM usuarios WHERE email=$1", email);       
        return user;
    } 
    catch(e) {
       return false;
    }
};


const createUser = async (email, password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    try {
    const user = await db.one("INSERT INTO usuarios(email, password) VALUES ($1, $2) RETURNING id, email, password", [email, hash]);
    console.log(user);
    return user;
    }
    catch(e) {
        console.log(e);
        return false;
     }
};

const matchPassword = async (password, hashPassword) => {
    const match = await bcrypt.compare(password, hashPassword);
    return match;
};

module.exports = { emailExists, createUser, matchPassword };
