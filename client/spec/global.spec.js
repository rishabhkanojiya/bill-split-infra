function delayTime() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 30000);
    });
}

beforeAll(async () => {
    console.log("beforeAll:started");
    console.log("beforeAll:completed");
});
afterAll(async () => {
    console.log("afterAll:started");
    console.log("afterAll:completed");
});
