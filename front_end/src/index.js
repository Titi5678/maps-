import React from 'react';
import './index.css';
import { render } from 'react-dom';
import App from './App';
import { Provider } from "react-redux";
import { BrowserRouter } from 'react-router-dom';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';

render(
	<Provider store={store}> 
		<BrowserRouter>
			<PersistGate persistor={persistor}>
				<App />
			</PersistGate>
		</BrowserRouter>
	</Provider>
	, document.getElementById('root')
);