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

export function generateGraphQLTableTypes(
  tableNameRaw: string,
  tableDefinition: TableDefinition,
  options: Options,
) {
  const tableName = options.transformTypeName(tableNameRaw);
  let fields = '';
  Object.keys(tableDefinition).forEach((columnNameRaw) => {
    const type = tableDefinition[columnNameRaw].tsType;
    // const nullable = tableDefinition[columnNameRaw].nullable ? '| null' : '';
    fields += `${Case.camel(columnNameRaw)}: ${type}!\n`;
  });
  const singularTableName = pluralize.singular(tableName);

  return `
##### ${singularTableName} #####
type ${singularTableName} {
  ${fields}
}

input ${singularTableName}WhereInput {
  ${fields}
}
    `;
}

export function generateGqlQueries(tableNames: string[]) {
  const fields = tableNames
    .map((tableName) => {
      const pascalTableName = Case.pascal(tableName);
      const camelTableName = Case.camel(tableName);
      return `
      \n
      ##### ${pluralize.plural(pascalTableName)}
      ${pluralize.singular(camelTableName)}(id: ID!): ${pluralize.singular(
        pascalTableName,
      )}
      ${pluralize.plural(
        camelTableName,
      )}(where: ${pascalTableName}WhereInput): [${pluralize.singular(
        pascalTableName,
      )}]\n
      `;
    })
    .join(',');

  return `
type Query {
  ${fields}
}`;
}
