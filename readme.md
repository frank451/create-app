# project setup

## based on create react app as a starting point

https://facebook.github.io/create-react-app/docs/getting-started

## node

-   .nvmrc

## webpack

-   including webpack-dev-server

## babel

-   extract from package.json to babel.config.js
    https://babeljs.io/docs/en/configuration

## easy imports (absolute over relative)

```
import Button from 'ui/buttons/Button';`
```

webpack

```
'ui': path.resolve(paths.appSrc, 'components/ui/')
```

## css modules

## sass

-   sass recource loader

## eslint

-   extract from package.json
    https://eslint.org/docs/user-guide/configuring
    https://eslint.org/docs/user-guide/configuring#configuration-file-formats
-   autofix only

## stylelint

-   autofix only

## browserlist

-   as recommended left in package.json
    https://github.com/browserslist/browserslist

## svg

-   https://github.com/smooth-code/svgr
    https://material.io/tools/icons/?style=baseline

## styleguide

-   https://react-styleguidist.js.org/

## testing

-   jest config extract from package.json to jest.config.js
    https://jestjs.io/docs/en/configuration
-   jest put module resolution ("moduleNameMapper") to abs path (according to webpack alias)
    https://jestjs.io/docs/en/configuration.html#modulenamemapper-object-string-string

## documenting

-   for components styleguide is used
-   for others esdoc

## accessibility

````

```

```
````
