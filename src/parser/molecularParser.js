import {
    isUpper, isLower, isDigit, parse
} from "./parser.js";

// ( upper lower* )
function atomLetterParser(parser) {
    if (isUpper(parser.str[parser.i])) {
        let i = 1;
        while (isLower(parser.str[parser.i + i]))
            ++i;
        return i;
    }
    return false;
}

// ( digit+ )
function atomIndexParser(parser) {
    let i = 0;
    while (isDigit(parser.str[parser.i + i]))
        ++i;
    return i;
}

// ( <atomLetterParser> <atomIndexParser> )
function atomDefParser(parser) {
    let i = parser.group("AtomLetter", atomLetterParser);
    if (i === false)
        return false;
    return i + parser.group("Index", atomIndexParser);
}

// ( OpeningBracket <allAtomParser> ClosingBracket <atomIndexParser?> )
function atomBracketParser(parser) {
    const brackets = { '(' : ')', '[' : ']', '{' : '}'};

    if (parser.str[parser.i] in brackets) {
        let bracket = parser.str[parser.i];
        parser.advance();

        let ret = parser.group("Bracket", allAtomParser);
        if (ret === false || parser.str[parser.i] !== brackets[bracket])
            return false;
        parser.advance();
        
        return ret + parser.group("Index", atomIndexParser) + 2;
    }
    return false;
}

// ( atomDefParser | atomBracketParser )*
function allAtomParser(parser) {
    let ret = parser.loop(0, -1, parser => {
        return parser.or([
            atomDefParser,
            atomBracketParser
        ])
    });
    return ret;
}

function countAtoms(groups, atoms) {
    for (let i = 0; i < groups.length; i += 2) {
        let index = 1;
        if (groups[i + 1].name === "Index" && groups[i + 1].len > 0)
            index = parseInt(groups[i + 1].substr);

        if (groups[i].name === "Bracket") {
            let bracketAtoms = {};
            countAtoms(groups[i].groups, bracketAtoms);
            for (let atom in bracketAtoms) {
                if (!atoms[atom])
                    atoms[atom] = bracketAtoms[atom] * index;
                else
                    atoms[atom] += bracketAtoms[atom] * index;
            }
        }
        else if (groups[i].name === "AtomLetter") {
            if (!atoms[groups[i].substr])
                atoms[groups[i].substr] = index;
            else
                atoms[groups[i].substr] += index;

        }
    }
}

// Parse the string and return the atoms's count
export default function parseFormula(formula) {
    let groups = [];
    let ret = parse(allAtomParser, formula, groups);
    
    if (ret !== formula.length) {
        return { syntaxError: ret };
    };

    let atoms = {};
    countAtoms(groups, atoms);
    return {
        syntaxError: false,
        atoms: atoms
    };
}