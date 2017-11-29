---
services: functions, app-service, event-grid, logic-apps, cosmos-db, cognitive-services
platforms: nodejs
author: nzthiago
---
# Customer Car Reviews

This is a sample application which acts as a Car Review web site. Pictures and text is submitted and then inspected for content to ensure a car has been uploaded. Cars are marked approved while non-cars are marked rejected. Rejected cars get sent to a human reviewer via email for further analysis.

This sample showcases the Azure Serverless services, and takes advantage of Azure Functions, Azure Functions Proxy, Event Grid, Logic Apps, Cognitive Services, Storage Queues and Blobs, and Cosmos DB.

# Deploying to your Azure Subscription
An ARM template is in this repo that creates all the Azure services for the solution. Here is what it creates:

| Azure Service | What is it used for |
|--------|-------|
|Blob Storage|Files for the single page application (SPA) for the website; storage queues for communication between Functions; storing car review images uplodaded via the SPA website|
|Function App|Functions Proxy to service the SPA website|
|Function App|Functions for the website backend (upload image, submit review)|
|Function App|Functions for the automated review service (change feed function, check review text, check review image)|
|Logic App|A Logic App workflow that sends notifications to an email list about a rejected car review| 
|Cognitive Service|Computer Vision cognitive service account for the automated image review|
|Cognitive Service|Content Moderator cognitive service account for the automated text review|
|Cosmos DB|Cosmos DB with the DocumentDB API to store the JSON documents containing information about a car review|

## Unique word as the base of your project
The first step is for you to **think of a short but unique word** - this will be the base of the names of all the services that will be created on your version of this sample. Use parts of your name, or random characters, as long as it's short and doesn't have any special characters.

Have you thought of that short unique word? Great, now let's continue.

## Edit ARM Template Parameters and Deploy
Next, deploy the ARM template in the `/src/deployment` folder via your favorite method, making sure to update the `parameters.json` file or override the parameters values for `unique_name` and `notification_emails` at deployment time (unique name is the unique word from earlier!). At the time of writing, Event Grid is only supported in `West Central US` or `West US 2`, so choose one of these regions as the location.  

For example, using the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) you can run the following commands from the `src/deployment` folder (replace the placeholder values for subscription, group, unique word, and email):
```azurecli
az login

az account set --subscription YOUR-SUBSCRIPTION-NAME-OR-ID

az group create --name YOUR-RESOURCE-GROUP-NAME --location westcentralus

az group deployment create --name nzthicarreviewdeployment --resource-group YOUR-RESOURCE-GROUP-NAME --parameters unique_name=YOUR-SHORT-UNIQUE-WORD notification_emails=YOUR-EMAIL-LIST --template-file template.json
```

