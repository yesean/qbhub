import { log } from './index.js';

export type Ok<T> = T & { type: 'ok' };

type ErrType = { errType: string };
type DefaultErrType = { errType: 'defaultErr' };
export type Err<T extends ErrType = DefaultErrType> = T & {
  type: 'error';
};

export type Result<T, TErrType extends ErrType = DefaultErrType> =
  | Err<TErrType>
  | Ok<T>;

export function isOk<T>(result: Result<T>): result is Ok<T> {
  return result.type === 'ok';
}

export function makeOk<T>(payload: T): Ok<T> {
  return { type: 'ok', ...payload };
}

export function isErr<T, TErrType extends ErrType>(
  result: Result<T, TErrType>,
): result is Err<TErrType> {
  return result.type === 'error';
}

export function makeErr<TErrType extends ErrType>(
  payload: TErrType,
): Err<TErrType> {
  const err: Err<TErrType> = { ...payload, type: 'error' };
  log.debug(err);
  return err;
}

type OkHandler<T, TReturn> = (ok: Ok<T>) => TReturn;
export function matchOk<T, TReturn>(
  result: Result<T>,
  onOk: OkHandler<T, TReturn>,
): TReturn | void {
  if (isOk(result)) {
    return onOk(result);
  }
}

type ErrHandler<TErrType extends ErrType, TReturn> = (
  err: Err<TErrType>,
) => TReturn;
export function matchErr<T, TErrType extends ErrType, TReturn>(
  result: Result<T, Err<TErrType>>,
  onErr: ErrHandler<Err<TErrType>, TReturn>,
): TReturn | void {
  if (isErr(result)) {
    return onErr(result);
  }
}

export function matchResult<T, TErrType extends ErrType, TOkReturn>(
  result: Result<T, Err<TErrType>>,
  onOk: OkHandler<T, TOkReturn>,
): Err<TErrType> | TOkReturn;

export function matchResult<T, TErrType extends ErrType, TOkReturn, TErrReturn>(
  result: Result<T, Err<TErrType>>,
  onOk: OkHandler<T, TOkReturn>,
  onErr: ErrHandler<Err<TErrType>, TErrReturn>,
): TErrReturn | TOkReturn;

export function matchResult<T, TErrType extends ErrType, TOkReturn, TErrReturn>(
  result: Result<T, Err<TErrType>>,
  onOk: OkHandler<T, TOkReturn>,
  onErr?: ErrHandler<Err<TErrType>, TErrReturn>,
): Err<TErrType> | TErrReturn | TOkReturn {
  switch (result.type) {
    case 'ok':
      return onOk(result);
    case 'error':
      if (onErr === undefined) {
        return result;
      }
      return onErr(result);
  }
}
