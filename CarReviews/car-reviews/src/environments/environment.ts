// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  fileUploadUrl: "http://localhost:7071/api/FileUploadNode/{filename}",
  getCarsUrl: "http://localhost:7071/api/GetCars/{state}",
  createCarUrl: "https://prod-04.japaneast.logic.azure.com:443/workflows/927454cc9b04458cb57f64fec0508327/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=tG6b9ETTbD-Gee2ZPoHb6PSq5m0qHG1wxW5PjxubSL0",
  imageBlobUrl: "https://carreviewstorage.blob.core.windows.net/outcontainer/",
};
