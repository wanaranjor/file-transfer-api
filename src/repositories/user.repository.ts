import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasOneRepositoryFactory, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {Area, User, UserCredentials, UserRelations, Resource} from '../models';
import {AreaRepository} from './area.repository';
import {UserCredentialsRepository} from './user-credentials.repository';
import {ResourceRepository} from './resource.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly area: BelongsToAccessor<Area, typeof User.prototype.id>;

  public readonly userCredentials: HasOneRepositoryFactory<UserCredentials, typeof User.prototype.id>;

  public readonly resources: HasManyRepositoryFactory<Resource, typeof User.prototype.id>;

  constructor(
    @inject('datasources.postgresql') dataSource: PostgresqlDataSource, @repository.getter('AreaRepository') protected areaRepositoryGetter: Getter<AreaRepository>, @repository.getter('UserCredentialsRepository') protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>, @repository.getter('ResourceRepository') protected resourceRepositoryGetter: Getter<ResourceRepository>,
  ) {
    super(User, dataSource);
    this.resources = this.createHasManyRepositoryFactoryFor('resources', resourceRepositoryGetter,);
    this.registerInclusionResolver('resources', this.resources.inclusionResolver);
    this.userCredentials = this.createHasOneRepositoryFactoryFor('userCredentials', userCredentialsRepositoryGetter);
    this.registerInclusionResolver('userCredentials', this.userCredentials.inclusionResolver);
    this.area = this.createBelongsToAccessorFor('area', areaRepositoryGetter,);
    this.registerInclusionResolver('area', this.area.inclusionResolver);
  }
  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
