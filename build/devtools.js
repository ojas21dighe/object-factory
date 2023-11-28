/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./devtools/devtools.js":
/*!******************************!*\
  !*** ./devtools/devtools.js ***!
  \******************************/
/***/ (() => {

eval("const handlePanelShown = () => {\n  console.log('Object Factory panel shown');\n};\nconst handlePanelHidden = () => {\n  console.log('Object Factory panel hidden');\n};\nchrome.devtools.panels.create('Object Factory', 'icons/icon_32.png', 'panel/panel.html', newPanel => {\n  newPanel.onShown.addListener(handlePanelShown);\n  newPanel.onHidden.addListener(handlePanelHidden);\n});\n\n//# sourceURL=webpack:///./devtools/devtools.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./devtools/devtools.js"]();
/******/ 	
/******/ })()
;