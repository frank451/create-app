import React, { Component } from 'react';
import './sass/styles/app.global.scss';

import Logo from 'ui/svg/Logo';
import Button from 'ui/buttons/Button';

class App extends Component {
	render() {
		return (
			<>
				<div className="app">
					<header className="app__header">
						<Logo width="100" height="100" className="app__logo" />
					</header>
					<main className="app__main">
						<div className="app__main-inner">
							<h1 className="h1">H1 Headline</h1>
							<Button />
						</div>
					</main>
				</div>
			</>
		);
	}
}

export default App;
