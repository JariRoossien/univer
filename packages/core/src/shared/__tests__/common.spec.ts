/**
 * Copyright 2023-present DreamNum Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { afterAll, describe, expect, it } from 'vitest';
import { branch_coverage, cellToRange, isFormulaId, isFormulaString, isValidRange } from '../common';

describe('Test isValidRange', () => {
    afterAll(() => {
        console.log('isValidRange branch Coverage');
        console.log(`Branch 1: ${branch_coverage.insertAfter1 ? 'hit' : 'miss'}`);
        console.log(`Branch 2: ${branch_coverage.insertAfter2 ? 'hit' : 'miss'}`);
        console.log(`Branch 3: ${branch_coverage.insertAfter3 ? 'hit' : 'miss'}`);
        console.log(`Branch 4: ${branch_coverage.insertAfter4 ? 'hit' : 'miss'}`);
        console.log(`Branch 5: ${branch_coverage.insertAfter5 ? 'hit' : 'miss'}`);
        console.log(`Branch 6: ${branch_coverage.insertAfter6 ? 'hit' : 'miss'}`);
        console.log(`Branch 7: ${branch_coverage.insertAfter7 ? 'hit' : 'miss'}`);
        console.log(`Branch 8: ${branch_coverage.insertAfter8 ? 'hit' : 'miss'}`);
    });

    it('branch 1&2', () => {
        const range = {
            startRow: -1,
            endRow: 5,
            startColumn: 3,
            endColumn: 7,
            rangeType: 'ROW', // or 'COLUMN' to test different cases
        };
        expect(isValidRange(range)).toBeFalsy();
        expect(branch_coverage.insertAfter1).toBeTruthy();
        expect(branch_coverage.insertAfter2).toBeFalsy();
    });

    it('branch 5&6', () => {
        const range = {
            startRow: Number.NaN,
            endRow: Number.NaN,
            startColumn: 3,
            endColumn: 5,
            rangeType: 'ROW',
        };
        expect(isValidRange(range)).toBeFalsy();
        expect(branch_coverage.insertAfter5).toBeFalsy();
        expect(branch_coverage.insertAfter6).toBeTruthy();
    });

    it('branch 7&8', () => {
        const range = {
            startRow: Number.NaN,
            endRow: 2,
            startColumn: Number.NaN,
            endColumn: 5,
            rangeType: 'OTHER_TYPE',
        };
        expect(isValidRange(range)).toBeFalsy();
        expect(branch_coverage.insertAfter7).toBeTruthy();
        expect(branch_coverage.insertAfter8).toBeFalsy();
    });

    it('all conditions valid', () => {
        const range = {
            startRow: 1,
            endRow: 2,
            startColumn: 3,
            endColumn: 5,
            rangeType: 'ROW',
        };
        expect(isValidRange(range)).toBeTruthy();
    });
});

it('Test isFormulaString', () => {
    expect(isFormulaString('=SUM(1)')).toBe(true);
    expect(isFormulaString('SUM(1)')).toBe(false);
    expect(isFormulaString('=')).toBe(false);
    expect(isFormulaString('')).toBe(false);
    expect(isFormulaString(1)).toBe(false);
    expect(isFormulaString(null)).toBe(false);
    expect(isFormulaString(undefined)).toBe(false);
    expect(isFormulaString(true)).toBe(false);
    expect(isFormulaString({})).toBe(false);
    expect(isFormulaString({ f: '' })).toBe(false);
});

it('Test isFormulaId', () => {
    expect(isFormulaId('id1')).toBe(true);
    expect(isFormulaId('')).toBe(false);
    expect(isFormulaId(1)).toBe(false);
    expect(isFormulaId(null)).toBe(false);
    expect(isFormulaId(undefined)).toBe(false);
    expect(isFormulaId(true)).toBe(false);
    expect(isFormulaId({})).toBe(false);
    expect(isFormulaId({ f: '' })).toBe(false);
});

