import { getRepository } from 'typeorm';
import { Request, Response } from "express";
import { User } from "../entity/User";
import * as jwt from 'jsonwebtoken';
import config from "../config/config";
import { validate } from 'class-validator';

class AuthController {

    static login = async (req: Request, res: Response) => {
        const { username, password } = req.body;
        if (!(username && password)) {
            res.status(400).json({ message: 'User y pass es requerido' });
        }

        const userRepository = getRepository(User);
        let user: User;

        try {

            user = await userRepository.findOneOrFail({ where: { username } })
        } catch (error) {
            return res.status(400).json({ message: 'User o pass incorecto' })
        }

        if (!user.checkPassword(password)) {
            res.status(400).json({ message: 'No pass' })
        }
        const token = jwt.sign({ userId: user.id, username: user.username }, config.jwtSecret, { expiresIn: '1h' })
        res.json({ message: 'ok', token })
    }

    static changePassword = async (req: Request, res: Response) => {
        const { userId } = res.locals.jwtPayload;
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) {
            res.status(400).json({ message: 'oldPass and newPass are required' })
        }
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(userId);
        } catch (error) {
            res.status(400).json({ message: 'somenthing goes wrong!' });
        }

        if (!user.checkPassword(oldPassword)) {
            res.status(401).json({ message: 'check your old password' });
        }

        user.password = newPassword;
        const validationOp = { validationError: { target: false, value: false } };
        const errors = await validate(user, validationOp);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }
        //haspassword
        user.hashPassword();
        userRepository.save(user);
        res.json({message:'Password change!'})
    };
}

export default AuthController;