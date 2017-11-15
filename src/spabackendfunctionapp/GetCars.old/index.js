"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const documentdb_typescript_1 = require("documentdb-typescript");
function run(context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('JavaScript HTTP trigger function processed a request.');
        let url = process.env["COSMOS_DB_HOST"];
        let key = process.env["COSMOS_DB_KEY"];
        let coll = yield new documentdb_typescript_1.Collection("car", "cardb", url, key).openOrCreateDatabaseAsync();
        //    let allDocs = await coll.queryDocuments().toArray();
        let state = context.bindingData.state;
        if (state === "approved" || state === "pending" || state === "rejected") {
            let allDocs = yield coll.queryDocuments({
                query: "select * from car c where c.state = @state order by c.name desc",
                parameters: [{ name: "@state", value: state }]
            }, { enableCrossPartitionQuery: true, maxItemCount: 10 }).toArray();
            context.res = {
                body: allDocs
            };
        }
        else {
            context.res = {
                status: 400,
                body: "Please pass the correct state! State is only allowed ( approved | pending | rejected )"
            };
        }
        // context.done();
    });
}
exports.run = run;
;
//# sourceMappingURL=index.js.map