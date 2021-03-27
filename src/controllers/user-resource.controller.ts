import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Resource, User
} from '../models';
import {UserRepository} from '../repositories';

@authenticate('jwt')
export class UserResourceController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/resources', {
    responses: {
      '200': {
        description: 'Array of User has many Resource',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Resource)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Resource>,
  ): Promise<Resource[]> {
    return this.userRepository.resources(id).find(filter);
  }

  @post('/users/{id}/resources', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Resource)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Resource, {
            title: 'NewResourceInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) resource: Omit<Resource, 'id'>,
  ): Promise<Resource> {
    return this.userRepository.resources(id).create(resource);
  }

  @patch('/users/{id}/resources', {
    responses: {
      '200': {
        description: 'User.Resource PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Resource, {partial: true}),
        },
      },
    })
    resource: Partial<Resource>,
    @param.query.object('where', getWhereSchemaFor(Resource)) where?: Where<Resource>,
  ): Promise<Count> {
    return this.userRepository.resources(id).patch(resource, where);
  }

  @del('/users/{id}/resources', {
    responses: {
      '200': {
        description: 'User.Resource DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Resource)) where?: Where<Resource>,
  ): Promise<Count> {
    return this.userRepository.resources(id).delete(where);
  }
}