This will create a new Resource Group and all the services used by our sample in that resource group. Once finished it should look like this in the [Azure Portal](https://portal.azure.com):

![Resource Group View in the Azure Portal](/img/resourcegroup.png)

> Note: This ARM template is pretty powerful - it will have created and configured all the right Application Settings for the backend and review service Function Apps, and configured Logic Apps as much as possible. But there are some more steps before we have the sample configured end to end.

> Note: There's a limit of one free Cognitive Service type per subscription. If you already have Compute Vision or Content Moderator in your subscription you can change update the ARM template to use that one, or change the tier of the ones being created by the templated to a paid tier. 

## Authorize Office 365 & Event Grid Connections

The Logic Apps Office 365 API Connection is used to send the notification email for a declined review, and the Event Grid connections is used by Logic Apps to subscribe to the Event Grid topic. They need consent in the Azure Portal before being used, so log in to the Azure Portal, find your newly created resource group, then:

- Find the Office 365 API Connection (it'll end in `office365connection`), open it, then click on `This connection is not authenticated` and then click on `Authorize` then sign in to your Office 365 account to authenticate, then click save:
![Office 365 Connection](/img/office365connection.png)
![Office 365 Connection Authorization](/img/office365authorize.png)

> Note: this sample relies on Office 365 to send the email. You can edit the Logic App and change it to Gmail or other email services if needed.

- Find the Event Grid API Connection (it'll end in `eventgridconnection`), and do the same:
![Event Grid Connection](/img/eventgridconnection.png)
![Event Grid Connection Authorization](/img/eventgridauthorize.png)

Finally, open the Logic App from the Azure Portal (the logic app name will end in `handlerejectedreviewlogic`) and `Disable` it then `Enable` the Logic App from the Overview panel. This will make the Logic App subscribe to Event Grid properly now that you've authenticated the Event Grid API connection. You should see a `Succeeded` status in your trigger history if you refresh the overview panel now:
![Logic App Trigger Enabled](/img/logicappenabled.png)

## Build SPA Website
Now let's configure and build the web application for the sample.

### restore npm

Browse to the `src/spa` folder and restore the npm packages:
```azurecli
npm install
```

### Configure environment settings

In `src/spa/src/environments` you will find two example settings files, `environment.ts.example`, and `environment.prod.ts.example`. Create a copy of one of them, removing `.example`, to the same directory. 

In case of Mac, for example:
```azurecli
cd environments
cp environment.ts.example environment.ts  
cp environment.prod.ts.example environment.prod.ts 
```

On Windows, you can use explorer to copy these file and change name into `environment.ts` and `environemnt.prod.ts`. 

For deploying to your Azue subscription edit the values in `environemnt.prod.ts` with the right URLs for the three functions and the storage account from the deployment. That is, you will need to update the values for the following:
- fileUploadUrl
- getCarsUrl
- createCarUrl
- imageBlobUrl

You can get the values for fileUploadUrl, getCarsUrl, and createCarUrl from the Azure portal by finding your 'UNIQUE-WORDsitebackend' function app and going into each of those functions then getting the function URL, as shown [here](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function#test-the-function).

Also note that the URL for getCars will have `{state:alpha}` in it and you must change it to just `{state}`.

Change the value for imageBlobUrl will to the following, replacing the value for YOUR-STORAGE-ACCOUNT: https://YOUR-STORAGE-ACCOUNT.blob.core.windows.net/out/

### Build

Now let's use the Angular CLI to build the project ([install Angular](https://github.com/angular/angular-cli#installation) first if you don't have it). The build artifacts will be stored in the `dist` directory. Use the `-prod` flag for a production build before uploading to Azure. The blob storage and proxy base href is `/` so  build your app like this:

```azurecli
ng b -prod --base-href /
```

## Create Containers and Upload SPA Website Files
The next step is to configure the storage account, then upload the content of the compiled reviews website to it. The website is an Angular Single Page Application. We will host it on blob storage and expose it via the Proxy function that was created by the ARM template. 

Create a `web` and a `out` container in the blob storage account, with both containers having Container public access level. To create them via the Azure CLI, in terminal/command line follow these instructions, replacing the value for your storage account name:
```azurecli
az storage container create -n web --account-name YOUR-STORAGE-ACCOUNT-NAME --public-access container

az storage container create -n out --account-name YOUR-STORAGE-ACCOUNT-NAME --public-access container
```

Now we will to upload the site files to the storage containers.

Upload all the content of the `src/spa/dist` folder to the `web` container in your blob storage account; upload the content in `src/spa/dist/assets` to `web/assets`; and also upload the content from `src/spa/dist/assets` to the `out` container. For example, from the Azure CLI browse to the `src/spa/dist` folder and run the following commands, replacing the value of your storage account name:
```azurecli
az storage blob upload-batch --account-name YOUR-STORAGE-ACCOUNT-NAME --destination web --source . --content-type "application/javascript" --pattern "*.js"

az storage blob upload-batch --account-name YOUR-STORAGE-ACCOUNT-NAME --destination web --source . --content-type "text/css" --pattern "*.css"

az storage blob upload-batch --account-name YOUR-STORAGE-ACCOUNT-NAME --destination web --source . --content-type "image/x-icon" --pattern "*.ico"

az storage blob upload-batch --account-name YOUR-STORAGE-ACCOUNT-NAME --destination web --source . --content-type "text/html" --pattern "*.html"

az storage blob upload-batch --account-name YOUR-STORAGE-ACCOUNT-NAME --destination web/assets --source assets/ --content-type "image/jpg" --pattern "*.jpg"

az storage blob upload-batch --account-name YOUR-STORAGE-ACCOUNT-NAME --destination out --source assets/ --content-type "image/jpg" --pattern "*.jpg"
```

## Configure the Proxy Function App

Right now your Proxy Function App is empty, it doesn't have any proxies configured. Create three proxies in it with the following values, but replace YOUR-STORAGE-ACCOUNT-NAME with your storage account name:

| Name | Match Condition | Backend URI |
|--------|-------|-------|
|webindex|/|https://YOUR-STORAGE-ACCOUNT-NAME.blob.core.windows.net/web/index.html|
|web|/{*url}|https://YOUR-STORAGE-ACCOUNT-NAME.blob.core.windows.net/web/{url}|
|Dashboard|/dashboard|https://YOUR-STORAGE-ACCOUNT-NAME.blob.core.windows.net/web/index.html|

Here's a view of the Azure Portal with the proxy function selected and the three proxies configured, with the `web` one selected:
![Proxy](/img/proxy.png)

## Create Cosmos DB Collection and upload Documents

Now create a database called `cardb` in your Cosmos DB account with the SQL (DocumentDB API). Then create a new `car` collection with `/name` as the partition key path in the `cardb` database. For example, from the Azure CLI run the following commands, replacing the value for your Cosmos DB account name and resource group:
```azurecli
az cosmosdb database  create --db-name cardb --name YOUR-COSMOS-DB-ACCT --resource-group-name YOUR-RESOURCE-GROUP

az cosmosdb collection  create --collection-name car --partition-key-path '/name' --db-name cardb --name YOUR-COSMOS-DB-ACCT --resource-group-name YOUR-RESOURCE-GROUP
```

There are five JSON files called `document{NUMBER}.json` in the `src/deployment` folder. Edit each of those files to replace `YOUR-STORAGE-ACCOUNT-NAME` with your new storage account name.

Then upload those five files to the new `car` collection in your Cosmos DB database. These will be the database entries for the sample images we uploaded to blob storage with the website. 

You can use the `Upload` tool in Data Explorer from the Cosmos DB panel in the Azure Portal for example. You should end up with five entries based on the content of those five files. Here's a view from the Document Explorer option in the Cosmos DB panel in the Azure Portal with the first one selected:
![Documents in Cosmos DB](/img/documents.png)

## Try it out!

Now that you have the sample configured end to end, you can browse to it by going to the URL of the proxy function. When you browse to it, it should look like the following:
![Sample site](/img/site.png)

# Session Slides

This demo was created for the Microsoft Keynote at Serverlessconf Tokyo in November 2017. You can [download the slides here](/ServerlessConfTokyo2017MicrosoftKeynote).

# Challenges for you!

Here are some other ways the solution could have been architected. Are you up to the challenge?

## Challenge 1: More Logic Apps 
The Logic App could be used to be the workflow for the entire review service - that is, the Logic App gets called by the Change Feed Function for each new car review, then calls the text and image review functions (or calls Cognitive Services directly), and then goes into the human approval workflow for rejected reviews.

## Challenge 2: More Event Grid
The communication between functions could have been done using Event Grid instead of Azure Queues; we used queues to show how it is currently done and how storage queues (or Service Bus queues for extra enterprise level messaging) can be used for communication between services. But Event Grid can be used in this solution for all the messaging; this would make the functions trigger each other via push (i.e., no polling!. Can you update the sample and replace all the Azure Storage Queues with Event Grid instead?

## Challenge 3: Durable Functions
[Durable Functions](https://docs.microsoft.com/en-us/azure/azure-functions/durable-functions-overview) is a feature currently in preview that lets you define stateful workflows between functions. It only supports C# at the moment. Are you up to the challenge to rewrite the Functions in the reviews service to C# and creating a durable function to coordinate them all via the Function Chaining or the Fan-out/fan-in patterns?

## Challenge 4: Telemetry
Azure App Insights and Azure Log Analytics can be used to [monitor Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-monitoring) and to monitor [Azure Logic Apps](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-monitor-your-logic-apps-oms). Investigate how you can enable it for the functions and logic apps to gather telemetry about your solution. Create custom entries for your telemetry too!
