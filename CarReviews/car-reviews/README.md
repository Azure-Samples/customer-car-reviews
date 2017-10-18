# CarReviews

Single page application of Car Review App.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.3.

[Demo site](https://carreviewstr.blob.core.windows.net/web/index.html)

## Prerequisite 

Copy and edit the environment variables

```
cd environments
cp enviornment.ts.example environment.ts  // Dev Environment Settings
cp environment.prod.ts.example environment.prod.ts // Production Environment Settings
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

```
$ ng serve
```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build. If your blob storage or proxy's base href is `/web/` then you can build your app like this.

```
$ ng b -prod --base-href /web/
```

## Upload your blob storage

After the `build` step, you can you can find the `dist` directory. You can upload all of these file on the Azure Blob Storage with blog permission.  

## CORS

If you upload the Single Page Application, you need to setup Azure Functions with CORS settings. If you run your app via Blob Storage, you can add CORS of your blob domain url. 

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
