import pool from '../models/db.js';
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getUser = async (id) => {
    const userId = Number(id);
    if (Number.isNaN(userId)) {
        throw new Error('Invalid id');
    }
    const [rows] = await pool.query('SELECT * FROM tblusers WHERE id = ?', [userId]);
    return rows[0] ?? null;
}

export const createUser = async (role, password) => {  
    if (!role || !['owner', 'staff'].includes(role)) {  
        throw new Error('Invalid role. Must be "owner" or "staff"');
    }

    const [rows] = await pool.query(
        "SELECT * FROM tblusers WHERE role = ?",
        [role]
    );

    if (rows.length > 0 && role === 'owner') { 
        const error = new Error(`An owner account already exists.`);
        error.statusCode = 400;
        throw error;
    }

    if (!password || password === '') {
        throw new Error('Invalid password');
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error('Password too weak.');
    }

    const salt = bcrypt.genSaltSync(10);
    const newPassword = bcrypt.hashSync(password, salt);

    const [result] = await pool.query(
        "INSERT INTO tblusers(role, password) VALUES(?, ?)",  
        [role, newPassword]
    );

    return result.insertId;
}

export const login = async (role, password) => {  
    if (!role || !password) {
        throw new Error('Role and Password are required');
    }

    const [user] = await pool.query(
        "SELECT * FROM tblusers WHERE role = ?",  
        [role]
    );
    
    if (user.length === 0) {
        throw new Error(`No account with role: ${role} exists.`);
    }

    if (!bcrypt.compareSync(password, user[0].password)) {
        throw new Error('Incorrect password');
    }

    const token = jwt.sign(
        { 
            id: user[0].id,
            role: user[0].role  
        }, 
        process.env.SECRET,
        { expiresIn: '1d' }
    );

    return {
        token,
        user: {
            id: user[0].id,
            role: user[0].role,
            created_at: user[0].created_at
        }
    };
}


