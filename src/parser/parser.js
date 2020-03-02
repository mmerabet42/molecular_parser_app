function isChar(ch) {
    return typeof ch === "string" && ch.length === 1;
}

export function isUpper(ch) {
    return isChar(ch) && ch >= 'A' && ch <= 'Z';
}

export function isLower(ch) {
    return isChar(ch) && ch >= 'a' && ch <= 'z';
}

export function isAlpha(ch) {
    return isUpper(ch) || isLower(ch);
}

export function isDigit(ch) {
    return isChar(ch) && ch >= '0' && ch <= '9';
}

class Parser {
    constructor(str, groups, data) {
        this.str = str;
        this.i = 0;
        this.data = data;
        if (groups === undefined)
            this.groups = [];
        else
            this.groups = groups;
    }

    run(parserFunc) {
        let tmpI = this.i;
        let i = parserFunc(this);
        if (i === false) {
            this.i = tmpI;
            return false;
        }
        this.i = tmpI + i;
        return i;
    }

    group(groupName, parserFunc) {
        let tmpGroups = this.groups;
        this.groups = [];

        let tmpI = this.i;
        let i = this.run(parserFunc);
        if (i === false) {
            this.groups = tmpGroups;
            return false;
        }
        tmpGroups.push({
            name: groupName,
            str: this.str,
            substr: (i === 0 ? "" : this.str.substring(tmpI, tmpI + i)),
            i: tmpI,
            len: i,
            groups: this.groups
        });
        this.groups = tmpGroups;
        return i;
    }

    loop(from, to, parserFunc) {
        let totalRet = 0;
        let tmpBeforeLoop = this.i;
        let groupIndex = this.groups.length - 1;
        for (let i = 0; i < from; ++i) {
            let ret = this.run(parserFunc);
            if (ret === false) {
                this.i = tmpBeforeLoop;
                this.groups.splice(groupIndex);
                return false;
            }
            totalRet += ret;
        }
        for (let i = from; to === -1 || i < to; ++i) {
            let ret = this.run(parserFunc);
            if (ret === false && to === -1)
                return totalRet;
            else if (ret === false) {
                this.i = tmpBeforeLoop;
                this.groups.splice(groupIndex);
                return false;
            }
            totalRet += ret;
        }
        return totalRet;
    }

    or(parserFuncs) {
        for (let i = 0; i < parserFuncs.length; ++i) {
            let ret = this.run(parserFuncs[i]);
            if (ret !== false)
                return ret;
        }
        return false;
    }

    advance(i) {
        if (i === undefined)
            ++this.i;
        else
            this.i += i;
        return true;
    }
}

export function parse(parserFunc, str, groups, data) {
    let parser = new Parser(str, groups, data);
    return parserFunc(parser);
}