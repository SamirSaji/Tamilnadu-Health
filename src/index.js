import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import unregister from './registerServiceWorker';
import 'jquery';
import 'bootstrap/dist/js/bootstrap.min.js'


require("react-datepicker/dist/react-datepicker-cssmodules.css");
 
ReactDOM.render(<App />, document.getElementById('root'));
unregister();
