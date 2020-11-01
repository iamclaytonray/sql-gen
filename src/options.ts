import * as Case from 'case';
import { upperFirst } from 'lodash';

const DEFAULT_OPTIONS: OptionValues = {
  writeHeader: true,
  camelCase: false,
};

export interface OptionValues {
  camelCase?: boolean;
  writeHeader?: boolean;
}

export default class Options {
  public options: OptionValues;

  constructor(options: OptionValues = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  public transformTypeName(typename: string) {
    return this.options.camelCase
      ? upperFirst(Case.camel(typename))
      : Case.pascal(typename);
  }
}
