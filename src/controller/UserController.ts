import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import * as yup from 'yup';
import { AppError } from "../errors/AppError";

import { UsersRepository } from "../repositories/UsersRepository";

class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required('Nome é obrigatório'),
      email: yup.string().email('Insira um e-mail válido').required('E-mail é obrigatório')
    });
    
    try {
      await schema.validate(request.body, {abortEarly: false});
    }
    catch (err) {
      return response.status(400).send({message: err.errors});
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const alreadyExists = await usersRepository.findOne({
      email
    });

    if (alreadyExists) {
      throw new AppError('User already exists');
    }

    const user = usersRepository.create({
      name, email
    });

    await usersRepository.save(user);

    return response.status(201).json(user);
  }
}

export { UserController };
