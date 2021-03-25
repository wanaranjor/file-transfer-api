import {Entity, hasMany, model, property} from '@loopback/repository';
import {Resource} from './resource.model';
import {User} from './user.model';

@model()
export class Area extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

  @hasMany(() => Resource)
  resources: Resource[];

  @hasMany(() => User)
  users: User[];

  constructor(data?: Partial<Area>) {
    super(data);
  }
}

export interface AreaRelations {
  // describe navigational properties here
}

export type AreaWithRelations = Area & AreaRelations;
