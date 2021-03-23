import {inject} from '@loopback/core';
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
import {UploadFilesKeys} from '../keys/upload-file-keys';
import {Resource} from '../models';

const readdir = promisify(fs.readdir);

/**
 * A controller to handle file downloads using multipart/form-data media type
 */
export class FileDownloadController {

  constructor() { }

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
    console.log(folderPath)
    const files = await readdir(folderPath);
    return files;
  }

  @get('/files/{filename}')
  @oas.response.file()
  downloadFile(
    @param.path.string('filename') fileName: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const file = this.validateFileName(fileName);
    response.download(file, fileName);
    return response;
  }

  /**
   *
   * @param type
   * @param recordId
   * @param response
   */
  // @get('/files/{type}/{recordId}')
  // @oas.response.file()
  // async downloadFile(
  //   @param.path.string('type') type: string,
  //   @param.path.number('recordId') recordId: number,
  //   @inject(RestBindings.Http.RESPONSE) response: Response,
  // ) {
  //   const folder = this.getFolderPathByType(type);
  //   const fileName = await this.getFilenameById(type, recordId);
  //   const file = this.validateFileName(folder, fileName);
  //   response.download(file, fileName);
  //   return response;
  // }

  /**
   * Get the folder when files are uploaded by type
   * @param type
   */
  private getFolderPathByType(type: string) {
    let filePath = '';
    switch (type) {
      case "telem":
        filePath = path.join(__dirname, UploadFilesKeys.TELEM_FILE_PATH);
        break;
    }
    return filePath;
  }

  /**
   *
   * @param type
   */
  private async getFilenameById(type: string, recordId: number) {
    let fileName = '';
    switch (type) {
      case "telem":
        // eslint-disable-next-line no-case-declarations
        const resource: Resource = await this.ResourceRepository.findById(recordId);
        fileName = resource.fileUrl ?? '';
        break;
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
