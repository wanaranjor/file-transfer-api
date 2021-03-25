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
  Area,
  Resource
} from '../models';
import {AreaRepository} from '../repositories';

export class AreaResourceController {
  constructor(
    @repository(AreaRepository) protected areaRepository: AreaRepository,
  ) { }

  @get('/areas/{id}/resources', {
    responses: {
      '200': {
        description: 'Array of Area has many Resource',
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
    return this.areaRepository.resources(id).find(filter);
  }

  @post('/areas/{id}/resources', {
    responses: {
      '200': {
        description: 'Area model instance',
        content: {'application/json': {schema: getModelSchemaRef(Resource)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Area.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Resource, {
            title: 'NewResourceInArea',
            exclude: ['id'],
            optional: ['areaId']
          }),
        },
      },
    }) resource: Omit<Resource, 'id'>,
  ): Promise<Resource> {
    return this.areaRepository.resources(id).create(resource);
  }

  @patch('/areas/{id}/resources', {
    responses: {
      '200': {
        description: 'Area.Resource PATCH success count',
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
    return this.areaRepository.resources(id).patch(resource, where);
  }

  @del('/areas/{id}/resources', {
    responses: {
      '200': {
        description: 'Area.Resource DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Resource)) where?: Where<Resource>,
  ): Promise<Count> {
    return this.areaRepository.resources(id).delete(where);
  }
}
