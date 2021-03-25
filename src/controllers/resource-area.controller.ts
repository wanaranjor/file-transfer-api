import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  Area, Resource
} from '../models';
import {ResourceRepository} from '../repositories';

export class ResourceAreaController {
  constructor(
    @repository(ResourceRepository)
    public resourceRepository: ResourceRepository,
  ) { }

  @get('/resources/{id}/area', {
    responses: {
      '200': {
        description: 'Area belonging to Resource',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Area)},
          },
        },
      },
    },
  })
  async getArea(
    @param.path.string('id') id: typeof Resource.prototype.id,
  ): Promise<Area> {
    return this.resourceRepository.area(id);
  }
}
