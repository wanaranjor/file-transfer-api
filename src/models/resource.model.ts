import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Area} from './area.model';
import {User} from './user.model';

@model()
export class Resource extends Entity {
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
  fileName: string;

  @property({
    type: 'string',
    required: true,
  })
  fileType: string;

  @property({
    type: 'number',
    required: true,
  })
  fileSize: number;

  @property({
    type: 'string',
    required: true,
  })
  fileUrl: string;

  @property({
    type: 'string',
  })
  message: string;

  @property({
    type: 'date',
    required: true,
  })
  createdAt?: string;

  @belongsTo(() => Area)
  areaId: string;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Resource>) {
    super(data);
  }
}

export interface ResourceRelations {
  // describe navigational properties here
}

export type ResourceWithRelations = Resource & ResourceRelations;
