import faker from "faker";
import fetchMock from "fetch-mock";
import sinon from "sinon";
import test from "ava";

import Index from "../index";

const body = { attribute: "value" };
const fetchSpy = sinon.spy(fetchMock, "fetchHandler");
const url = faker.internet.url();

test.before(() => fetchMock.mock("*", { response: true }));
test.afterEach(() => {
    fetchMock.resetHistory();
    fetchSpy.resetHistory();
});
test.after(() => {
    fetchMock.restore();
    fetchSpy.restore();
});

test("is a function", (t) => t.is(typeof new Index(url).create, "function"));

test("returns a Promise", (t) => t.true(new Index(url).create() instanceof Promise));

test("invokes \"fetch\" with the header \"Content-Type\" set to \"application/json\"", (t) => {
    new Index(url).create();
    t.is(fetchSpy.lastCall.args[1].headers.get("Content-Type"), "application/json");
});

test("invokes \"fetch\" with the \"body\" set to a stringified Object", (t) => {
    new Index(url).create(body);
    t.true(fetchSpy.calledWithMatch(url, { body: JSON.stringify(body) }));
});
