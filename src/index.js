import React from 'react';
import ReactDOM from 'react-dom';
import parseFormula from './parser/molecularParser';

class App extends React.Component {
    state = {
        formula: "",
        print: null
    };

    parseMolecule = () => {
        let ret = parseFormula(this.state.formula);

        if (ret.syntaxError !== false) {
            this.setState({
                print: <p>Syntax Error: {ret.syntaxError}</p>
            });
            return;
        }

        this.setState({
            print: <p>{JSON.stringify(ret.atoms)}</p>
        });
    }

    render() {
        return (
            <div>
                <input type="text" onChange={e => this.setState({ formula: e.target.value })} />
                <button onClick={this.parseMolecule}>Parse</button>
                {this.state.print}
            </div>
        )
    }
};

ReactDOM.render(<App />, document.getElementById('root'));