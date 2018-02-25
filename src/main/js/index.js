import React from "react";
import ReactDOM from "react-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MainPage from "./mainPage/mainPage";

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: "#6c1540",
        primary2Color: "#3d001a",
        accent1Color: "#f5bb2b",
        pickerHeaderColor: "#6c1540",
    }
});


const App = () => (
    <MuiThemeProvider muiTheme={muiTheme}>
        <MainPage/>
    </MuiThemeProvider>
);

// Render our App component to index.html
ReactDOM.render(
    <App/>,
    document.getElementById("react-root")
);