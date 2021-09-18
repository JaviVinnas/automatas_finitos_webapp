import * as ArrayUtils from "../Utils/Arrays";
import * as SetUtils from "../Utils/Sets";
import type { Optional } from "../Utils/types";
import type { NoLambdaString } from "./StringTypes";

export interface Stringable {
  toString(): string;
}

export interface Determinable {
  isDeterministic(): boolean;
}

export interface State<
  StateName extends NoLambdaString,
  Input extends NoLambdaString
> extends Determinable,
    Stringable {
  readonly id: Set<StateName>;
  readonly isInitial: boolean;
  readonly isFinal: boolean;
  addTransition: (input: Input, to: StateName[]) => void;
  removeTransition: (input: Input, to: StateName[]) => void;
  getTransition: (input: Input) => Set<StateName>;
  composeStates: (
    ...states: State<Input, StateName>[]
  ) => State<Input, StateName>;
}

export interface Automata<
  StateName extends NoLambdaString,
  Input extends NoLambdaString
> extends Determinable,
    Stringable {
  states: State<StateName, Input>[];
  addTransition: (from: StateName, input: Input, to: StateName[]) => void;
  removeTransition: (from: StateName, input: Input, to: StateName[]) => void;
  getState: (id: StateName) => State<StateName, Input>;
  getStateClosure: (id: StateName) => State<StateName, Input>[];
  getComposeStateClosure: (id: StateName) => State<StateName, Input>;
  getTransition: (from: StateName, input: Input) => State<StateName, Input>[];
  getComposeTransition: (
    from: StateName,
    input: Input
  ) => State<StateName, Input>;
  testInput(input: string): boolean;
}

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

export type StateOld<
  AcceptedSymbols extends Letters | 0 | 1,
  StateNames extends `${Uppercase<Letters>}${Uppercase<Letters> | ""}`
> = {
  identifyer: Set<StateNames>;
  isInitial: boolean;
  isFinal: boolean;
  transition: Map<AcceptedSymbols | "λ", Set<StateNames>>;
};

export type FiniteAutomataOld<
  AcceptedSymbols extends Letters | 0 | 1,
  StateNames extends `${Uppercase<Letters>}${Uppercase<Letters> | ""}`
> = Set<StateOld<AcceptedSymbols, StateNames>>;

const example: FiniteAutomataOld<0 | 1, "A" | "B" | "C"> = new Set();

example.add({
  identifyer: new Set(["A"]),
  isInitial: true,
  isFinal: false,
  transition: new Map<0 | 1 | "λ", Set<"A" | "B" | "C">>([
    [1, new Set(["A"])],
    [0, new Set(["A", "B"])],
    ["λ", new Set([])],
  ]),
});

example.add({
  identifyer: new Set(["B"]),
  isInitial: false,
  isFinal: true,
  transition: new Map<0 | 1 | "λ", Set<"A" | "B" | "C">>([
    [1, new Set(["A"])],
    [0, new Set(["A"])],
    ["λ", new Set([])],
  ]),
});

example.add({
  identifyer: new Set(["C"]),
  isInitial: false,
  isFinal: true,
  transition: new Map<0 | 1 | "λ", Set<"A" | "B" | "C">>([
    [1, new Set(["A"])],
    [0, new Set(["A", "B"])],
    ["λ", new Set(["C"])],
  ]),
});

/**
 * Tells if an automata is or not deterministic
 * @param automata the involved automata
 */
function isDeterministic<
  AcceptedSymbols extends Letters | 0 | 1,
  States extends `${Uppercase<Letters>}${Uppercase<Letters> | ""}`
>(automata: FiniteAutomataOld<AcceptedSymbols, States>): boolean {
  if (automata.size === 0) return true;
  const states = [...automata.keys()];
  //is deterministic if only has one result for each transition and all of his λ transitions are empty
  const allNonLambdaTransitionsAreOneToOne = states
    .map((state) => state.transition)
    .map((transitionMap) => {
      transitionMap.delete("λ");
      return transitionMap;
    })
    .map((transitionMap) => [...transitionMap.values()])
    .flat()
    .every((transitionResult) => transitionResult.size === 1);

  const allLambdaTransitionsAreEmpty = states
    .map((state) => state.transition.get("λ"))
    .every((result) => result.size === 0);

  return allNonLambdaTransitionsAreOneToOne && allLambdaTransitionsAreEmpty;
}

/**
 * Create a new state with the combination of two states
 * @param state1
 * @param state2
 * @returns a new state
 */
function addStates<
  AcceptedSymbols extends Letters | 0 | 1,
  StateNames extends `${Uppercase<Letters>}${Uppercase<Letters> | ""}`
>(
  state1: StateOld<AcceptedSymbols, StateNames>,
  state2: StateOld<AcceptedSymbols, StateNames>
): StateOld<AcceptedSymbols, StateNames> {
  //create the new identifyer as union of the two states identifyers
  const identifyer = new Set([...state1.identifyer, ...state2.identifyer]);
  //final or initial if one of the states is final or initial
  const isInitial = state1.isInitial || state2.isInitial;
  const isFinal = state1.isFinal || state2.isFinal;
  //build the transition function
  const inputs = [...state1.transition.keys(), ...state2.transition.keys()];
  const transition = new Map<AcceptedSymbols | "λ", Set<StateNames>>();
  //for the non lambda transition we do the union of the two results
  inputs.forEach((input) => {
    input === "λ" ||
      transition.set(
        input,
        new Set([
          ...state1.transition.get(input),
          ...state2.transition.get(input),
        ])
      );
  });
  //for the lambda transition we resolve it as the union of the two results except those states in the identifyer
  const lambdaStatesNotInIdentifyer = [
    ...state1.transition.get("λ"),
    ...state2.transition.get("λ"),
  ].filter((lambdaState) => !identifyer.has(lambdaState));
  transition.set("λ", new Set(lambdaStatesNotInIdentifyer));
  return { identifyer, isInitial, isFinal, transition };
}

