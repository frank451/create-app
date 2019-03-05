import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import Button from './components/ui/buttons/Button';
import Button from 'ui/buttons/Button';

class App extends Component {
	render() {
		return (
			<>
				<Button />
				<div className="App">
					<header className="App-header">
						<img src={logo} className="App-logo" alt="logo" />
						<p>
							Edit <code> src / App.js </code> and save to reload.{' '}
						</p>{' '}
						<a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
							Learn React{' '}
						</a>{' '}
					</header>{' '}
				</div>{' '}
			</>
		);
	}
}

export default App;
