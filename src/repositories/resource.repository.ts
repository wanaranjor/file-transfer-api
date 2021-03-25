import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {Resource, ResourceRelations, Area} from '../models';
import {AreaRepository} from './area.repository';

export class ResourceRepository extends DefaultCrudRepository<
  Resource,
  typeof Resource.prototype.id,
  ResourceRelations
> {

  public readonly area: BelongsToAccessor<Area, typeof Resource.prototype.id>;

  constructor(
    @inject('datasources.postgresql') dataSource: PostgresqlDataSource, @repository.getter('AreaRepository') protected areaRepositoryGetter: Getter<AreaRepository>,
  ) {
    super(Resource, dataSource);
    this.area = this.createBelongsToAccessorFor('area', areaRepositoryGetter,);
    this.registerInclusionResolver('area', this.area.inclusionResolver);
  }
}
