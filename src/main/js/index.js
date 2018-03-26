import React from "react";
import ReactDOM from "react-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MainPage from "./mainPage/mainPage";
import { MUI_THEME } from "./util/util";

//TODO: move css into an import statement here instead of in html

const App = () => (
    <MuiThemeProvider muiTheme={MUI_THEME}>
        <MainPage/>
    </MuiThemeProvider>
);

// Render our App component to index.html
ReactDOM.render(
    <App/>,
    document.getElementById("react-root")
);