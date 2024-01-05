const Jasmine = require("jasmine");
const JasmineConsoleReporter = require("jasmine-console-reporter");

/**
 * Run StoreFront App Test Cases
 */
function testStoreFrontAppModule() {
    const jasStoreFront = new Jasmine();
    jasStoreFront.loadConfig({
        "spec_dir": "spec",
        "spec_files": ["**/*.spec.js"],
        "helpers": ["helpers/**/*.js"],
        "stopSpecOnExpectationFailure": true,
        "random": false,
    });

    const reporter = new JasmineConsoleReporter({
        colors: 1, // (0|false)|(1|true)|2
        cleanStack: 1, // (0|false)|(1|true)|2|3
        verbosity: 4, // (0|false)|1|2|(3|true)|4|Object
        listStyle: "indent", // "flat"|"indent"
        timeUnit: "ms", // "ms"|"ns"|"s"
        timeThreshold: { ok: 500, warn: 1000, ouch: 3000 }, // Object|Number
        activity: false, // boolean or string ("dots"|"star"|"flip"|"bouncingBar"|...)
        emoji: true,
        beep: true,
    });

    jasStoreFront.addReporter(reporter);
    jasStoreFront.execute();
    return jasStoreFront;
}

/**
 * Start Test cases
 */
(function main() {
    testStoreFrontAppModule();
})();
