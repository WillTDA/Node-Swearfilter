/**
 * @extends RegExp
 */
class filterExp extends RegExp {
    /**
     * @param {String} regex
     * @param {Array.<String>} ignore
     */
    constructor(regex, ignore = []) {
        super(regex)

        this.text = regex

        this.ignore = ignore.map(x => new RegExp(x))
    }

    /**
     * @param {String} str
     * @param {?Array.<String>} ignore
     * @returns {Boolean}
     */
    test(str, ignore = []) {
        if (!str.match(this)) return false

        if ([
            ...this.ignore,
            ...ignore.filter(x => x.match(this)).map(x => new RegExp(x))
        ].some(x => str.match(x))) return false

        return true
    }
}

module.exports = filterExp