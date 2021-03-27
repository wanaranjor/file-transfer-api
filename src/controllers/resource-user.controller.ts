import {authenticate} from '@loopback/authentication';
import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  Resource,
  User
} from '../models';
import {ResourceRepository} from '../repositories';

@authenticate('jwt')
export class ResourceUserController {
  constructor(
    @repository(ResourceRepository)
    public resourceRepository: ResourceRepository,
  ) { }

  @get('/resources/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Resource',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Resource.prototype.id,
  ): Promise<User> {
    return this.resourceRepository.user(id);
  }
}
