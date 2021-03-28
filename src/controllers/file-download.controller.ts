import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  HttpErrors,
  oas,
  param,
  Response,
  RestBindings
} from '@loopback/rest';
import fs from 'fs';
import path from 'path';
import {promisify} from 'util';
import {UploadFilesKeys} from '../keys';
import {AreaRepository, ResourceRepository, UserRepository} from '../repositories';

const readdir = promisify(fs.readdir);

/**
 * A controller to handle file downloads using multipart/form-data media type
 */
@authenticate('jwt')
export class FileDownloadController {

  constructor(@repository(ResourceRepository)
  private resourceRepository: ResourceRepository,
    @repository(AreaRepository)
    private areaRepository: AreaRepository,
    @repository(UserRepository)
    private userRepository: UserRepository) { }

  /**
   *
   * @param type
   * @param id
   */

  @get('/files/{type}', {
    responses: {
      200: {
        content: {
          // string[]
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        description: 'A list of files',
      },
    },
  })
  async listFiles(
    @param.path.string('type') type: string,) {
    const folderPath = this.getFolderPathByType(type);
    const files = await readdir(folderPath);
    return files;
  }
  /**
   *
   * @param type
   * @param recordId
   * @param response
   */

  @get('/files/{type}/{recordId}')
  @oas.response.file()
  async downloadFile(
    @param.path.string('type') type: string,
    @param.path.string('recordId') recordId: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const folder = this.getFolderPathByType(type);
    const fileName = await this.getFilenameById(type, recordId);
    const file = this.validateFileName(folder, fileName);
    response.download(file, fileName);
    return response;
  }

  /**
   * Get the folder when files are uploaded by type
   * @param type
   */
  private getFolderPathByType(type: string) {
    let filePath = '';
    filePath = path.join(__dirname, UploadFilesKeys.FOLDER_UPLOADS + type);
    return filePath;
  }

  /**
   *
   * @param type
   */
  private async getFilenameById(type: string, recordId: string) {
    let fileName = '';
    const resource = await this.resourceRepository.findOne({
      where: {fileUrl: recordId},
      include: ['area']
    });
    if (resource) {
      const user = await this.userRepository.findById(resource.userId);
      const area = await this.areaRepository.findById(resource.areaId);
      // Verifico si el usuario pertenece al area de donde pertenece el recurso
      if (area.id === user.areaId) {
        fileName = resource.fileUrl ?? '';
      } else {
        throw new HttpErrors[400](`Unable to download file: /${type}/${resource.fileUrl}`);
      }
    }
    return fileName;
  }
  /**
   * Validate file names to prevent them goes beyond the designated directory
   * @param fileName - File name
   */
  private validateFileName(folder: string, fileName: string) {
    const resolved = path.resolve(folder, fileName);
    if (resolved.startsWith(folder)) return resolved;
    // The resolved file is outside sandbox
    throw new HttpErrors[400](`Invalid file name: ${fileName}`);
  }

}
