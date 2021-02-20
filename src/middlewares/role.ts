import { getRepository } from "typeorm";
import { Request, Response, NextFunction } from "express";
import { User } from "../entity/User";

export const checkRole = (roles: Array<string>) => {

    return async (req: Request, res: Response, next: NextFunction) => {

        const { userId } = res.locals.jwtPayload;
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(userId);
        } catch (error) {
            return res.status(401).json({ message: 'no autorizado admin1' });
        }
        console.log('USER->', user);

        //Check
        const { role } = user;
        if (roles.includes(role)) {
            next();
        } else {
            return res.status(401).json({ message: 'no autorizado admin2' });
        }

    }
}