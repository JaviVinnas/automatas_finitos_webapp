export const LAMBDA = "λ" as const;

export type NoLambdaString = Exclude<string, typeof LAMBDA>;


