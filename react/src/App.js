import React, { Component } from 'react';
// import logo from './logo.svg';
import './sass/App.css';

import Logo from 'ui/svg/Logo';
// import Button from './components/ui/buttons/Button';
import Button from 'ui/buttons/Button';

class App extends Component {
	render() {
		return (
			<>
				<h1 className="h1">H1 Headline</h1>
				<Button />
				<div className="App">
					<header className="App-header">
						{/* <img src={logo} className="App-logo" alt="logo" /> */}
						<Logo width="100" height="100" className="App-logo" />
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
