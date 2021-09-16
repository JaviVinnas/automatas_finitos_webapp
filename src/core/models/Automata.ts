import { removeFromArray, addIfNotPresent } from "../Utils/Arrays";

export type Letters =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";

export type FiniteAutomata<
  AcceptedSymbols extends Letters | 0 | 1,
  States extends `${Uppercase<Letters>}${Uppercase<Letters> | ""}`
> = Record<
  States,
  {
    isInitial: boolean;
    isFinal: boolean;
    transition: Record<AcceptedSymbols | "λ", States[]>;
  }
>;

const example: FiniteAutomata<0 | 1, "A" | "B" | "C"> = {
  A: {
    isInitial: true,
    isFinal: false,
    transition: {
      0: ["B", "C"],
      1: ["C"],
      λ: ["A"],
    },
  },
  B: {
    isInitial: true,
    isFinal: false,
    transition: {
      0: ["B", "C"],
      1: ["C"],
      λ: ["A"],
    },
  },
  C: {
    isInitial: true,
    isFinal: false,
    transition: {
      0: ["B", "C"],
      1: ["C"],
      λ: ["A"],
    },
  },
};

function isEmpty<
  AcceptedSymbols extends Letters | 0 | 1,
  States extends `${Uppercase<Letters>}${Uppercase<Letters> | ""}`
>(automata: FiniteAutomata<AcceptedSymbols, States>): boolean {
  return Object.keys(automata).length === 0;
}

/**
 * Tells if an automata is or not deterministic
 * @param automata the involved automata
 */
function isDeterministic<
  AcceptedSymbols extends Letters | 0 | 1,
  States extends `${Uppercase<Letters>}${Uppercase<Letters> | ""}`
>(automata: FiniteAutomata<AcceptedSymbols, States>): boolean {
  if (isEmpty(automata)) return true;
  const states = Object.keys(automata);
  const languageWithoutLambda = removeFromArray(
    Object.keys(automata[states[0]]?.transition),
    "λ"
  );
  //is deterministic if only has one result for each transition and all of his λ transitions are empty
  const allNonLambdaTransitionsAreOneToOne = states
    .map((stateName) => automata[stateName].transition)
    .map((transition) =>
      languageWithoutLambda.map((symbol) => transition[symbol])
    )
    .flat()
    .every((result) => result.length === 1);

  const allLambdaTransitionsAreEmpty = states
    .map((stateName) => automata[stateName].transition["λ"])
    .every((result) => result.length === 0);

  return allNonLambdaTransitionsAreOneToOne && allLambdaTransitionsAreEmpty;
}

/**
 * Return an array with itself and the recursive states via the lambda (empty) transition
 * @param automata the involved automata
 * @param stateName the state we want to find its closure
 */
function getClosure<
  AcceptedSymbols extends Letters | 0 | 1,
  States extends `${Uppercase<Letters>}${Uppercase<Letters> | ""}`
>(
  automata: FiniteAutomata<AcceptedSymbols, States>,
  stateName: States
): Set<States> {
  const auxiliarStack = [stateName]; //used to avoid recursion
  //we add the first generation of states via the lambda transition to the stack
  automata[stateName].transition["λ"].forEach(
    (lambdaState) =>
      auxiliarStack.indexOf(lambdaState) === -1
        ? auxiliarStack.push(lambdaState)
        : null //to being able touse a ternary operator
  );
  const resultSet = new Set<States>();
  while (auxiliarStack.length > 0) {
    const currentState = auxiliarStack.pop()!;
    resultSet.add(currentState);
    //we get currentState closure via the lambda transition
    automata[currentState].transition["λ"].forEach((currentStateLambdaState) =>
      !resultSet.has(currentStateLambdaState) //if it is not processed yet we add it to the stack
        ? auxiliarStack.push(currentStateLambdaState)
        : null
    );
  }
  return resultSet;
}

/**
 * Builds an automata which behaves the same way as the provided but with deterministic form factor
 * @param automata the involved automata
 * @returns the deterministic automata generated
 */
function makeDeterministic<
  AcceptedSymbols extends Letters | 0 | 1,
  States extends `${Uppercase<Letters>}${Uppercase<Letters> | ""}`
>(automata: FiniteAutomata<AcceptedSymbols, States>) {
  if (isDeterministic(automata)) return automata;
  //the first thing we do is find the closure of the initial state
}
