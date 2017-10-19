# CarReviews

Single page application of Car Review App.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.3.

[Demo site](https://carreviewstr.blob.core.windows.net/web/index.html)

## Prerequisite 

### Node 

Download the [node](https://nodejs.org/en/). 6.9.0+ required. However, I recommend 8.5+ You might use the [Azure Functions CLI](https://blogs.msdn.microsoft.com/appserviceteam/2017/09/25/develop-azure-functions-on-any-platform/).It recommend 8.5+   

### Angular CLI

```
npm install -g @angular/cli
```

## Clone this repo

Clone this repo

```
git clone git@github.com:Azure-Samples/customer-car-reviews.git
````

## restore npm

```
cd customer-car-reviews
cd CarReviewes
cd car-reviews
npm install
```

### Configure enviornment settings

In this repo, I include some example settings like `environment.ts.example` and `environment.prod.ts.example`. Create the copy with ust removing `.example` to the same directory. 

In case of mac, 

```
cd src
cd environments
cp enviornment.ts.example environment.ts  
cp environment.prod.ts.example environment.prod.ts 
```

On windows, you can use explore to copy these file and change name into `environment.ts` and `environemnt.prod.ts`. 

You can edit these files to fit your environment. 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

```
$ ng serve
```
Then open your browser and go to `http://127.0.0.1:4200`. **NOTE**: This is NOT `localhost` because of [the issue of webpack with Angular CLI](https://github.com/webpack/webpack-dev-server/issues/416). 

`ng serve` create `dev` environment that uses `environment.ts`. If you want to boot `prod` environment that uses `environment.prod.ts` you can use this

```
$ ng serve --environment prod
```

**NOTE** 
if you have `Cannot read property 'length' of undefined` error, you might forget to create `enviornment.ts` or `environment.prod.ts`.

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
