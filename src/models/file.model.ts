import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Area} from './area.model';

@model()
export class File extends Entity {
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
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  extension: string;

  @property({
    type: 'number',
    required: true,
  })
  size: number;

  @belongsTo(() => Area)
  areaId: number;

  constructor(data?: Partial<File>) {
    super(data);
  }
}

export interface FileRelations {
  // describe navigational properties here
}

export type FileWithRelations = File & FileRelations;