/**
 * Add multiple states from an array of states
 * @param states the array to reduce
 * @returns a new state with the composition of the provided states
 */
function composeStates<
  AcceptedSymbols extends Letters | 0 | 1,
  StateNames extends `${Uppercase<Letters>}${Uppercase<Letters> | ""}`
>(
  ...states: StateOld<AcceptedSymbols, StateNames>[]
): StateOld<AcceptedSymbols, StateNames> {
  if (states.length === 0)
    throw new Error("Can't compose an array of empty states!");
  if (states.length === 1) return states[0];
  return states.reduce((acc, state) => addStates(acc, state));
}

/**
 * From an automata retrieves the state with the exact identifyer
 * @param automata the involved automata
 * @param identifyer Identifyer of the state to retrieve
 * @returns the state with the exact identifyer
 */
function getState<
  AcceptedSymbols extends Letters | 0 | 1,
  StateNames extends `${Uppercase<Letters>}${Uppercase<Letters> | ""}`
>(
  automata: FiniteAutomataOld<AcceptedSymbols, StateNames>,
  stateName: StateNames
): StateOld<AcceptedSymbols, StateNames> {
  //return the state of the automata ()
  return [...automata].find((state) =>
    SetUtils.equals(state.identifyer, new Set([stateName]))
  );
}
/**
 * From an automata retrieves the list of states with the exact identifyers
 * @param automata the involved automata
 * @param stateNames identifyers of the states to retrieve
 * @returns the state list with the exact identifyer
 * @see getState
 */
function getStates<
  AcceptedSymbols extends Letters | 0 | 1,
  StateNames extends `${Uppercase<Letters>}${Uppercase<Letters> | ""}`
>(
  automata: FiniteAutomataOld<AcceptedSymbols, StateNames>,
  stateNames: StateNames[]
): StateOld<AcceptedSymbols, StateNames>[] {
  //remove duplicates
  return [...new Set(stateNames)].map((stateName) =>
    getState(automata, stateName)
  );
}

/**
 * Return an set with itself and the recursive states via the lambda (empty) transition
 * @param automata the involved automata
 * @param stateName the state we want to find its closure
 */
function getClosure<
  AcceptedSymbols extends Letters | 0 | 1,
  States extends `${Uppercase<Letters>}${Uppercase<Letters> | ""}`
>(
  automata: FiniteAutomataOld<AcceptedSymbols, States>,
  stateName: States
): Set<States> {
  const auxiliarStateStack = [stateName]; //used to avoid recursion
  //we add the first generation of states via the lambda transition to the stack
  getState(automata, stateName)
    .transition.get("λ")
    .forEach(
      (lambdaState) =>
        auxiliarStateStack.includes(lambdaState) ||
        auxiliarStateStack.push(lambdaState)
    );
  const resultSet = new Set<States>();
  while (auxiliarStateStack.length > 0) {
    const currentState = auxiliarStateStack.pop();
    resultSet.add(currentState);
    //we get currentState closure via the lambda transition
    getState(automata, currentState)
      .transition.get("λ")
      .forEach(
        (currentStateLambdaState) =>
          resultSet.has(currentStateLambdaState) ||
          auxiliarStateStack.push(currentStateLambdaState)
      );
  }
  return resultSet;
}

/**
 * Same behaviour as `getClosure` but reducing the states to a new state
 * @param automata the involved automata
 * @param stateName the state we want to find its closure
 * @see getClosure
 */
function getComposeClosure<
  AcceptedSymbols extends Letters | 0 | 1,
  States extends `${Uppercase<Letters>}${Uppercase<Letters> | ""}`
>(
  automata: FiniteAutomataOld<AcceptedSymbols, States>,
  stateName: States
): StateOld<AcceptedSymbols, States> {
  const resultSet = getClosure(automata, stateName);
  const states = getStates(automata, [...resultSet]);
  return composeStates(...states);
}

/**
 * Applies an input to the automata, resulting in a set of resulting states
 * @param automata the involved automata
 * @param activeStateIdentifyers the active states. **If more than one state is active the set must be bigger than one => Set("A", "B")**
 * @param input
 */
function transition<
  AcceptedSymbols extends Letters | 0 | 1,
  StateNames extends `${Uppercase<Letters>}${Uppercase<Letters> | ""}`
>(
  automata: FiniteAutomataOld<AcceptedSymbols, StateNames>,
  activeStateIdentifyers: Set<StateNames>,
  input: AcceptedSymbols
): Set<StateNames> {
  const activeStates = [...automata.values()].filter(
    (state) => activeStateIdentifyers.has([...state.identifyer][0]) //the identifying set from the automata only has one element (by definition)
  );
  return composeStates(...activeStates).transition.get(input);
}

function composeTransition<
  AcceptedSymbols extends Letters | 0 | 1,
  StateNames extends `${Uppercase<Letters>}${Uppercase<Letters> | ""}`
>(
  automata: FiniteAutomataOld<AcceptedSymbols, StateNames>,
  activeStateIdentifyers: Set<StateNames>,
  input: AcceptedSymbols
) {
  const result = transition(automata, activeStateIdentifyers, input);
}
