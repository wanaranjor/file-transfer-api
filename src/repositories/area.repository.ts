import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {Area, AreaRelations, Resource, User} from '../models';
import {ResourceRepository} from './resource.repository';
import {UserRepository} from './user.repository';

export class AreaRepository extends DefaultCrudRepository<
  Area,
  typeof Area.prototype.id,
  AreaRelations
> {

  public readonly resources: HasManyRepositoryFactory<Resource, typeof Area.prototype.id>;

  public readonly users: HasManyRepositoryFactory<User, typeof Area.prototype.id>;

  constructor(
    @inject('datasources.postgresql') dataSource: PostgresqlDataSource, @repository.getter('ResourceRepository') protected resourceRepositoryGetter: Getter<ResourceRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Area, dataSource);
    this.users = this.createHasManyRepositoryFactoryFor('users', userRepositoryGetter,);
    this.registerInclusionResolver('users', this.users.inclusionResolver);
    this.resources = this.createHasManyRepositoryFactoryFor('resources', resourceRepositoryGetter,);
    this.registerInclusionResolver('resources', this.resources.inclusionResolver);
  }
}
