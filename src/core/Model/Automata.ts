type Letters =
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

type StateNames = `${Uppercase<Letters>}${Uppercase<Letters> | ""}`;


type FiniteAutomata<
  AcceptedSymbols extends Letters | 0 | 1,
  States extends StateNames
> = Record<
  States,
  {
    isInitial: boolean;
    isFinal: boolean;
    transition: Record<AcceptedSymbols | "λ", States[]>;
  }
>;

const aa: FiniteAutomata<0 | 1, "A" | "B" | "C"> = {
  A: {
    isFinal: true,
    isInitial: false,
    transition: {
      0: ["B"],
      1: ["A"],
      λ: [],
    },
  },
  B: {
    isFinal: true,
    isInitial: false,
    transition: {
      0: ["B"],
      1: ["A"],
      λ: [],
    },
  },
  C: {
    isFinal: true,
    isInitial: false,
    transition: {
      0: ["B"],
      1: ["A"],
      λ: [],
    },
  },
};
