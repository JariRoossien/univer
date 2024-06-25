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

import type { ICellData, IObjectMatrixPrimitiveType, IRange, IWorkbookData, Nullable, Univer } from '@univerjs/core';
import { IUniverInstanceService, LocaleType, ObjectMatrix } from '@univerjs/core';
import type { Injector } from '@wendellhu/redi';
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';

import { FormulaDataModel, initSheetFormulaData, BranchCoverage } from '../formula-data.model';
import { createCommandTestBed } from './create-command-test-bed';
import { IArrayFormulaRangeType, IArrayFormulaUnitCellType, IRuntimeUnitDataType } from '../../basics/common';

const TEST_WORKBOOK_DATA_DEMO: IWorkbookData = {
    id: 'test',
    appVersion: '3.0.0-alpha',
    sheets: {
        sheet1: {
            id: 'sheet1',
            cellData: {
                0: {
                    3: {
                        f: '=SUM(A1)',
                        si: '3e4r5t',
                    },
                },
                1: {
                    3: {
                        f: '=SUM(A2)',
                        si: 'OSPtzm',
                    },
                },
                2: {
                    3: {
                        si: 'OSPtzm',
                    },
                },
                3: {
                    3: {
                        si: 'OSPtzm',
                    },
                },
            },
            
        },
    },
    locale: LocaleType.ZH_CN,
    name: '',
    sheetOrder: [],
    styles: {},
};

const TEST_ARRAY_WORKBOOK_DATA: IWorkbookData = {
    id: 'test',
    appVersion: '3.0.0-alpha',
    sheets: {
        sheet1: {
            id: 'sheet1',
            cellData: {
                0: {
                    0: {
                        f: '=SUM(A1)',
                        si: '3e4r5t',
                    },
                    1: {
                        f: '=SUM(A2)',
                        si: '6f7a8b'
                    }
                },
            },
            
        },
    },
    locale: LocaleType.ZH_CN,
    name: '',
    sheetOrder: [],
    styles: {},
};

