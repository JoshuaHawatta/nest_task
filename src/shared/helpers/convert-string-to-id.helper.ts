import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';
import Exception from '../../enums/exception.enum';

/**
 * Recives N numbers of strings and return an array of one or many MongoDB ObjectId
 * @param strings
 * @throws HttpException
 * @returns Types.ObjectId[]
 */
const convertStringToId = (...strings: string[]): Types.ObjectId[] => {
  for (const string of strings) {
    const isValidId = Types.ObjectId.isValid(string);

    if (!isValidId)
      throw new HttpException(
        Exception.INVALID_FIELD,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
  }

  return strings.map((ids) => new Types.ObjectId(ids));
};

export default convertStringToId;
