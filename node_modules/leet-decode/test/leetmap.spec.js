const {expect} = require('chai');
const {decode} = require('../src/leetmap');

describe('decode', () => {
    describe('given a simple string', () => {
        const testString = "hello";

        it('returns the same string', () => {
            expect(testString).to.equal(decode(testString)[0]);
        });
    });

    describe('given a simple leet phrase', () => {
        const testString = "h3llo";
        const outputString = "hello";

        it('returns the translated string', () => {
            expect(decode(testString)[0]).to.equal(outputString);
        });
    });

    describe("given a simple leet phrase", () => {
      const testString = "h3llo";
      const outputString = "hello";

      it("returns the translated string", () => {
        expect(decode(testString)[0]).to.equal(outputString);
      });
    });

    describe('given a leet phrase that can be translated multiple ways', () => {
        const testString = "9ong";
        let results;

        before(() => {
            results = decode(testString);
        });

        it('returns multiple translated words', () => {
            expect(results).to.contain('gong');
            expect(results).to.contain('pong');
        });
    });
});
