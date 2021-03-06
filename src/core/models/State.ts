import * as ArrayUtils from "../Utils/Arrays";
import * as Sets from "../Utils/Sets";
import type { Optional } from "../Utils/types";
import type { Determinable, Stringable } from "./Interfaces";
import { LAMBDA } from "./Strings";



export interface State<
  StateName extends string,
  Input extends string | typeof LAMBDA
> extends Determinable,
    Stringable {
  /**
   * Set of identifyers of an state. If is an automata state its size **must be 1**
   */
  readonly id: Set<StateName>;
  /**
   * If is an initial state. An automata only can contain one initial state
   */
  readonly isInitial: boolean;
  /**
   * If the state is final ergo valid
   */
  readonly isFinal: boolean;
  /**
   * Set of inputs recognizables by the state wityh defined output
   */
  getInputs(): Set<Input>;

  /**
   * Obtains the transition map for each defined transition
   */
  getTransitionMap(): [Input,Set<StateName>][]
  /**
   * Add a transition to the state
   * @param input the input who provokes the transition
   * @param to the final states of the transition. It will be added to the ones already added
   */
  addTransition(input: Input, to: StateName[] | Set<StateName>): void;
  /**
   * Remove transition states
   * @param input the input who provokes the transition
   * @param to the final states we want to remove
   */
  removeTransition(input: Input, to: StateName[] | Set<StateName>): void;
  /**
   * Gets the states we obtain by applying the input
   * @param input the input who provokes the transition
   */
  getTransition(input: Input): Set<StateName>;
  /**
   * Add an state to the current one
   * @param state the state we want to add
   */
  composeState(state: State<StateName, Input>): State<StateName, Input>;
  /**
   * Add the states passed by arguments to the current one
   * @param states
   * @see composeState
   */
  composeStates(...states: State<StateName, Input>[]): State<StateName, Input>;
}

export class StateImpl<
  StateName extends string,
  Input extends string | typeof LAMBDA
> implements State<StateName, Input>
{
  public readonly id: Set<StateName>;
  public readonly isInitial: boolean;
  public readonly isFinal: boolean;
  private transitionMap: Map<Input, Set<StateName>>;

  constructor(
    id: StateName[] | Set<StateName>,
    isInitial: boolean = false,
    isFinal: boolean = false
  ) {
    this.id = new Set(id);
    if (this.id.size === 0) throw new Error("Can't create state without ID!");
    this.isInitial = isInitial;
    this.isFinal = isFinal;
    this.transitionMap = new Map();
  }
  public getTransitionMap(): [Input, Set<StateName>][] {
    return [...this.transitionMap.entries()]
  }

  public getInputs() {
    return new Set(this.transitionMap.keys());
  }

  public addTransition(input: Input, to: StateName[] | Set<StateName>): void {
    this.transitionMap.set(
      input,
      Sets.union(this.transitionMap.get(input), new Set(to))
    );
  }
  public removeTransition(input: Input, to: StateName[] | Set<StateName>): void {
    this.transitionMap.set(
      input,
      Sets.difference(this.transitionMap.get(input), new Set(to))
    );
  }
  public getTransition(input: Input): Set<StateName> {
    return this.transitionMap.get(input) || new Set();
  }
  public composeState(state: State<StateName, Input>): State<StateName, Input> {
    const resultState = new StateImpl<StateName, Input>(
      Sets.union(this.id, state.id),
      this.isInitial || state.isInitial,
      this.isFinal || state.isFinal
    );
    Sets.union(this.getInputs(), state.getInputs()).forEach((input) =>
      resultState.addTransition(
        input,
        Sets.difference(
          Sets.union(this.getTransition(input), state.getTransition(input)),
          input === LAMBDA ? this.id : new Set() //if lambda remove all states in new id
        )
      )
    );
    return resultState;
  }
  public composeStates(...states: State<StateName, Input>[]): State<StateName, Input> {
    return states.reduce((acum, current) => acum.composeState(current), this);
  }
  public isDeterministic(): boolean {
    const idHasOnlyOneItem = this.id.size === 1;

    const validTransitions = [...this.getInputs()]
      .map((input) => {
        return {
          isLambda: input === LAMBDA,
          size: this.getTransition(input).size,
        };
      })
      .every((result) =>
        result.isLambda ? result.size <= 0 : result.size <= 1
      );

    return idHasOnlyOneItem && validTransitions;
  }
  public toString(): string {
    return `[(${[...this.id]}) ${this.isFinal ? "Final" : ""} ${
      this.isInitial ? "Initial" : ""
    }] => ${this.transitionMap}`;
  }
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
  transition: Map<AcceptedSymbols | "??", Set<StateNames>>;
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
  transition: new Map<0 | 1 | "??", Set<"A" | "B" | "C">>([
    [1, new Set(["A"])],
    [0, new Set(["A", "B"])],
    ["??", new Set([])],
  ]),
});

example.add({
  identifyer: new Set(["B"]),
  isInitial: false,
  isFinal: true,
  transition: new Map<0 | 1 | "??", Set<"A" | "B" | "C">>([
    [1, new Set(["A"])],
    [0, new Set(["A"])],
    ["??", new Set([])],
  ]),
});

example.add({
  identifyer: new Set(["C"]),
  isInitial: false,
  isFinal: true,
  transition: new Map<0 | 1 | "??", Set<"A" | "B" | "C">>([
    [1, new Set(["A"])],
    [0, new Set(["A", "B"])],
    ["??", new Set(["C"])],
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
  //is deterministic if only has one result for each transition and all of his ?? transitions are empty
  const allNonLambdaTransitionsAreOneToOne = states
    .map((state) => state.transition)
    .map((transitionMap) => {
      transitionMap.delete("??");
      return transitionMap;
    })
    .map((transitionMap) => [...transitionMap.values()])
    .flat()
    .every((transitionResult) => transitionResult.size === 1);

  const allLambdaTransitionsAreEmpty = states
    .map((state) => state.transition.get("??"))
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
  const transition = new Map<AcceptedSymbols | "??", Set<StateNames>>();
  //for the non lambda transition we do the union of the two results
  inputs.forEach((input) => {
    input === "??" ||
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
    ...state1.transition.get("??"),
    ...state2.transition.get("??"),
  ].filter((lambdaState) => !identifyer.has(lambdaState));
  transition.set("??", new Set(lambdaStatesNotInIdentifyer));
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
    Sets.equals(state.identifyer, new Set([stateName]))
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
    .transition.get("??")
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
      .transition.get("??")
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
