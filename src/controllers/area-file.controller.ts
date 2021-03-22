import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Area,
  File,
} from '../models';
import {AreaRepository} from '../repositories';

export class AreaFileController {
  constructor(
    @repository(AreaRepository) protected areaRepository: AreaRepository,
  ) { }

  @get('/areas/{id}/files', {
    responses: {
      '200': {
        description: 'Array of Area has many File',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(File)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<File>,
  ): Promise<File[]> {
    return this.areaRepository.files(id).find(filter);
  }

  @post('/areas/{id}/files', {
    responses: {
      '200': {
        description: 'Area model instance',
        content: {'application/json': {schema: getModelSchemaRef(File)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Area.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(File, {
            title: 'NewFileInArea',
            exclude: ['id'],
            optional: ['areaId']
          }),
        },
      },
    }) file: Omit<File, 'id'>,
  ): Promise<File> {
    return this.areaRepository.files(id).create(file);
  }

  @patch('/areas/{id}/files', {
    responses: {
      '200': {
        description: 'Area.File PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(File, {partial: true}),
        },
      },
    })
    file: Partial<File>,
    @param.query.object('where', getWhereSchemaFor(File)) where?: Where<File>,
  ): Promise<Count> {
    return this.areaRepository.files(id).patch(file, where);
  }

  @del('/areas/{id}/files', {
    responses: {
      '200': {
        description: 'Area.File DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(File)) where?: Where<File>,
  ): Promise<Count> {
    return this.areaRepository.files(id).delete(where);
  }
}
