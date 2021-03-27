import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,
  patch, post,
  put,
  requestBody,
  response
} from '@loopback/rest';
import {Resource} from '../models';
import {ResourceRepository} from '../repositories';

@authenticate('jwt')
export class ResourceController {
  constructor(
    @repository(ResourceRepository)
    public resourceRepository: ResourceRepository,
  ) { }

  @post('/resources')
  @response(200, {
    description: 'Resource model instance',
    content: {'application/json': {schema: getModelSchemaRef(Resource)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Resource, {
            title: 'NewResource',
            exclude: ['id'],
          }),
        },
      },
    })
    resource: Omit<Resource, 'id'>,
  ): Promise<Resource> {
    return this.resourceRepository.create(resource);
  }

  @get('/resources/count')
  @response(200, {
    description: 'Resource model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Resource) where?: Where<Resource>,
  ): Promise<Count> {
    return this.resourceRepository.count(where);
  }

  @get('/resources')
  @response(200, {
    description: 'Array of Resource model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Resource, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Resource) filter?: Filter<Resource>,
  ): Promise<Resource[]> {
    return this.resourceRepository.find(filter);
  }

  @patch('/resources')
  @response(200, {
    description: 'Resource PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Resource, {partial: true}),
        },
      },
    })
    resource: Resource,
    @param.where(Resource) where?: Where<Resource>,
  ): Promise<Count> {
    return this.resourceRepository.updateAll(resource, where);
  }

  @get('/resources/{id}')
  @response(200, {
    description: 'Resource model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Resource, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Resource, {exclude: 'where'}) filter?: FilterExcludingWhere<Resource>
  ): Promise<Resource> {
    return this.resourceRepository.findById(id, filter);
  }

  @patch('/resources/{id}')
  @response(204, {
    description: 'Resource PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Resource, {partial: true}),
        },
      },
    })
    resource: Resource,
  ): Promise<void> {
    await this.resourceRepository.updateById(id, resource);
  }

  @put('/resources/{id}')
  @response(204, {
    description: 'Resource PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() resource: Resource,
  ): Promise<void> {
    await this.resourceRepository.replaceById(id, resource);
  }

  @del('/resources/{id}')
  @response(204, {
    description: 'Resource DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.resourceRepository.deleteById(id);
  }
}
