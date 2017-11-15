import * as DB from "documentdb-typescript";
import { Collection } from "documentdb-typescript";

export async function run (context: any, req: any) {
    context.log('JavaScript HTTP trigger function processed a request.');
    let url = process.env["COSMOS_DB_HOST"];
    let key = process.env["COSMOS_DB_KEY"];
    let coll = await new Collection("car","cardb",url, key).openOrCreateDatabaseAsync();
    let state = context.bindingData.state;
    if (state === "approved" || state === "pending" || state === "rejected" ) {
    let allDocs = await coll.queryDocuments({
        query: "select * from car c where c.state = @state order by c.name desc",
        parameters:[{name: "@state", value: state }]},
         {enableCrossPartitionQuery: true, maxItemCount: 10}).toArray();
        context.res = {
            body: allDocs
        }
    } else {
        context.res = {
            status: 400,
            body: "Please pass the correct state! State is only allowed ( approved | pending | rejected )"
        };
    }
    context.done();
};