import {inject} from '@loopback/core';
import {
  HttpErrors,
  post,
  Request,
  requestBody,
  Response,
  RestBindings
} from '@loopback/rest';
import multer from 'multer';
import path from 'path';
import {UploadFilesKeys} from '../keys/upload-file-keys';

/**
 * A controller to handle file uploads using multipart/form-data media type
 */
export class FileUploadController {
  constructor() { }

  @post('/telem-file', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Telem Upload File',
      },
    },
  })
  async telemFileUpload(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const telemFilePath = path.join(__dirname, UploadFilesKeys.TELEM_FILE_PATH);
    const fieldname = UploadFilesKeys.FILE_FIELDNAME;
    const acceptedExt = UploadFilesKeys.FILE_ACCEPTED_EXT;
    const res = await this.storeFileToPath(telemFilePath, fieldname, request, response, acceptedExt);
    if (res) {
      const filename = response.req?.file.filename;
      if (filename) {
        return {filename: filename};
      }
    }
    return res;
  }

  private getMulterStorageConfig(storePath: string) {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, storePath)
      },
      filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`
        cb(null, filename);
      }
    });
    return storage;
  }

  /**
   * store the file in a specific path
   * @param storePath
   * @param request
   * @param response
   */
  private storeFileToPath(storePath: string, fieldname: string, request: Request, response: Response, acceptedExt: string[]): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      const storage = this.getMulterStorageConfig(storePath);
      const upload = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
          const ext = path.extname(file.originalname).toLowerCase();
          if (acceptedExt.includes(ext)) {
            return cb(null, true);
          }
          return cb(new HttpErrors[400]('This format file is not supported.'));
        },
        limits: {
          fileSize: UploadFilesKeys.MAX_FILE_SIZE
        }
      },
      ).single(fieldname);
      upload(request, response, (err: string) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }
}
