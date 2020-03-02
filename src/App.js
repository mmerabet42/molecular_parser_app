import React from 'react';
import parseFormula from './parser/molecularParser';
import AnimatedInput from './components/AnimatedInput';
import styled from 'styled-components';
import './index.css';

export default class App extends React.Component {
    state = {
        formula: "",
        atoms: null
    };

    parseMolecule = () => {
        let ret = parseFormula(this.state.formula);

        if (ret.syntaxError !== false) {
            this.setState({
                atoms: "Syntax error on index " + ret.syntaxError
            });
            return;
        }

        const colors = [ "#09262A", "#1A455D", "#DDC9AE", "#E6C389", "#CC5F4F" ];

        let atoms = [];
        let i = 0;
        for (var atom in ret.atoms) {
            atoms.push(
                <Atom color={colors[i++]}>
                    <p>{atom} → {ret.atoms[atom]}</p>
                </Atom>
            );
            if (i === colors.length)
                i = 0;
        };
        this.setState({ atoms });
    }

    render() {
        return (
            <Container>
                <CustomAnimatedInput type="text" onChange={e => this.setState({ formula: e.target.value })} label="Formula" />
                <Button onClick={this.parseMolecule}>PARSE</Button>
                <AtomsContainer>
                    {this.state.atoms}
                </AtomsContainer>
            </Container>
        )
    }
};

const CustomAnimatedInput = styled(AnimatedInput)`
    width: 50%;
`;

const Container = styled('div')`
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;

    * {
        padding: 10px;
    }
`;

const Button = styled('button')`
    border: none;
    outline: none;
    text-decoration: none;
    background-color: #4E9D8E;
    color: white;
    font-family: inherit;
    font-size: 20px;
    padding-left: 10px;
    padding-right: 10px;
    transition: 0.2s;

    :hover {
        padding-left: 20px;
        padding-right: 20px;
    }
`;

const AtomsContainer = styled('div')`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
`;

const Atom = styled('div')`
    color: white;
    background-color: ${ props => props.color };
    align-items: center;
    justify-content: center;
`;