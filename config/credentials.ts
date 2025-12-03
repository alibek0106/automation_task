import dotenv from 'dotenv';
dotenv.config();

export const credentials = {
    username: process.env.GURU_USERNAME || '',
    password: process.env.GURU_PASSWORD || '',
};