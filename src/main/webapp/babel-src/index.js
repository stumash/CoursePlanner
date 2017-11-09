import React from "react";
import ReactDOM from "react-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MainPage from "./mainPage";

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: "#6c1540",
        primary2Color: "#3d001a",
        // primary3Color: grey400,
        accent1Color: "#f5bb2b",
        // accent2Color: grey100,
        // accent3Color: grey500,
        // textColor: darkBlack,
        // alternateTextColor: white,
        // canvasColor: white,
        // borderColor: grey300,
        // disabledColor: fade(darkBlack, 0.3),
        pickerHeaderColor: "#6c1540",
        // clockCircleColor: fade(darkBlack, 0.07),
        // shadowColor: fullBlack,
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