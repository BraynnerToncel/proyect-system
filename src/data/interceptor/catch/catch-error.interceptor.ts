import { ICatchBodyResponse } from '@interface/catch/catch.interfaces';
import { NotAcceptableException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CannotCreateEntityIdMapError,
  EntityNotFoundError,
  EntityPropertyNotFoundError,
  QueryFailedError,
  UpdateValuesMissingError,
} from 'typeorm';
// Objeto que mapea diferentes tipos de excepciones a funciones de manejo de errores
const CatchErrorsList = {
  BadRequestException: (exception: BadRequestException): ICatchBodyResponse => {
    const errorMessage: {
      statusCode?: string;
      message?: string[] | string;
      error?: string;
    } = exception.getResponse() as object;
    return {
      status: HttpStatus.BAD_REQUEST,
      message:
        typeof errorMessage.message === 'object'
          ? errorMessage.message.join(', ')
          : errorMessage.message,
      code: exception.name,
    };
  },
  HttpException: (exception: HttpException): ICatchBodyResponse => {
    return {
      status: exception.getStatus(),
      message: exception.message,
      code: exception.getStatus().toString(),
    };
  },
  QueryFailedError: (exception: QueryFailedError): ICatchBodyResponse => {
    console.log('exception :>> ', exception);
    const rawMessage = exception.message;
    return {
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      message: rawMessage
        .replace(/for key \'*.*\'/, '')
        .replace(
          /\a parent row: a foreign key constraint fails *.*/,
          'because have other associated records',
        ),
      code: exception.name,
    };
  },
  EntityNotFoundError: (exception: EntityNotFoundError): ICatchBodyResponse => {
    return {
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      message: exception.message,
      code: exception.name,
    };
  },
  CannotCreateEntityIdMapError: (
    exception: CannotCreateEntityIdMapError,
  ): ICatchBodyResponse => {
    return {
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      message: exception.message,
      code: exception.name,
    };
  },
  UpdateValuesMissingError: (
    exception: UpdateValuesMissingError,
  ): ICatchBodyResponse => {
    return {
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      message: exception.message,
      code: exception.name,
    };
  },
  UnauthorizedException: (
    exception: UnauthorizedException,
  ): ICatchBodyResponse => {
    const errorMessage: {
      statusCode?: string;
      message?: string;
      error?: string;
    } = exception.getResponse() as object;
    return {
      status: HttpStatus.UNAUTHORIZED,
      message: errorMessage.message || 'Unauthorized',
      code: exception.name,
    };
  },
  Error: (exception: unknown): ICatchBodyResponse => {
    console.log('exception', exception);
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      code: 'HTTP_ERROR',
    };
  },
  NotFoundException: (exception: NotFoundException): ICatchBodyResponse => {
    return {
      status: HttpStatus.NOT_FOUND,
      message: exception.message,
      code: exception.name,
    };
  },
  ForbiddenException: (exception: ForbiddenException): ICatchBodyResponse => {
    return {
      status: HttpStatus.FORBIDDEN,
      message: exception.message,
      code: exception.name,
    };
  },
  EntityPropertyNotFoundError: (
    exception: EntityPropertyNotFoundError,
  ): ICatchBodyResponse => {
    return {
      status: HttpStatus.BAD_REQUEST,
      message: exception.message,
      code: exception.name,
    };
  },
  NotAcceptableException: (
    exception: NotAcceptableException,
  ): ICatchBodyResponse => {
    return {
      status: HttpStatus.NOT_ACCEPTABLE,
      message: exception.message,
      code: exception.name,
    };
  },
};

export default CatchErrorsList;
