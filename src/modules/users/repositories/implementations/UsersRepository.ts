import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne({where: {id: user_id}, relations: ['games']})
    if(!user){
      throw new Error('User not found');
    }
    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return await this.repository.find({order:{first_name: 'ASC'}});
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const users = await this.repository
    .createQueryBuilder("users")
    .where("LOWER(users.first_name) LIKE LOWER(:name) AND LOWER(users.last_name) LIKE LOWER(:last_name)", { name:`%${first_name}%`, last_name: `%${last_name}%` })
    .getMany();
    
    return users;
  }
}
