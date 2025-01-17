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
import { branch_coverage, isAllFormatInTextRuns } from '../range';
import type { IDocumentBody } from '../../types/interfaces';
import { BooleanNumber } from '../../types/enum';

describe('test isAllFormatInTextRuns', () => {
    afterAll(() => {
        console.log('isAllFormatInTextRuns branch Coverage');
        console.log(`Branch 1: ${branch_coverage.insertAfter1 ? 'hit' : 'miss'}`);
        console.log(`Branch 2: ${branch_coverage.insertAfter2 ? 'hit' : 'miss'}`);
        console.log(`Branch 3: ${branch_coverage.insertAfter3 ? 'hit' : 'miss'}`);
        console.log(`Branch 4: ${branch_coverage.insertAfter4 ? 'hit' : 'miss'}`);
        console.log(`Branch 5: ${branch_coverage.insertAfter5 ? 'hit' : 'miss'}`);
        console.log(`Branch 6: ${branch_coverage.insertAfter6 ? 'hit' : 'miss'}`);
        console.log(`Branch 7: ${branch_coverage.insertAfter7 ? 'hit' : 'miss'}`);
    });

    it('should return true when all content is bold', () => {
        const body: IDocumentBody = {
            dataStream: 'hello\r\n',
            textRuns: [{
                st: 0,
                ed: 5,
                ts: { bl: BooleanNumber.TRUE },
            }],
        };

        expect(isAllFormatInTextRuns('bl', body)).toBe(BooleanNumber.TRUE);
    });

    it('should return false when any content is not bold', () => {
        const body: IDocumentBody = {
            dataStream: 'hello\r\n',
            textRuns: [{
                st: 0,
                ed: 4,
                ts: { bl: BooleanNumber.TRUE },
            }],
        };

        expect(isAllFormatInTextRuns('bl', body)).toBe(BooleanNumber.FALSE);
    });

    it('should return false when ts keys is undefined', () => {
        const body: IDocumentBody = {
            dataStream: 'hello\r\n',
            textRuns: [{
                st: 0,
                ed: 4,
                ts: { bl: null },
            }],
        };

        expect(isAllFormatInTextRuns('bl', body)).toBe(BooleanNumber.FALSE);
    });

    it('should return false when ts keys is false', () => {
        const body: IDocumentBody = {
            dataStream: 'hello\r\n',
            textRuns: [{
                st: 0,
                ed: 4,
                ts: { bl: BooleanNumber.FALSE },
            }],
        };

        expect(isAllFormatInTextRuns('bl', body)).toBe(BooleanNumber.FALSE);
    });

    it('should return false when any content is not underlined', () => {
        const body: IDocumentBody = {
            dataStream: 'hello\r\n',
            textRuns: [{
                st: 0,
                ed: 4,
                ts: {
                    ul: {
                        s: BooleanNumber.TRUE,
                    },
                },
            }],
        };

        expect(isAllFormatInTextRuns('ul', body)).toBe(BooleanNumber.FALSE);
    });

    it('should return false when any content is not underlined', () => {
        const body: IDocumentBody = {
            dataStream: 'hello\r\n',
            textRuns: [{
                st: 0,
                ed: 4,
                ts: {
                    ul: {
                        s: BooleanNumber.FALSE,
                    },
                },
            }],
        };

        expect(isAllFormatInTextRuns('ul', body)).toBe(BooleanNumber.FALSE);
    });
});
