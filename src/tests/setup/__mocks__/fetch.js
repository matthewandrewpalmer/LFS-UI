import {valueLabelsData, variableDefinitionData} from "./mock_data";

export default function(url, payload) {
    console.log(url);
    switch (url) {
        case "/imports/survey/gb/2019/1":
            let GbFileName = payload.body.get("lfsFile").name;
            if (GbFileName === "GB_File_invalid_file.sav") {
                return Promise.resolve({
                    status: 200,
                    json: () => Promise.resolve({status: "ERROR", errorMessage: "Error Occurred"})
                });
            } else if (GbFileName === "GB_File_server_not_online.sav") {
                // Mock server not being online
                return Promise.reject("SyntaxError: Unexpected token P in JSON at position 0");
            } else {
                return Promise.resolve({status: 200, json: () => Promise.resolve({status: "OK"})});
            }
        case "/imports/survey/ni/2019/5":
            let NiFileName = payload.body.get("lfsFile").name;
            if (NiFileName === "NI_File_unknown_error.sav") {
                return Promise.resolve({status: 200, json: () => Promise.resolve({status: "999"})});
            } else if (NiFileName === "NI_File_weird_error.sav") {
                return Promise.reject("Something strange has Occurred here");
            }
        case "/imports/design/weights": {
            console.log(url);
            return Promise.resolve({status: 200, json: {status: "OK"}});
        }
        case "/audits/week/2019/1":
            console.log(url);
            return Promise.resolve({
                status: 200, json: () => Promise.resolve([{
                    uploadDate: "2020-01-09T12:57:45.013877Z",
                    status: 3,
                    message: "Insert survey row failed"
                }])
            });
        case "/audits/month/2019/5":
            console.log(url);
            return Promise.resolve({status: 200, json: () => Promise.resolve(undefined)});
        case "/login/Admin":
            if (payload.headers.password === "password") {
                return Promise.resolve({status: 200, json: () => Promise.resolve({status: "OK"})});
            } else {
                return Promise.resolve({status: 400, json: () => Promise.resolve({status: "ERROR"})});
            }
        case "/variable/definitions":
            if (process.env.NODE_ENV === "noData") {
                return Promise.resolve({status: 200, statusText: "OK", json: () => Promise.resolve({message: "no data found"})});
            } else if (process.env.NODE_ENV === "returnError") {
                return Promise.reject("SyntaxError: Unexpected token P in JSON at position 0");
            } else {
                return Promise.resolve({status: 200, statusText: "OK", json: () => Promise.resolve(variableDefinitionData)});
            }
        case "/value/labels":
            if (process.env.NODE_ENV === "noData") {
                return Promise.resolve({status: 200, statusText: "OK", json: () => Promise.resolve({message: "no data found"})});
            } else if (process.env.NODE_ENV === "returnError") {
                return Promise.reject("SyntaxError: Unexpected token P in JSON at position 0");
            } else {
                return Promise.resolve({status: 200, statusText: "OK", json: () => Promise.resolve(valueLabelsData)});
            }
        default:
            console.log("default");
            return Promise.reject("URL not Mocked For Test");
    }
}
