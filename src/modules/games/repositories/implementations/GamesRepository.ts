import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;
  private userRepository: Repository<User>;

  constructor() {
    this.repository = getRepository(Game);
    this.userRepository = getRepository(User);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
    .createQueryBuilder("games")
    .where("LOWER(games.title) LIKE LOWER(:name)", { name:`%${param}%` })
    .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const count = await this.repository.count();
    return [{count: count.toString()}];
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const users = await this.userRepository
    .createQueryBuilder('users')
    .innerJoinAndSelect("users.games", "games")
    .where('games.id = :id', {id})
    .getMany();
    return users;
  }
}
