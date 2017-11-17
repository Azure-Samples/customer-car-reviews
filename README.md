---
services: functions, app-service, event-grid, logic-apps, cosmos-db, cognitive-services
platforms: nodejs
author: nzthiago
---
# Customer Car Reviews

This is a sample application which acts as a Car Review web site. Pictures and text is submitted and then inspected for content to ensure a car has been uploaded. Cars are marked approved while non-cars are marked rejected. Rejected cars get sent to a human reviewer via email for further analysis.

This sample showcases the Azure Serverless services, and takes advantage of Azure Functions, Azure Functions Proxy, Event Grid, Logic Apps, Cognitive Services, Storage Queues and Blobs, and Cosmos DB.

# Running on your Azure Subscription

An ARM template was created so you can deploy the solution to your own subscription. Here is what it creates:

| Azure Service | What is it used for |
|--------|-------|
|Blob Storage|Files for the single page application (SPA) for the website; storage queues for communication between Functions; storing car review images uplodaded via the SPA website|
|Function App|Functions Proxy to service the SPA website|
|Function App|Functions for the website backend (upload image, submit review)|
|Function App|Functions that act as the automated review service (change feed function, check review text, check review image)|
|Logic App|A Logic App workflow that sends notifications to Microsoft Teams and to an email list to notify that a car review has been rejected by the automated service| 
|Cognitive Service|Computer Vision cognitive service account for the automated image review|
|Cognitive Service|Content Moderator cognitive service account for the automated text review|
|Cosmos DB|Cosmos DB with the DocumentDB API to store the JSON documents containing information about a car review|

## Configure Proxy File and Deploy the ARM template

### Unique word as the base of your project
The first step is for you to **think of a short but unique word** - this will be the base of the names of all the services that will be created on your version of this sample. Use parts of your name, or random characters, as long as it's pretty short and doesn't have any special characters.

Have you thoguht of that short unique word? Great, now let's continue.

### Edit Azure Function Proxy 
Now edit the file `proxies.json` in the `src/proxyfunctionapp` folder and replace `YOURUNIQUEWORD` with that unique word.

### Edit ARM Template Parameters and Deploy
Next, deploy the ARM template in the `/src/deployment` folder via your favorite method, making sure to update the `parameters.json` file or override the parameters values for `unique_name` and `notification_emails` at deployment time (unique name is the unique word from earlier!). Make sure to choose `West Central US` or `West US 2` as these are the regions currently supported by Event Grid at the time of writing.  

For example, using the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) you can run the following commands (replace the placeholder values for subscription, group, unique word, and email):
```azurecli
az login

az account set --subscription YOUR-SUBSCRIPTION-NAME-OR-ID

az group create --name YOUR-RESOURCE-GROUP-NAME --location westcentralus

az group deployment create --name nzthicarreviewdeployment --resource-group YOUR-RESOURCE-GROUP-NAME --parameters unique_name=YOUR-SHORT-UNIQUE-WORD notification_emails=YOUR-EMAIL-LIST  --template-file template.json
```

