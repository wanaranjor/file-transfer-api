import {Entity, model, property} from '@loopback/repository';

@model()
export class Resource extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

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
  area: string;

  @property({
    type: 'string',
    required: true,
  })
  fileUrl: string;

  constructor(data?: Partial<Resource>) {
    super(data);
  }
}

export interface ResourceRelations {
  // describe navigational properties here
}

export type ResourceWithRelations = Resource & ResourceRelations;
