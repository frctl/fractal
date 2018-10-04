"use strict";

const chai = require("chai");
const expect = chai.expect;

const md = require("../src/core/markdown");

describe("Markdown renderer", function() {
  it("does not directly mutate the supplied configuration object", function() {
    const config = {};
    const result = md("**foo**", config);
    expect(config).eql({});
  });
});
