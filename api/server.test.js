const server = require("./server");
const tester = require("supertest");

// Write your tests here
test("sanity", () => {
  expect(true).toBe(true);
});

describe("Server tests", () => {
  test("The server runs", () => {
    expect(server).toBeDefined();
  });
  test("server responds when incorrect endpoint?", async () => {
    const res = await tester(server).get("/brokenlinkexample");
    const answer = res.body;
    expect(answer).toMatchObject({ message: "that does not exist" });
  });
  test("Jokes should be truthy", function () {
    return tester(server)
      .get("/api/jokes/")
      .then((res) => {
        expect(res.type).toBeTruthy();
      });
  });
  test("Get returns a server message", async () => {
    const res = await tester(server).get("/");
    const answer = res.body;
    expect(answer).toBeTruthy();
    expect(answer).toMatchObject({ message: "Welcome to the Jokes server." });
  });
});
