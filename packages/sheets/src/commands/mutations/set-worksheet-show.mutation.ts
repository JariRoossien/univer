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

import type { BooleanNumber, IMutation } from '@univerjs/core';
import { CommandType, IUniverInstanceService } from '@univerjs/core';
import type { IAccessor } from '@wendellhu/redi';
import { getSheetMutationTarget } from '../commands/utils/target-util';

export interface ISetWorksheetShowMutationParams {
    shown: BooleanNumber;
    unitId: string;
    subUnitId: string;
}

export const SetWorksheetShowMutationFactory = (
    accessor: IAccessor,
    params: ISetWorksheetShowMutationParams
): ISetWorksheetShowMutationParams => {
    const target = getSheetMutationTarget(accessor.get(IUniverInstanceService), params);
    if (!target) {
        throw new Error('[SetWorksheetShowMutationFactory]: worksheet is null error!');
    }

    const { worksheet } = target;
    return {
        shown: !worksheet.isSheetHidden(),
        unitId: params.unitId,
        subUnitId: worksheet.getSheetId(),
    };
};

export const SetWorksheetShowMutation: IMutation<ISetWorksheetShowMutationParams> = {
    id: 'sheet.mutation.set-worksheet-shown',
    type: CommandType.MUTATION,
    handler: (accessor, params) => {
        const universheet = accessor.get(IUniverInstanceService).getUniverSheetInstance(params.unitId);

        if (universheet == null) {
            return false;
        }

        const worksheet = universheet.getSheetBySheetId(params.subUnitId);

        if (!worksheet) {
            return false;
        }

        worksheet.getConfig().hidden = params.hidden;

        return true;
    },
};
