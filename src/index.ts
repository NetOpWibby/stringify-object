


//  I M P O R T S

import isRegexp from "is-regexp";
import isObj from "is-obj";
import getOwnEnumPropSymbols from "get-own-enumerable-property-symbols";

interface LooseObject {
  [key: string]: any
}



//  E X P O R T

export default (suppliedInput: any, options?: any, pad?: any) => {
  const seen: any[] = [];

  return (function stringify(suppliedInput, options = {}, pad = ""): any {
    options.indent = options.indent || "  ";
    let tokens: LooseObject = {};

    if (options.inlineCharacterLimit === undefined) {
      tokens = {
        indent: pad + options.indent,
        newLine: "\n",
        newLineOrSpace: "\n",
        pad
      };
    } else {
      tokens = {
        indent: "@@__STRINGIFY_OBJECT_INDENT__@@",
        newLine: "@@__STRINGIFY_OBJECT_NEW_LINE__@@",
        newLineOrSpace: "@@__STRINGIFY_OBJECT_NEW_LINE_OR_SPACE__@@",
        pad: "@@__STRINGIFY_OBJECT_PAD__@@"
      };
    }

    const expandWhiteSpace = (str: string) => {
      if (options.inlineCharacterLimit === undefined)
        return str;

      const oneLined = str
        .replace(new RegExp(tokens.newLine, "g"), "")
        .replace(new RegExp(tokens.newLineOrSpace, "g"), " ")
        .replace(new RegExp(tokens.pad + "|" + tokens.indent, "g"), "");

      if (oneLined.length <= options.inlineCharacterLimit)
        return oneLined;

      return str
        .replace(new RegExp(tokens.newLine + "|" + tokens.newLineOrSpace, "g"), "\n")
        .replace(new RegExp(tokens.pad, "g"), pad)
        .replace(new RegExp(tokens.indent, "g"), pad + options.indent);
    };

    if (seen.indexOf(suppliedInput) !== -1)
      return "\"[Circular]\"";

    if (
      suppliedInput === null ||
      suppliedInput === undefined ||
      typeof suppliedInput === "boolean" ||
      typeof suppliedInput === "function" ||
      typeof suppliedInput === "number" ||
      typeof suppliedInput === "symbol" ||
      isRegexp(suppliedInput)
    ) return String(suppliedInput);

    if (suppliedInput instanceof Date)
      return `new Date("${suppliedInput.toISOString()}")`;

    if (Array.isArray(suppliedInput)) {
      if (suppliedInput.length === 0)
        return "[]";

      seen.push(suppliedInput);

      const ret = "[" + tokens.newLine + suppliedInput.map((el, i) => {
        const eol = suppliedInput.length - 1 === i ?
          tokens.newLine :
          "," + tokens.newLineOrSpace;

        let value = stringify(el, options, pad + options.indent);

        if (options.transform)
          value = options.transform(suppliedInput, i, value);

        return tokens.indent + value + eol;
      }).join("") + tokens.pad + "]";

      seen.pop();
      return expandWhiteSpace(ret);
    }

    if (isObj(suppliedInput)) {
      // @ts-ignore
      let objKeys = Object.keys(suppliedInput).concat(getOwnEnumPropSymbols(suppliedInput));
      // FIXME ^^
      // TypeScript complains of "No overload matches this call", referring to
      // `getOwnEnumPropSymbols(suppliedInput)`. Full error message below:
      //
      // Overload 1 of 2, '(...items: ConcatArray<string>[]): string[]', gave the following error.
      //   Argument of type 'symbol[]' is not assignable to parameter of type 'ConcatArray<string>'.
      //     The types returned by 'slice(...)' are incompatible between these types.
      //       Type 'symbol[]' is not assignable to type 'string[]'.
      //         Type 'symbol' is not assignable to type 'string'.
      // Overload 2 of 2, '(...items: (string | ConcatArray<string>)[]): string[]', gave the following error.
      //   Argument of type 'symbol[]' is not assignable to parameter of type 'string | ConcatArray<string>'.
      //     Type 'symbol[]' is not assignable to type 'string'.

      if (options.filter)
        objKeys = objKeys.filter((el: any) => options.filter(suppliedInput, el));

      if (objKeys.length === 0)
        return "{}";

      seen.push(suppliedInput);

      const ret = "{" + tokens.newLine + objKeys.map((el: any, i: number) => {
        const eol = objKeys.length - 1 === i ?
          tokens.newLine :
          "," + tokens.newLineOrSpace;

        const isSymbol = typeof el === "symbol";
        const isClassic = !isSymbol && /^[a-z$_][a-z$_0-9]*$/i.test(el);

        const key = isSymbol || isClassic ?
          el :
          stringify(el, options);

        let value = stringify(suppliedInput[el], options, pad + options.indent);

        if (options.transform)
          value = options.transform(suppliedInput, el, value);

        return tokens.indent +
          (
            options.strict ?
              options.singleQuotes ?
                `'${String(key)}'` :
                `"${String(key)}"` :
              String(key)
          ) +
          ": " + value + eol;
      }).join("") + tokens.pad + "}";

      seen.pop();
      return expandWhiteSpace(ret);
    }

    suppliedInput = String(suppliedInput).replace(/[\r\n]/g, x => x === "\n" ? "\\n" : "\\r");

    if (!options.singleQuotes) {
      suppliedInput = suppliedInput.replace(/"/g, '\\"');
      return `"${suppliedInput}"`;
    }

    suppliedInput = suppliedInput.replace(/\\?'/g, "\\\'");
    return `'${suppliedInput}'`;
  })(suppliedInput, options, pad);
};
