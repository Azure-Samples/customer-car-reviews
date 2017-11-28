# Car Reviews SPA Instructions

Here are the instructions on how to configure and build the Single Page Application of Car Review App.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.3. However, upgraded to 1.5.4.

[Demo site](https://carreviewstr.blob.core.windows.net/web/index.html)

## Prerequisite 

### Node 

Download the [node](https://nodejs.org/en/). 6.9.0+ required. However, I recommend 8.5+ You might use the [Azure Functions CLI](https://blogs.msdn.microsoft.com/appserviceteam/2017/09/25/develop-azure-functions-on-any-platform/).It recommend 8.5+   

### Angular CLI

```
npm install -g @angular/cli
```

## restore npm

Browse to the `src/spa` folder and restore the npm packages:
```
cd customer-car-reviews/src/spa/src
npm install
```

### Configure environment settings

In this repo, I include two example settings files, `environment.ts.example`, and `environment.prod.ts.example`. Create a copy of one of them, removing `.example`, to the same directory. 

In case of Mac, for example:
```
cd environments
cp enviornment.ts.example environment.ts  
cp environment.prod.ts.example environment.prod.ts 
```

On Windows, you can use explore to copy these file and change name into `environment.ts` and `environemnt.prod.ts`. 

Then edit the values in these files to fit your environment. You will need to update the values for the following:
- fileUploadUrl
- getCarsUrl
- createCarUrl
- imageBlobUrl

You can get the values for fileUploadUrl, getCarsUrl, and createCarUrl from the Azure portal by finding your 'UNIQUE-WORDsitebackend' function app and going into each of those functions then getting the function URL, as shown [here](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function#test-the-function).

The value for imageBlobUrl will be: https://YOUR-STORAGE-ACCOUNT.blob.core.windows.net/out/

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist` directory. Use the `-prod` flag for a production build before uploading to Azure. The blob storage and proxy base href is `/` so  build your app like this:

```
$ ng b -prod --base-href /
```

Now you can return to the main Readme to continue configuring the sample.

# Optional if you want to test locally 

## Local Development

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

```
$ ng serve
```
Then open your browser and go to `http://127.0.0.1:4200`. **NOTE**: This is NOT `localhost` because of [the issue of webpack with Angular CLI](https://github.com/webpack/webpack-dev-server/issues/416). 

`ng serve` creates a `dev` environment that uses `environment.ts`. If you want to boot `prod` environment that uses `environment.prod.ts` you can use this

```
$ ng serve --environment prod
```

> Note: if you run into `Cannot read property 'length' of undefined` error, you might have forgotten to create `enviornment.ts` or `environment.prod.ts`.


## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
