import * as Case from 'case';
import * as _ from 'lodash';
import * as pluralize from 'pluralize';

import Options from './options';
import { TableDefinition } from './typings';

export function generateEnumType(enumObject: any, options: Options) {
  let enumString = '';
  // tslint:disable-next-line:forin
  for (const enumNameRaw in enumObject) {
    const enumName = options.transformTypeName(enumNameRaw);
    enumString += `export type ${enumName} = `;
    enumString += enumObject[enumNameRaw]
      .map((v: string) => `'${v}'`)
      .join(' | ');
    enumString += ';\n';
  }
  return enumString;
}

export function generateTableTypes(
  tableNameRaw: string,
  tableDefinition: TableDefinition,
  options: Options,
) {
  const tableName = options.transformTypeName(tableNameRaw);
  let fields = '';
  Object.keys(tableDefinition).forEach((columnNameRaw) => {
    const type = tableDefinition[columnNameRaw].tsType;
    const nullable = tableDefinition[columnNameRaw].nullable ? '| null' : '';
    fields += `${Case.camel(columnNameRaw)}: ${type}${nullable};\n`;
  });

  return `
    export interface I${pluralize.singular(tableName)} {
      ${fields}
    }
  `;
}
