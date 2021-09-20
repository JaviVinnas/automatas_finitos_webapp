import { ThunderstormStrong32 } from "carbon-icons-svelte";
import type { Determinable, Stringable } from "./Interfaces";
import type { State } from "./State";

export interface Automata<StateName extends string, Input extends string>
  extends Determinable,
    Stringable {
  readonly states: State<StateName, Input>[];
  addState(state: State<StateName, Input>) : void;
  removeState(state: StateName) : void;
  getState(id: StateName) :State<StateName, Input>;
  addTransition (from: StateName, input: Input, to: StateName[]) : void;
  removeTransition (from: StateName, input: Input, to: StateName[]) : void;
  getStateClosure (id: StateName) : State<StateName, Input>[];
  getComposeStateClosure (id: StateName) : State<StateName, Input>;
  getTransition (from: StateName, input: Input) : State<StateName, Input>[];
  getComposeTransition (
    from: StateName,
    input: Input
  ) : State<StateName, Input>;
  testInput(input: string): boolean;
  makeDeterministic<NewStateName extends string>() :{
    changes: Map<StateName[], NewStateName>;
    automata: Automata<NewStateName, Input>;
  };
  makeMinimum<NewStateName extends string>() : {
    changes: Map<StateName[], NewStateName>;
    automata: Automata<NewStateName, Input>;
  };
}

export class AutomataImpl<StateName extends string, Input extends string> implements Automata<StateName, Input>{
  states: State<StateName, Input>[];

  constructor(...states: State<StateName, Input>[]) {
    this.states = [...states];
  }

  addState(state: State<StateName, Input>): void {
    this.states.push(state);
  }
  removeState(state: StateName): void {
    this.states = this.states.filter(s => s.id.has(state));
  }
  getState(id: StateName): State<StateName, Input> {
    return this.states.find(s => s.id.has(id));
  }
  addTransition(from: StateName, input: Input, to: StateName[]): void {
    if (this.getState(from)) { //if state already exists
      
    }
  }
  removeTransition(from: StateName, input: Input, to: StateName[]): void {
    throw new Error("Method not implemented.");
  }
  getStateClosure(id: StateName): State<StateName, Input>[] {
    throw new Error("Method not implemented.");
  }
  getComposeStateClosure(id: StateName): State<StateName, Input> {
    throw new Error("Method not implemented.");
  }
  getTransition(from: StateName, input: Input): State<StateName, Input>[] {
    throw new Error("Method not implemented.");
  }
  getComposeTransition(from: StateName, input: Input): State<StateName, Input> {
    throw new Error("Method not implemented.");
  }
  testInput(input: string): boolean {
    throw new Error("Method not implemented.");
  }
  makeDeterministic<NewStateName extends string>(): { changes: Map<StateName[], NewStateName>; automata: Automata<NewStateName, Input>; } {
    throw new Error("Method not implemented.");
  }
  makeMinimum<NewStateName extends string>(): { changes: Map<StateName[], NewStateName>; automata: Automata<NewStateName, Input>; } {
    throw new Error("Method not implemented.");
  }
  isDeterministic(): boolean {
    throw new Error("Method not implemented.");
  }
  toString(): string {
    throw new Error("Method not implemented.");
  }
  
}


