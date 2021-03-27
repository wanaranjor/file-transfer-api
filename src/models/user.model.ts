import {belongsTo, Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Area} from './area.model';
import {Resource} from './resource.model';
import {UserCredentials} from './user-credentials.model';

@model()
export class User extends Entity {
  // must keep it
  // add id:string<UUID>
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @property({
    type: 'string',
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  responsable: string;

  @property({
    type: 'string',
    required: true,
  })
  role: string;

  @property({
    type: 'date',
    required: true,
  })
  createdAt?: string;

  @hasMany(() => Resource)
  resources: Resource[];
  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  @belongsTo(() => Area)
  areaId: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
