import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  Area, User
} from '../models';
import {UserRepository} from '../repositories';

export class UserAreaController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @get('/users/{id}/area', {
    responses: {
      '200': {
        description: 'Area belonging to User',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Area)},
          },
        },
      },
    },
  })
  async getArea(
    @param.path.string('id') id: typeof User.prototype.id,
  ): Promise<Area> {
    return this.userRepository.area(id);
  }
}
