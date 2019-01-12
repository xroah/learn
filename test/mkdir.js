const { expect } = require("chai");
const fs = require("fs");
const { rmSync } = require("../lib/rm");
const { mkdir, mkdirSync } = require("../lib/mkdir");

describe("mkdir", function () {
    afterEach(function () {
        if (fs.existsSync("./dir")) {
            rmSync("./dir");
        }
    });
    describe("sync", function () {
        it("normal", function () {
            mkdirSync("./dir");
            expect(fs.existsSync("./dir")).to.be.true;
        });
        it("error", function () {
            try {
                mkdirSync("./dir/sub/sub")
            } catch (error) {
                expect(error).to.be.an("error");
            }
        });
        it("recursive", function () {
            mkdirSync("./dir/sub/sub", { recursive: true });
            expect(fs.existsSync("./dir/sub/sub")).to.be.true;
        });
    });
    describe("async", function () {
        it("normal", function (done) {
            mkdir("./dir", function (err) {
                expect(err).to.be.an("undefined");
                expect(fs.existsSync("./dir")).to.be.true;
                done();
            });
        });
        it("error", function (done) {
            mkdir("./dir/sub/sub", function (err) {
                expect(err).to.be.an("error");
                done();
            });
        });
        it("recursive", function (done) {
            mkdir("./dir/sub/sub", { recursive: true }, function (err) {
                expect(err).to.be.an("undefined");
                expect(fs.existsSync("./dir/sub/sub")).to.be.true;
                done();
            });
        });
    });
});