This will create a new Resource Group and all the services on that resource group. Once finished it should look like this in the [Azure Portal](https://portal.azure.com):

![Resource Group View in the Azure Portal](/img/resourcegroup.png)

> Note: This ARM template is pretty powerful - it will have created and configured all the right Application Settings for the three Function Apps, and configured Logic Apps as much as possible. But there are some more steps before we have the sample configured end to end.

> Note: There's a limit of one free Cognitive Service type per subscription. If you have Compute Vision or Content Moderator already you can change the template to use that one, or change the tier to paid. 

## Authorize Office 365 & Event Grid Connections

The Logic Apps Office 365 API Connection is used to send the notification email for a declined review, and the Event Grid connections is used by Logic Apps to subscribe to the Event Grid topic. They need consent in the Azure Portal before being used, so log in to the Azure Portal, find your newly created resource group, then:

- Find the Office 365 API Connection (it'll end in `office365connection`) and open it, then click on `This connection is not authenticated` and then click on `Authorize` then sign in to your Office 365 account:
![Office 365 Connection](/img/office365connection.png)
![Office 365 Connection Authorization](/img/office365authorize.png)

> Note: this sample relies on Office 365 to send the email. You can edit the Logic App and change it to Gmail or other email services if needed.

- Find the Event Grid API Connection (it'll end in `eventgridconnection`) and open it, then click on `This connection is not authenticated`:
![Event Grid Connection](/img/eventgridconnection.png)
![Event Grid Connection Authorization](/img/eventgridauthorize.png)

## Edit and upload SPA Website Files
The next step is to configure our storage account, then build and upload the content of the compiled reviews website to it. The website is an Angular Single Page Application. We will host it on blob storage and exposed via the Proxy function that was created by the ARM template. 

Create a `web` and a `out` container in the blob storage account, with the `out` container having Container access level. To create themvia the Azure CLI, in terminal/command line follow these instructions, replacing the value for your storage account name:
```azurecli
az storage container create -n web --account-name YOUR-STORAGE-ACCOUNT-NAME
az storage container create -n out --account-name YOUR-STORAGE-ACCOUNT-NAME --public-access container
```

Now follow the instructions to configure and build the site locally by following the [instructions for the SPA](src/spa/README.md) with the prod configuration.

Now that you have the SPA site configured and compiled locally, we need to upload it to a new container in the storage account that was created by the ARM template. 

Upload all the content of the `src/spa/dist` folder to the `web` container in your blob storage account, the content in `src/spa/dist/assets` to `web/assets`, and also from `src/spa/dist/assets` to the `out` container. For example, from the Azure CLI browse to the `src/spa/dist` folder and run the following commands, replacing the value for your storage account name:
```azurecli
az storage blob upload-batch --account-name YOUR-STORAGE-ACCOUNT-NAME --destination web --source . --content-type "application/javascript" --pattern "*.js"
az storage blob upload-batch --account-name YOUR-STORAGE-ACCOUNT-NAME --destination web --source . --content-type "text/css" --pattern "*.css"
az storage blob upload-batch --account-name YOUR-STORAGE-ACCOUNT-NAME --destination web --source . --content-type "image/x-icon" --pattern "*.ico"
az storage blob upload-batch --account-name YOUR-STORAGE-ACCOUNT-NAME --destination web --source . --content-type "text/html" --pattern "*.html"
az storage blob upload-batch --account-name YOUR-STORAGE-ACCOUNT-NAME --destination web/assets --source assets/ --content-type "image/jpg" --pattern "*.jpg"
az storage blob upload-batch --account-name YOUR-STORAGE-ACCOUNT-NAME --destination out --source assets/ --content-type "image/jpg" --pattern "*.jpg"
```

# Create Cosmos DB Collection and upload Documents

The `cardb` database should have been aready created for you (by Azure Functions when it first deployed). Now let's create the collection to be used by the sample. Create a new `car` collection with `/name` as the partition key path in the `cardb` database inside your Cosmos DB account. For example, from the Azure CLI run the following commands, replacing the value for your Cosmos DB account name and resource group:
```azurecli
az cosmosdb collection  create --collection-name car --partition-key-path '/name' --db-name cardb --name YOUR-COSMOS-DB-ACCT --resource-group-name YOUR-RESOURCE-GROUP
```

Now let's upload the initial documents to this collection. They will reflect the database entries for the sample images we uploaded to blob storage with the website.
Upload the five `document*.json` files in the `src/deployment` folder to the new `car` collection in your database. You can use Data Explorer in the portal, or other tools.

# TODO:
Overview of final architecture (from slides)
Update slides with new architecture diagram if any
Test instructions end to end

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
Azure App Insights and Azure Log Analytics can be used to monitor Azure Functions and Azure Logic Apps. Investigate how you can enable it for the functions and logic apps to gather telemetry about your solution. Create custom entries for your telemetry too!