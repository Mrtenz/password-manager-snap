import { array, Infer, is, number, object, string } from 'superstruct';

export const NameStruct = object({
  name: string(),
  mask: number(),
});

export type Name = Infer<typeof NameStruct>;

export const isName = (value: unknown): value is Name => {
  return is(value, NameStruct);
};

export const StateStruct = object({
  names: array(NameStruct),
});

export type State = Infer<typeof StateStruct>;

export const isState = (value: unknown): value is State => {
  return is(value, StateStruct);
};
