const payload = require("./components/response.swagger.json");
const fs = require("fs");
function underScoreToClassName(str) {
    return str
        .split("_")
        .map((word) => (word = `${word[0].toUpperCase()}${word.slice(1)}`))
        .join("");
}
function hasObject(objSchema) {
    if (!objSchema) {
        false;
    }
    if (objSchema.type === "object") {
        return true;
    }
    if (
        objSchema.type === "array" &&
        objSchema.items &&
        objSchema.items.type == "object"
    ) {
        return true;
    }
    return false;
}
function generateRefs(payloadObj, rootObj, parentClass = "") {
    Object.keys(payloadObj).forEach((key, index) => {
        if (hasObject(payloadObj[key])) {
            let className = underScoreToClassName(key);
            className = `${parentClass}${className}`;
            // }
            let obj = payloadObj[key];
            if (obj.type === "array") {
                obj = obj.items;
                payloadObj[key].items = {};
                payloadObj[key] = payloadObj[key].items;
            } else {
                payloadObj[key] = {};
            }
            payloadObj[key].$ref = `#/components/schemas/${className}`;
            if (!rootObj) {
                rootObj = payloadObj;
            }
            if (rootObj[className]) {
                className = className + parentClass;
                // throw Error(`Same class name present at root: ${className}`)
            }
            // rootObj[className] = obj;
            payload.components.schemas[className] = obj;
            generateRefs(obj.properties, rootObj, className);
        }
    });
    return rootObj;
}

let jsonData = {
    components: {
        responses: {},
        examples: {},
        schemas: {},
    },
};

Object.keys(payload.components.responses).forEach((key) => {
    // console.log(key);
    payload.components.responses[key].content["application/json"] =
        generateRefs(
            payload.components.responses[key].content["application/json"],
            payload.components.responses[key].content["application/json"],
            key
        );
});

jsonData.components.responses = payload.components.responses;

// Object.keys(payload.components.schemas).forEach((key) => {
//     console.log(payload.components.schemas[key]);

// })
payload.components.schemas = generateRefs(
    payload.components.schemas,
    payload.components.schemas
);
jsonData.components.schemas = payload.components.schemas;
jsonData.components.examples = payload.components.examples;
// console.log(JSON.stringify(jsonData.components, undefined, 2));
fs.writeFileSync(
    "./components/response.swagger.json",
    JSON.stringify(jsonData, undefined, 2)
);
