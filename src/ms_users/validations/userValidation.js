import { object, string } from 'joi';

const createUserSchema = object({
    name: string().required(),
    email: string().email().required(),
    password: string().min(6).required(),
});

export default { createUserSchema };