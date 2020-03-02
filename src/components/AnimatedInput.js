import React from 'react';
import styled from 'styled-components';

export default class AnimatedInput extends React.Component {
    render() {
        return (
            <div className={this.props.className}>
                <Container
                    color={!this.props.color ? "black" : this.props.color}
                    inputColor={!this.props.inputColor ? "black" : this.props.inputColor }
                    focusColor={!this.props.focusColor ? "black" : this.props.focusColor}
                    validColor={!this.props.focusColor ? "black" : this.props.validColor}
                    transitionSpeed={!this.props.transitionSpeed ? "0.5s" : this.props.transitionSpeed}
                >
                    <input
                        type={this.props.type} name=""
                        pattern={this.props.pattern} required
                        onChange={this.props.onChange}
                    />
                    <label>{this.props.label}</label>
                </Container>
            </div>
        );
    }
};

const Container = styled("div")`
    position: relative;

    input {
        outline: none;
        width: 100%;
        box-sizing: border-box;
        border: none;
        border-bottom: 1px ${props => props.color} solid;
        color: ${props => props.inputColor};
        font-size: inherit;
        font-family: inherit;
        padding: 10px 0;
        transition: ${props => props.transitionSpeed};
    }
    input:focus {
        border-bottom: 1px solid ${props => props.focusColor};
    }
    input:valid {
        border-bottom: 1px solid ${props => props.validColor};
    }

    label {
        position: absolute;
        left: 0;
        top: 10px;
        pointer-events: none;
        opacity: 0.5;
        transition: 0.2s color;
        transition: ${props => props.transitionSpeed};
    }
    input:focus ~ label {
        opacity: 1;
        top: -12px;
        left: 0;
        color: ${props => props.focusColor};
        font-size: calc(100% - 15%);
    }
    input:valid ~ label {
        opacity: 1;
        top: -12px;
        left: 0;
        color: ${props => props.validColor};
        font-size: calc(100% - 15%);
    }

`;