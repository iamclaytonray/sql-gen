import { Options as ITFOptions, processString } from 'typescript-formatter';

import { generateGqlQueries, generateGraphQLTableTypes } from './graphql';
import Options, { OptionValues } from './options';
import { Database, getDatabase } from './schema';
import { generateTableTypes } from './typescript';

export async function graphQLOfTable(
  db: Database | string,
  table: string,
  schema: string,
  options: any = new Options(),
) {
  if (typeof db === 'string') {
    db = getDatabase(db);
  }

  let types = '';
  const tableTypes = await db.getTableTypes(table, schema, options, 'graphql');
  types += generateGraphQLTableTypes(table, tableTypes, options);
  return types;
}

export async function typescriptOfTable(
  db: Database | string,
  table: string,
  schema: string,
  options: any = new Options(),
) {
  if (typeof db === 'string') {
    db = getDatabase(db);
  }

  let interfaces = '';
  const tableTypes = await db.getTableTypes(
    table,
    schema,
    options,
    'typescript',
  );
  interfaces += generateTableTypes(table, tableTypes, options);
  return interfaces;
}

export async function typescriptOfSchema(
  db: Database | string,
  tables: string[] = [],
  schema: string | null = null,
  options: OptionValues = {},
): Promise<string> {
  if (typeof db === 'string') {
    db = getDatabase(db);
  }

  if (!schema) {
    schema = db.getDefaultSchema();
  }

  if (tables.length === 0) {
    tables = await db.getSchemaTables(schema);
  }

  const optionsObject = new Options(options);

  const interfacePromises = tables.map((table) =>
    typescriptOfTable(db, table, schema as string, optionsObject),
  );
  const interfaces = await Promise.all(interfacePromises).then((tsOfTable) =>
    tsOfTable.join(''),
  );

  let output = '';

  output += interfaces;

  const formatterOption: ITFOptions = {
    replace: false,
    verify: false,
    tsconfig: true,
    tslint: true,
    editorconfig: false,
    tsfmt: true,
    vscode: false,
    tsconfigFile: null,
    tslintFile: null,
    vscodeFile: null,
    tsfmtFile: null,
  };

  const processedResult = await processString(
    'schema.ts',
    output,
    formatterOption,
  );
  return processedResult.dest;
}

export async function graphqlOfSchema(
  db: Database | string,
  tables: string[] = [],
  schema: string | null = null,
  options: OptionValues = {},
): Promise<string> {
  if (typeof db === 'string') {
    db = getDatabase(db);
  }

  if (!schema) {
    schema = db.getDefaultSchema();
  }

  if (tables.length === 0) {
    tables = await db.getSchemaTables(schema);
  }

  const optionsObject = new Options(options);

  const interfacePromises = tables.map((table) =>
    graphQLOfTable(db, table, schema as string, optionsObject),
  );
  const interfaces = await Promise.all(interfacePromises).then((tsOfTable) =>
    tsOfTable.join(''),
  );
  const queries = generateGqlQueries(tables);

  let output = '';

  output += interfaces;
  output += queries;

  return output;
}

export { Database, getDatabase } from './schema';
export { Options, OptionValues };