describe('Test formula data model', () => {

    afterAll(() => {
        BranchCoverage.getFormulaItemBySIdBranchCov.printCoverage();
        console.log();
        BranchCoverage.clearPreviousArrayFormulaCellDataBranchCov.printCoverage();
    });

    describe('formulaDataModel function', () => {
        let univer: Univer;
        let get: Injector['get'];
        let formulaDataModel: FormulaDataModel;

        let univerArray: Univer;
        let getArray: Injector['get'];
        let formulaDataModelArray: FormulaDataModel;

        let getValues: (
            startRow: number,
            startColumn: number,
            endRow: number,
            endColumn: number
        ) => Array<Array<Nullable<ICellData>>> | undefined;

        beforeEach(() => {
            const testBed = createCommandTestBed(TEST_WORKBOOK_DATA_DEMO);
            univer = testBed.univer;
            get = testBed.get;

            formulaDataModel = get(FormulaDataModel);

            const testBedArray = createCommandTestBed(TEST_ARRAY_WORKBOOK_DATA);
            univerArray = testBedArray.univer;
            getArray = testBedArray.get;

            formulaDataModelArray = getArray(FormulaDataModel);

            getValues = (
                startRow: number,
                startColumn: number,
                endRow: number,
                endColumn: number
            ): Array<Array<Nullable<ICellData>>> | undefined =>
                get(IUniverInstanceService)
                    .getUniverSheetInstance('test')
                    ?.getSheetBySheetId('sheet1')
                    ?.getRange(startRow, startColumn, endRow, endColumn)
                    .getValues();
        });

        afterEach(() => {
            univer.dispose();
        });

        describe('updateFormulaData', () => {
            it('delete formula with id', () => {
                formulaDataModel.initFormulaData();

                const unitId = 'test';
                const sheetId = 'sheet1';
                const cellValue = {
                    1: {
                        3: {
                            v: null,
                            p: null,
                            f: null,
                            si: null,
                        },
                    },
                };

                const result = {
                    [unitId]: {
                        [sheetId]: {
                            0: {
                                3: {
                                    f: '=SUM(A1)',
                                    si: '3e4r5t',
                                },
                            },
                            2: {
                                3: {
                                    f: '=SUM(A3)',
                                    si: 'OSPtzm',
                                },
                            },
                            3: {
                                3: {
                                    f: '=SUM(A3)',
                                    si: 'OSPtzm',
                                    x: 0,
                                    y: 1,
                                },
                            },
                        },
                    },
                };

                formulaDataModel.updateFormulaData(unitId, sheetId, cellValue);

                const formulaData = formulaDataModel.getFormulaData();
                expect(formulaData).toStrictEqual(result);
            });

            it('delete formulas with ids and formulas with only ids', () => {
                formulaDataModel.initFormulaData();

                const unitId = 'test';
                const sheetId = 'sheet1';
                const cellValue = {
                    0: {
                        3: {
                            v: null,
                            p: null,
                            f: null,
                            si: null,
                        },
                    },
                    1: {
                        3: {
                            v: null,
                            p: null,
                            f: null,
                            si: null,
                        },
                    },
                    2: {
                        3: {
                            v: null,
                            p: null,
                            f: null,
                            si: null,
                        },
                    },
                };

                const result = {
                    [unitId]: {
                        [sheetId]: {
                            3: {
                                3: {
                                    f: '=SUM(A4)',
                                    si: 'OSPtzm',
                                },
                            },
                        },
                    },
                };

                formulaDataModel.updateFormulaData(unitId, sheetId, cellValue);

                const formulaData = formulaDataModel.getFormulaData();
                expect(formulaData).toStrictEqual(result);
            });

            it('delete the formula with only id', () => {
                formulaDataModel.initFormulaData();

                const unitId = 'test';
                const sheetId = 'sheet1';
                const cellValue = {
                    3: {
                        3: {
                            v: null,
                            p: null,
                            f: null,
                            si: null,
                        },
                    },
                };

                const result = {
                    [unitId]: {
                        [sheetId]: {
                            0: {
                                3: {
                                    f: '=SUM(A1)',
                                    si: '3e4r5t',
                                },
                            },
                            1: {
                                3: {
                                    f: '=SUM(A2)',
                                    si: 'OSPtzm',
                                },
                            },
                            2: {
                                3: {
                                    f: '=SUM(A2)',
                                    si: 'OSPtzm',
                                    x: 0,
                                    y: 1,
                                },
                            },
                        },
                    },
                };

                formulaDataModel.updateFormulaData(unitId, sheetId, cellValue);

                const formulaData = formulaDataModel.getFormulaData();
                expect(formulaData).toStrictEqual(result);
            });
        });

        describe('updateArrayFormulaRange', () => {
            it('update array formula range', () => {
                const unitId = 'test';
                const sheetId = 'sheet1';

                formulaDataModel.setArrayFormulaRange({
                    [unitId]: {
                        [sheetId]: {
                            0: {
                                3: {
                                    startRow: 0,
                                    startColumn: 3,
                                    endRow: 1,
                                    endColumn: 3,
                                },
                            },
                        },
                    },
                });

                const cellValue = {
                    0: {
                        3: {
                            v: null,
                            p: null,
                            f: null,
                            si: null,
                        },
                    },
                };

                const result = {
                    [unitId]: {
                        [sheetId]: {},
                    },
                };

                formulaDataModel.updateArrayFormulaRange(unitId, sheetId, cellValue);

                const formulaData = formulaDataModel.getArrayFormulaRange();
                expect(formulaData).toStrictEqual(result);
            });
        });
        describe('updateArrayFormulaCellData', () => {
            it('update array formula cell data', () => {
                const unitId = 'test';
                const sheetId = 'sheet1';

                formulaDataModel.setArrayFormulaRange({
                    [unitId]: {
                        [sheetId]: {
                            0: {
                                3: {
                                    startRow: 0,
                                    startColumn: 3,
                                    endRow: 1,
                                    endColumn: 3,
                                },
                            },
                        },
                    },
                });

                formulaDataModel.setArrayFormulaCellData({
                    [unitId]: {
                        [sheetId]: {
                            0: {
                                3: {
                                    v: 1,
                                },
                            },
                            1: {
                                3: {
                                    v: 2,
                                },
                            },
                        },
                    },
                });

                const cellValue = {
                    0: {
                        3: {
                            v: null,
                            p: null,
                            f: null,
                            si: null,
                        },
                    },
                };

                const result = {
                    [unitId]: {
                        [sheetId]: {},
                    },
                };

                formulaDataModel.updateArrayFormulaCellData(unitId, sheetId, cellValue);

                const formulaData = formulaDataModel.getArrayFormulaCellData();
                expect(formulaData).toStrictEqual(result);
            });
        });

        describe('getFormulaStringByCell', () => {
            it('get formula string by cell', () => {
                formulaDataModel.initFormulaData();

                const unitId = 'test';
                const sheetId = 'sheet1';

                const result = [
                    ['=SUM(A1)'],
                    ['=SUM(A2)'],
                    ['=SUM(A3)'],
                    ['=SUM(A4)'],
                ];

                for (let i = 0; i < 4; i++) {
                    const formulaString = formulaDataModel.getFormulaStringByCell(i, 3, sheetId, unitId);
                    expect(formulaString).toBe(result[i][0]);
                }
            });
        });

        describe('getFormulaItemBySId', () => {
            it('Should return null on non-existing unitId', () => {
                formulaDataModel.initFormulaData();
                const unitId = 'NonExisting';
                const sheetId = 'sheet1';

                expect(formulaDataModel.getFormulaItemBySId('NULL', sheetId, unitId)).toBeNull();
            });
            it('Should return null on non-existing sheetId', () => {
                formulaDataModel.initFormulaData();
                const unitId = 'test';
                const sheetId = 'NonExistingSheet';

                expect(formulaDataModel.getFormulaItemBySId('NULL', sheetId, unitId)).toBeNull();
            });
            it('Should find item by Value', () => {
                const unitId = 'test';
                const sheetId = 'sheet1';

                expect(formulaDataModel.getFormulaItemBySId('3e4r5t', sheetId, unitId)).toBeTruthy();
            });
            it('Should not find item by Value', () => {
                const unitId = 'test';
                const sheetId = 'sheet1';

                expect(formulaDataModel.getFormulaItemBySId('NonExisting', sheetId, unitId)).toBeNull();
            });

        })

        describe('ClearArrayFormulaCellData', () => {
            it('ClearSheetData is Null', () => {
                const runTimeData: IRuntimeUnitDataType = {
                    'sheet1': null
                };
                formulaDataModelArray.clearPreviousArrayFormulaCellData(runTimeData);
            });
            it('ClearSheetData runs succesful', () => {
                const formulaArray: IArrayFormulaRangeType = {
                    ['test']: {
                        ['sheet1']: {
                            0: {
                                0: {
                                    startColumn: 0,
                                    endColumn: 2,
                                    startRow: 0,
                                    endRow: 0
                                }
                            }
                        }
                    }
                } 
                formulaDataModelArray.setArrayFormulaRange(formulaArray);
                formulaDataModelArray.setArrayFormulaCellData({
                    ['test']: {
                        ['sheet1']: {
                            0: {
                                0: {
                                    f: '=SUM(A1)',
                                    si: '3e4r5t'
                                },
                                1: {
                                    f: '=SUM(A1)',
                                    si: '3e4r5t'
                                }
                            }
                        }
                    }
                });
                expect(formulaDataModelArray.getArrayFormulaCellData()['test']?.['sheet1']?.[0]?.[0]).toBeTruthy();
                formulaDataModelArray.clearPreviousArrayFormulaCellData({
                    ['test']: {
                        ['sheet1']: createCellRangeMockObjectMatrix()
                    }
                });
                expect(formulaDataModelArray.getArrayFormulaCellData()['test']?.['sheet1']?.[0]?.[0]).toBeNull();
                // expect(formulaDataModelArray.getArrayFormulaCellData()).toBe(null);
            });
            it('ClearSheetData doesnt change with bad sheetname', () => {
                const formulaArray: IArrayFormulaRangeType = {
                    ['test']: {
                        ['sheet1']: {
                            0: {
                                0: {
                                    startColumn: 0,
                                    endColumn: 2,
                                    startRow: 0,
                                    endRow: 0
                                }
                            }
                        }
                    }
                } 
                formulaDataModelArray.setArrayFormulaRange(formulaArray);
                formulaDataModelArray.setArrayFormulaCellData({
                    ['test']: {
                        ['sheet1']: {
                            0: {
                                0: {
                                    f: '=SUM(A1)',
                                    si: '3e4r5t'
                                },
                                1: {
                                    f: '=SUM(A1)',
                                    si: '3e4r5t'
                                }
                            }
                        }
                    }
                });
                expect(formulaDataModelArray.getArrayFormulaCellData()['test']?.['sheet1']?.[0]?.[0]).toBeTruthy();
                formulaDataModelArray.clearPreviousArrayFormulaCellData({
                    ['test']: {
                        ['badSheetName']: createCellRangeMockObjectMatrix()
                    }
                });
                expect(formulaDataModelArray.getArrayFormulaCellData()['test']?.['sheet1']?.[0]?.[0]).toBeTruthy();
            });

            it('ClearSheetData doesnt change with no', () => {
                const formulaArray: IArrayFormulaRangeType = {
                    ['test']: {
                        ['sheet1']: {
                            0: {
                                0: {
                                    startColumn: 0,
                                    endColumn: 2,
                                    startRow: 0,
                                    endRow: 0
                                }
                            }
                        }
                    }
                } 
                formulaDataModelArray.setArrayFormulaRange(formulaArray);
                formulaDataModelArray.setArrayFormulaCellData({
                    ['test']: {
                        ['badSheet']: {
                            1: {
                                0: {
                                    f: '=SUM(A1)',
                                    si: '3e4r5t'
                                },
                                1: {
                                    f: '=SUM(A1)',
                                    si: '3e4r5t'
                                }
                            }
                        }
                    }
                });
                formulaDataModelArray.clearPreviousArrayFormulaCellData({
                    ['test']: {
                        ['sheet1']: createCellRangeMockObjectMatrix()
                    }
                });
                expect(formulaDataModelArray.getArrayFormulaCellData()['test']?.['sheet1']?.[1]?.[0]).toBeFalsy();
            });


        });
    
    });

    describe('function initSheetFormulaData', () => {
        it('init formula data', () => {
            const unitId = 'workbook-01';
            const sheetId = 'sheet-0011';

            const formulaData = {
                [unitId]: {},
            };

            const cellValue = {
                0: {
                    0: {
                        v: 1,
                    },
                    1: {
                        v: 2,
                    },
                    2: {
                        v: 3,
                    },
                    3: {
                        v: 2,
                        f: '=SUM(A1)',
                        si: '3e4r5t',
                    },
                },
                1: {
                    0: {
                        v: 4,
                    },
                },
                2: {
                    0: {
                        v: 44,
                    },
                },
                3: {
                    0: {
                        v: 444,
                    },
                },
            };

            const cellMatrix = new ObjectMatrix(cellValue);

            const result = {
                [unitId]: {
                    [sheetId]: {
                        0: {
                            3: {
                                f: '=SUM(A1)',
                                si: '3e4r5t',
                            },
                        },
                    },
                },
            };

            initSheetFormulaData(formulaData, unitId, sheetId, cellMatrix);
            expect(formulaData).toStrictEqual(result);
        });
    });

});

function createIRangeMockObjectMatrix(): ObjectMatrix<IRange> {
    const matrixData: IObjectMatrixPrimitiveType<IRange> = {
        0: {
            0: { startColumn: 0,
                endColumn: 0,
                startRow: 0,
                endRow: 2
             },
        }
    };
    return new ObjectMatrix(matrixData);
};

function createCellRangeMockObjectMatrix(): ObjectMatrix<Nullable<ICellData>> {
    const matrixData: IObjectMatrixPrimitiveType<Nullable<ICellData>> = {
        0: {
            0: { 
                si: null,
                f: null
            }
        }
    };
    return new ObjectMatrix(matrixData);
};
