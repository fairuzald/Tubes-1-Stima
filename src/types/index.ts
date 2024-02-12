interface Matrix {
  [key: number]: string[];
}

type Solution = {
  result: {
    seq: Array<Array<number>>;
    string: string;
    score: number;
  };
  runtime: number;
};

interface Target {
  sequence: string[];
  points: number;
}

interface ParsedFile {
  buffer: number;
  parsedMatrix: Matrix;
  parsedTargets: Target[];
}

export type { Matrix, ParsedFile, Solution, Target };

