import { IRange } from '@univerjs/core';

import { afterAll, describe, expect, it } from 'vitest';
import { BranchCoverage, setEndForRange } from '../selection-utils';

describe('test setEndForRange function', () => {
    const range: IRange = {
      startRow: 0,
      startColumn: 0,
      endRow: 0,
      endColumn: 0,
    };

    afterAll(() => {
      BranchCoverage.coverage.printCoverage();
    });
});
