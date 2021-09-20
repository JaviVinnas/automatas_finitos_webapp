export interface Stringable {
  toString(): string;
}

export interface Determinable {
  isDeterministic(): boolean;
}
