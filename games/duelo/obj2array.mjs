import babel from '@babel/core';
import { readFileSync, writeFileSync } from 'fs';

const code = readFileSync('./dist/main.js', 'utf8');

// Plugin to replace object expressions with array expressions
// Turns out it doesn't improve the zipped size

const output = babel.transformSync(code, {
  plugins: [
    function replaceObjectExpressionWithArrayExpressions({ types: t}) {
      return {
        visitor: {
          ObjectExpression(path) {
            const properties = path.node.properties;
            const isArrayExpression = properties.every((prop, index) => {
              if (
                t.isObjectProperty(prop) &&
                t.isNumericLiteral(prop.key) &&
                prop.key.value === index
              ) {
                return true;
              }
              return false;
            });
    
            if (isArrayExpression) {
              const elements = properties.map((prop) => prop.value);
              const arrayExpression = t.arrayExpression(elements);
              path.replaceWith(arrayExpression);
            }
          }
        },
      };
    },
  ],
});

writeFileSync('./dist/main.js', output.code);