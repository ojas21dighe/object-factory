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

/***/ "./background/background.js":
/*!**********************************!*\
  !*** ./background/background.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lodash_lowerFirst__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/lowerFirst */ \"../node_modules/lodash/lowerFirst.js\");\n/* harmony import */ var lodash_lowerFirst__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_lowerFirst__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _profiles_profiles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../profiles/profiles */ \"./profiles/profiles.js\");\n\n\nlet activeProfile = null;\nconst activateProfile = profileName => {\n  activeProfile = _profiles_profiles__WEBPACK_IMPORTED_MODULE_1__[\"default\"].find(p => p.active);\n  if (activeProfile) {\n    if (activeProfile.name === profileName) {\n      return;\n    }\n    activeProfile.active = false;\n  }\n  // make activeProfile active and persist to storage sync\n  activeProfile = _profiles_profiles__WEBPACK_IMPORTED_MODULE_1__[\"default\"].find(p => p.name === profileName);\n  activeProfile.active = true;\n  chrome.storage.sync.set({\n    activeProfileName: profileName\n  }, () => {});\n};\nchrome.runtime.onInstalled.addListener(details => {\n  const thisVersion = chrome.runtime.getManifest().version;\n  if (details.reason === 'install') {\n    console.log(`First install of version ${thisVersion}`);\n  } else if (details.reason === 'update') {\n    console.log(`Updated from ${details.previousVersion} to ${thisVersion}!`);\n  }\n});\nconst sendMessage = (msgType, data) => {\n  chrome.runtime.sendMessage({\n    type: msgType,\n    data\n  });\n};\nconst sendMessageToActiveTab = (msgType, data = {}) => {\n  chrome.tabs.query({\n    active: true\n  }, tabs => {\n    tabs.forEach(tab => {\n      chrome.tabs.sendMessage(tab.id, {\n        type: msgType,\n        data\n      });\n    });\n  });\n};\nchrome.runtime.onMessage.addListener(msg => {\n  switch (msg.type) {\n    case 'showOptions':\n      chrome.runtime.openOptionsPage();\n      return;\n    case 'activateProfile':\n      activateProfile(msg.data.profileName);\n      return;\n    case 'saveOptions':\n      chrome.storage.sync.set({\n        options: msg.data.options\n      }, () => {\n        sendMessage('optionsUpdated', {});\n      });\n      return;\n    case 'generateModel':\n      chrome.storage.sync.get('activeProfileName', result => {\n        // get the active activeProfile from storage sync or activate the first activeProfile as default\n        if (result && result.activeProfileName) {\n          activeProfile = _profiles_profiles__WEBPACK_IMPORTED_MODULE_1__[\"default\"].find(p => p.name === result.activeProfileName);\n          activeProfile.active = true;\n        } else {\n          [activeProfile] = _profiles_profiles__WEBPACK_IMPORTED_MODULE_1__[\"default\"];\n        }\n        const code = activeProfile.template(msg.data.model);\n        sendMessage('showCode', {\n          code\n        });\n      });\n      return;\n    default:\n  }\n\n  // relay messages between the app and content script <- ->\n  const matches = /^(app|content)(.*)$/.exec(msg.type);\n  const msgType = lodash_lowerFirst__WEBPACK_IMPORTED_MODULE_0___default()(matches[2]);\n  switch (matches[1]) {\n    case 'app':\n      sendMessageToActiveTab(msgType, msg.data);\n      break;\n    case 'content':\n      sendMessage(msgType, msg.data);\n      break;\n    default:\n  }\n});\n\n//# sourceURL=webpack:///./background/background.js?");

/***/ }),

/***/ "./profiles/JSONTemplate.js":
/*!**********************************!*\
  !*** ./profiles/JSONTemplate.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst transformLocatorName = locatorName => {\n  if (locatorName === 'css') {\n    return 'cssSelector';\n  }\n  return locatorName;\n};\nconst renderFindByLocatorStatement = locator => `\n                            \"selector\": {\n                                            \"${transformLocatorName(locator.name)}\": \"${locator.locator}\"\n                                        }\n  `;\nconst renderGetElementMethod = entity => {\n  let output = `\n                  {\n                      \"name\": \"${entity.name}\",\n                      ${renderFindByLocatorStatement(entity.locators.find(l => l.selected))}\n                  }\n`;\n  return output;\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (model => model.entities.map(entity => `${renderGetElementMethod(entity)}`).join(','));\n\n//# sourceURL=webpack:///./profiles/JSONTemplate.js?");

/***/ }),

/***/ "./profiles/RAFI - SeleniumJavaTemplate.js":
/*!*************************************************!*\
  !*** ./profiles/RAFI - SeleniumJavaTemplate.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _templates_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./templates-helpers */ \"./profiles/templates-helpers.js\");\n\nconst renderEntityComment = entity => `\n/*\n * ${entity.name}\n * ***************************************************************\n */\n`;\nconst transformLocatorName = locatorName => {\n  if (locatorName === 'css') {\n    return 'cssSelector';\n  }\n  return locatorName;\n};\nconst renderFindByLocatorStatement = locator => `driver.findElement(By.${transformLocatorName(locator.name)}(\"${locator.locator}\"));`;\nconst renderGetElementMethod = entity => {\n  let output = `\n public WebElement get${entity.name}Element() {\n     return ${renderFindByLocatorStatement(entity.locators.find(l => l.selected))}\n }\n`;\n  if (entity.tagName === 'SELECT') {\n    output += `\n public Select get${entity.name}Select() {\n     return new Select(get${entity.name}Element());\n }\n`;\n  }\n  return output;\n};\nconst renderClickMethod = entity => {\n  if ((0,_templates_helpers__WEBPACK_IMPORTED_MODULE_0__.isClickable)(entity)) {\n    return ` \n public void click${entity.name}() {\n     get${entity.name}Element().click();\n }\n `;\n  }\n  return '';\n};\nconst renderGetAndSetCheckboxRadio = entity => `\n public boolean get${entity.name}() {\n     return get${entity.name}Element().isSelected();\n }\n \n public void set${entity.name}(boolean onOrOff) {\n     WebElement el = get${entity.name}Element();\n     if( (onOrOff && !el.isSelected()) || (!onOrOff && el.isSelected())) {\n         el.click(); \n     }\n }`;\nconst renderGetAndSetSelect = entity => `\n public String get${entity.name}Text() {\n     return get${entity.name}Select().getFirstSelectedOption().getText();\n }\n public String get${entity.name}Value() {\n     return get${entity.name}Select().getFirstSelectedOption().getAttribute(\"value\");\n }\n public void set${entity.name}ByValue(String value) {\n     get${entity.name}Select().selectByValue(value);\n }\n \n public void set${entity.name}ByText(String text) {\n     get${entity.name}Select().selectByVisibleText(text);\n }\n`;\nconst renderGetAndSetMethods = entity => {\n  if ((0,_templates_helpers__WEBPACK_IMPORTED_MODULE_0__.isClickable)(entity)) {\n    return '';\n  }\n  if (['INPUT', 'TEXTAREA'].includes(entity.tagName)) {\n    if (['checkbox', 'radio'].includes(entity.type)) {\n      return renderGetAndSetCheckboxRadio(entity);\n    }\n    // regular input\n    return `\n public String get${entity.name}() {\n     return get${entity.name}Element().getAttribute(\"value\");\n }\n \n public void set${entity.name}(String value) {\n     get${entity.name}Element().sendKeys(value);\n }\n`;\n  }\n  if (entity.tagName === 'SELECT') {\n    return renderGetAndSetSelect(entity);\n  }\n  return '';\n};\nconst renderGetTextMethod = entity => {\n  if ((0,_templates_helpers__WEBPACK_IMPORTED_MODULE_0__.isInteractive)(entity)) {\n    return '';\n  }\n  return ` \n public String get${entity.name}() {\n     return get${entity.name}Element().getText();\n }\n`;\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (model => model.entities.map(entity => `${renderEntityComment(entity)}${renderGetElementMethod(entity)}${renderClickMethod(entity)}${renderGetAndSetMethods(entity)}${renderGetTextMethod(entity)}`).join(''));\n\n//# sourceURL=webpack:///./profiles/RAFI_-_SeleniumJavaTemplate.js?");

/***/ }),

/***/ "./profiles/profiles.js":
/*!******************************!*\
  !*** ./profiles/profiles.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _RAFI_SeleniumJavaTemplate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RAFI - SeleniumJavaTemplate */ \"./profiles/RAFI - SeleniumJavaTemplate.js\");\n/* harmony import */ var _JSONTemplate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./JSONTemplate */ \"./profiles/JSONTemplate.js\");\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([{\n  name: 'RAFI - Selenium Java Template',\n  template: _RAFI_SeleniumJavaTemplate__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n  locators: ['id', 'linkText', 'partialLinkText', 'name', 'model', 'binding', 'css', 'xpath', 'className', 'tagName']\n}, {\n  name: 'JSON Template',\n  template: _JSONTemplate__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  locators: ['id', 'linkText', 'partialLinkText', 'name', 'model', 'binding', 'css', 'xpath', 'className', 'tagName']\n}]);\n\n//# sourceURL=webpack:///./profiles/profiles.js?");

/***/ }),

/***/ "./profiles/templates-helpers.js":
/*!***************************************!*\
  !*** ./profiles/templates-helpers.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"isClickable\": () => (/* binding */ isClickable),\n/* harmony export */   \"isInteractive\": () => (/* binding */ isInteractive)\n/* harmony export */ });\nconst isClickable = entity => ['A', 'BUTTON', 'IMG'].includes(entity.tagName) || entity.tagName === 'INPUT' && ['button', 'reset', 'image', 'submit'].includes(entity.type);\nconst isInteractive = entity => ['INPUT', 'A', 'BUTTON', 'IMG', 'SELECT', 'TEXTAREA'].includes(entity.tagName);\n\n\n//# sourceURL=webpack:///./profiles/templates-helpers.js?");

/***/ }),

/***/ "../node_modules/lodash/_Symbol.js":
/*!*****************************************!*\
  !*** ../node_modules/lodash/_Symbol.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var root = __webpack_require__(/*! ./_root */ \"../node_modules/lodash/_root.js\");\n\n/** Built-in value references. */\nvar Symbol = root.Symbol;\n\nmodule.exports = Symbol;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/_Symbol.js?");

/***/ }),

/***/ "../node_modules/lodash/_arrayMap.js":
/*!*******************************************!*\
  !*** ../node_modules/lodash/_arrayMap.js ***!
  \*******************************************/
/***/ ((module) => {

eval("/**\n * A specialized version of `_.map` for arrays without support for iteratee\n * shorthands.\n *\n * @private\n * @param {Array} [array] The array to iterate over.\n * @param {Function} iteratee The function invoked per iteration.\n * @returns {Array} Returns the new mapped array.\n */\nfunction arrayMap(array, iteratee) {\n  var index = -1,\n      length = array == null ? 0 : array.length,\n      result = Array(length);\n\n  while (++index < length) {\n    result[index] = iteratee(array[index], index, array);\n  }\n  return result;\n}\n\nmodule.exports = arrayMap;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/_arrayMap.js?");

/***/ }),

/***/ "../node_modules/lodash/_asciiToArray.js":
/*!***********************************************!*\
  !*** ../node_modules/lodash/_asciiToArray.js ***!
  \***********************************************/
/***/ ((module) => {

eval("/**\n * Converts an ASCII `string` to an array.\n *\n * @private\n * @param {string} string The string to convert.\n * @returns {Array} Returns the converted array.\n */\nfunction asciiToArray(string) {\n  return string.split('');\n}\n\nmodule.exports = asciiToArray;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/_asciiToArray.js?");

/***/ }),

/***/ "../node_modules/lodash/_baseGetTag.js":
/*!*********************************************!*\
  !*** ../node_modules/lodash/_baseGetTag.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var Symbol = __webpack_require__(/*! ./_Symbol */ \"../node_modules/lodash/_Symbol.js\"),\n    getRawTag = __webpack_require__(/*! ./_getRawTag */ \"../node_modules/lodash/_getRawTag.js\"),\n    objectToString = __webpack_require__(/*! ./_objectToString */ \"../node_modules/lodash/_objectToString.js\");\n\n/** `Object#toString` result references. */\nvar nullTag = '[object Null]',\n    undefinedTag = '[object Undefined]';\n\n/** Built-in value references. */\nvar symToStringTag = Symbol ? Symbol.toStringTag : undefined;\n\n/**\n * The base implementation of `getTag` without fallbacks for buggy environments.\n *\n * @private\n * @param {*} value The value to query.\n * @returns {string} Returns the `toStringTag`.\n */\nfunction baseGetTag(value) {\n  if (value == null) {\n    return value === undefined ? undefinedTag : nullTag;\n  }\n  return (symToStringTag && symToStringTag in Object(value))\n    ? getRawTag(value)\n    : objectToString(value);\n}\n\nmodule.exports = baseGetTag;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/_baseGetTag.js?");

/***/ }),

/***/ "../node_modules/lodash/_baseSlice.js":
/*!********************************************!*\
  !*** ../node_modules/lodash/_baseSlice.js ***!
  \********************************************/
/***/ ((module) => {

eval("/**\n * The base implementation of `_.slice` without an iteratee call guard.\n *\n * @private\n * @param {Array} array The array to slice.\n * @param {number} [start=0] The start position.\n * @param {number} [end=array.length] The end position.\n * @returns {Array} Returns the slice of `array`.\n */\nfunction baseSlice(array, start, end) {\n  var index = -1,\n      length = array.length;\n\n  if (start < 0) {\n    start = -start > length ? 0 : (length + start);\n  }\n  end = end > length ? length : end;\n  if (end < 0) {\n    end += length;\n  }\n  length = start > end ? 0 : ((end - start) >>> 0);\n  start >>>= 0;\n\n  var result = Array(length);\n  while (++index < length) {\n    result[index] = array[index + start];\n  }\n  return result;\n}\n\nmodule.exports = baseSlice;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/_baseSlice.js?");

/***/ }),

/***/ "../node_modules/lodash/_baseToString.js":
/*!***********************************************!*\
  !*** ../node_modules/lodash/_baseToString.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var Symbol = __webpack_require__(/*! ./_Symbol */ \"../node_modules/lodash/_Symbol.js\"),\n    arrayMap = __webpack_require__(/*! ./_arrayMap */ \"../node_modules/lodash/_arrayMap.js\"),\n    isArray = __webpack_require__(/*! ./isArray */ \"../node_modules/lodash/isArray.js\"),\n    isSymbol = __webpack_require__(/*! ./isSymbol */ \"../node_modules/lodash/isSymbol.js\");\n\n/** Used as references for various `Number` constants. */\nvar INFINITY = 1 / 0;\n\n/** Used to convert symbols to primitives and strings. */\nvar symbolProto = Symbol ? Symbol.prototype : undefined,\n    symbolToString = symbolProto ? symbolProto.toString : undefined;\n\n/**\n * The base implementation of `_.toString` which doesn't convert nullish\n * values to empty strings.\n *\n * @private\n * @param {*} value The value to process.\n * @returns {string} Returns the string.\n */\nfunction baseToString(value) {\n  // Exit early for strings to avoid a performance hit in some environments.\n  if (typeof value == 'string') {\n    return value;\n  }\n  if (isArray(value)) {\n    // Recursively convert values (susceptible to call stack limits).\n    return arrayMap(value, baseToString) + '';\n  }\n  if (isSymbol(value)) {\n    return symbolToString ? symbolToString.call(value) : '';\n  }\n  var result = (value + '');\n  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;\n}\n\nmodule.exports = baseToString;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/_baseToString.js?");

/***/ }),

/***/ "../node_modules/lodash/_castSlice.js":
/*!********************************************!*\
  !*** ../node_modules/lodash/_castSlice.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var baseSlice = __webpack_require__(/*! ./_baseSlice */ \"../node_modules/lodash/_baseSlice.js\");\n\n/**\n * Casts `array` to a slice if it's needed.\n *\n * @private\n * @param {Array} array The array to inspect.\n * @param {number} start The start position.\n * @param {number} [end=array.length] The end position.\n * @returns {Array} Returns the cast slice.\n */\nfunction castSlice(array, start, end) {\n  var length = array.length;\n  end = end === undefined ? length : end;\n  return (!start && end >= length) ? array : baseSlice(array, start, end);\n}\n\nmodule.exports = castSlice;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/_castSlice.js?");

/***/ }),

/***/ "../node_modules/lodash/_createCaseFirst.js":
/*!**************************************************!*\
  !*** ../node_modules/lodash/_createCaseFirst.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var castSlice = __webpack_require__(/*! ./_castSlice */ \"../node_modules/lodash/_castSlice.js\"),\n    hasUnicode = __webpack_require__(/*! ./_hasUnicode */ \"../node_modules/lodash/_hasUnicode.js\"),\n    stringToArray = __webpack_require__(/*! ./_stringToArray */ \"../node_modules/lodash/_stringToArray.js\"),\n    toString = __webpack_require__(/*! ./toString */ \"../node_modules/lodash/toString.js\");\n\n/**\n * Creates a function like `_.lowerFirst`.\n *\n * @private\n * @param {string} methodName The name of the `String` case method to use.\n * @returns {Function} Returns the new case function.\n */\nfunction createCaseFirst(methodName) {\n  return function(string) {\n    string = toString(string);\n\n    var strSymbols = hasUnicode(string)\n      ? stringToArray(string)\n      : undefined;\n\n    var chr = strSymbols\n      ? strSymbols[0]\n      : string.charAt(0);\n\n    var trailing = strSymbols\n      ? castSlice(strSymbols, 1).join('')\n      : string.slice(1);\n\n    return chr[methodName]() + trailing;\n  };\n}\n\nmodule.exports = createCaseFirst;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/_createCaseFirst.js?");

/***/ }),

/***/ "../node_modules/lodash/_freeGlobal.js":
/*!*********************************************!*\
  !*** ../node_modules/lodash/_freeGlobal.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/** Detect free variable `global` from Node.js. */\nvar freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;\n\nmodule.exports = freeGlobal;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/_freeGlobal.js?");

/***/ }),

/***/ "../node_modules/lodash/_getRawTag.js":
/*!********************************************!*\
  !*** ../node_modules/lodash/_getRawTag.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var Symbol = __webpack_require__(/*! ./_Symbol */ \"../node_modules/lodash/_Symbol.js\");\n\n/** Used for built-in method references. */\nvar objectProto = Object.prototype;\n\n/** Used to check objects for own properties. */\nvar hasOwnProperty = objectProto.hasOwnProperty;\n\n/**\n * Used to resolve the\n * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)\n * of values.\n */\nvar nativeObjectToString = objectProto.toString;\n\n/** Built-in value references. */\nvar symToStringTag = Symbol ? Symbol.toStringTag : undefined;\n\n/**\n * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.\n *\n * @private\n * @param {*} value The value to query.\n * @returns {string} Returns the raw `toStringTag`.\n */\nfunction getRawTag(value) {\n  var isOwn = hasOwnProperty.call(value, symToStringTag),\n      tag = value[symToStringTag];\n\n  try {\n    value[symToStringTag] = undefined;\n    var unmasked = true;\n  } catch (e) {}\n\n  var result = nativeObjectToString.call(value);\n  if (unmasked) {\n    if (isOwn) {\n      value[symToStringTag] = tag;\n    } else {\n      delete value[symToStringTag];\n    }\n  }\n  return result;\n}\n\nmodule.exports = getRawTag;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/_getRawTag.js?");

/***/ }),

/***/ "../node_modules/lodash/_hasUnicode.js":
/*!*********************************************!*\
  !*** ../node_modules/lodash/_hasUnicode.js ***!
  \*********************************************/
/***/ ((module) => {

eval("/** Used to compose unicode character classes. */\nvar rsAstralRange = '\\\\ud800-\\\\udfff',\n    rsComboMarksRange = '\\\\u0300-\\\\u036f',\n    reComboHalfMarksRange = '\\\\ufe20-\\\\ufe2f',\n    rsComboSymbolsRange = '\\\\u20d0-\\\\u20ff',\n    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,\n    rsVarRange = '\\\\ufe0e\\\\ufe0f';\n\n/** Used to compose unicode capture groups. */\nvar rsZWJ = '\\\\u200d';\n\n/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */\nvar reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');\n\n/**\n * Checks if `string` contains Unicode symbols.\n *\n * @private\n * @param {string} string The string to inspect.\n * @returns {boolean} Returns `true` if a symbol is found, else `false`.\n */\nfunction hasUnicode(string) {\n  return reHasUnicode.test(string);\n}\n\nmodule.exports = hasUnicode;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/_hasUnicode.js?");

/***/ }),

/***/ "../node_modules/lodash/_objectToString.js":
/*!*************************************************!*\
  !*** ../node_modules/lodash/_objectToString.js ***!
  \*************************************************/
/***/ ((module) => {

eval("/** Used for built-in method references. */\nvar objectProto = Object.prototype;\n\n/**\n * Used to resolve the\n * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)\n * of values.\n */\nvar nativeObjectToString = objectProto.toString;\n\n/**\n * Converts `value` to a string using `Object.prototype.toString`.\n *\n * @private\n * @param {*} value The value to convert.\n * @returns {string} Returns the converted string.\n */\nfunction objectToString(value) {\n  return nativeObjectToString.call(value);\n}\n\nmodule.exports = objectToString;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/_objectToString.js?");

/***/ }),

/***/ "../node_modules/lodash/_root.js":
/*!***************************************!*\
  !*** ../node_modules/lodash/_root.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ \"../node_modules/lodash/_freeGlobal.js\");\n\n/** Detect free variable `self`. */\nvar freeSelf = typeof self == 'object' && self && self.Object === Object && self;\n\n/** Used as a reference to the global object. */\nvar root = freeGlobal || freeSelf || Function('return this')();\n\nmodule.exports = root;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/_root.js?");

/***/ }),

/***/ "../node_modules/lodash/_stringToArray.js":
/*!************************************************!*\
  !*** ../node_modules/lodash/_stringToArray.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var asciiToArray = __webpack_require__(/*! ./_asciiToArray */ \"../node_modules/lodash/_asciiToArray.js\"),\n    hasUnicode = __webpack_require__(/*! ./_hasUnicode */ \"../node_modules/lodash/_hasUnicode.js\"),\n    unicodeToArray = __webpack_require__(/*! ./_unicodeToArray */ \"../node_modules/lodash/_unicodeToArray.js\");\n\n/**\n * Converts `string` to an array.\n *\n * @private\n * @param {string} string The string to convert.\n * @returns {Array} Returns the converted array.\n */\nfunction stringToArray(string) {\n  return hasUnicode(string)\n    ? unicodeToArray(string)\n    : asciiToArray(string);\n}\n\nmodule.exports = stringToArray;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/_stringToArray.js?");

/***/ }),

/***/ "../node_modules/lodash/_unicodeToArray.js":
/*!*************************************************!*\
  !*** ../node_modules/lodash/_unicodeToArray.js ***!
  \*************************************************/
/***/ ((module) => {

eval("/** Used to compose unicode character classes. */\nvar rsAstralRange = '\\\\ud800-\\\\udfff',\n    rsComboMarksRange = '\\\\u0300-\\\\u036f',\n    reComboHalfMarksRange = '\\\\ufe20-\\\\ufe2f',\n    rsComboSymbolsRange = '\\\\u20d0-\\\\u20ff',\n    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,\n    rsVarRange = '\\\\ufe0e\\\\ufe0f';\n\n/** Used to compose unicode capture groups. */\nvar rsAstral = '[' + rsAstralRange + ']',\n    rsCombo = '[' + rsComboRange + ']',\n    rsFitz = '\\\\ud83c[\\\\udffb-\\\\udfff]',\n    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',\n    rsNonAstral = '[^' + rsAstralRange + ']',\n    rsRegional = '(?:\\\\ud83c[\\\\udde6-\\\\uddff]){2}',\n    rsSurrPair = '[\\\\ud800-\\\\udbff][\\\\udc00-\\\\udfff]',\n    rsZWJ = '\\\\u200d';\n\n/** Used to compose unicode regexes. */\nvar reOptMod = rsModifier + '?',\n    rsOptVar = '[' + rsVarRange + ']?',\n    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',\n    rsSeq = rsOptVar + reOptMod + rsOptJoin,\n    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';\n\n/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */\nvar reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');\n\n/**\n * Converts a Unicode `string` to an array.\n *\n * @private\n * @param {string} string The string to convert.\n * @returns {Array} Returns the converted array.\n */\nfunction unicodeToArray(string) {\n  return string.match(reUnicode) || [];\n}\n\nmodule.exports = unicodeToArray;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/_unicodeToArray.js?");

/***/ }),

/***/ "../node_modules/lodash/isArray.js":
/*!*****************************************!*\
  !*** ../node_modules/lodash/isArray.js ***!
  \*****************************************/
/***/ ((module) => {

eval("/**\n * Checks if `value` is classified as an `Array` object.\n *\n * @static\n * @memberOf _\n * @since 0.1.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is an array, else `false`.\n * @example\n *\n * _.isArray([1, 2, 3]);\n * // => true\n *\n * _.isArray(document.body.children);\n * // => false\n *\n * _.isArray('abc');\n * // => false\n *\n * _.isArray(_.noop);\n * // => false\n */\nvar isArray = Array.isArray;\n\nmodule.exports = isArray;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/isArray.js?");

/***/ }),

/***/ "../node_modules/lodash/isObjectLike.js":
/*!**********************************************!*\
  !*** ../node_modules/lodash/isObjectLike.js ***!
  \**********************************************/
/***/ ((module) => {

eval("/**\n * Checks if `value` is object-like. A value is object-like if it's not `null`\n * and has a `typeof` result of \"object\".\n *\n * @static\n * @memberOf _\n * @since 4.0.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is object-like, else `false`.\n * @example\n *\n * _.isObjectLike({});\n * // => true\n *\n * _.isObjectLike([1, 2, 3]);\n * // => true\n *\n * _.isObjectLike(_.noop);\n * // => false\n *\n * _.isObjectLike(null);\n * // => false\n */\nfunction isObjectLike(value) {\n  return value != null && typeof value == 'object';\n}\n\nmodule.exports = isObjectLike;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/isObjectLike.js?");

/***/ }),

/***/ "../node_modules/lodash/isSymbol.js":
/*!******************************************!*\
  !*** ../node_modules/lodash/isSymbol.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ \"../node_modules/lodash/_baseGetTag.js\"),\n    isObjectLike = __webpack_require__(/*! ./isObjectLike */ \"../node_modules/lodash/isObjectLike.js\");\n\n/** `Object#toString` result references. */\nvar symbolTag = '[object Symbol]';\n\n/**\n * Checks if `value` is classified as a `Symbol` primitive or object.\n *\n * @static\n * @memberOf _\n * @since 4.0.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.\n * @example\n *\n * _.isSymbol(Symbol.iterator);\n * // => true\n *\n * _.isSymbol('abc');\n * // => false\n */\nfunction isSymbol(value) {\n  return typeof value == 'symbol' ||\n    (isObjectLike(value) && baseGetTag(value) == symbolTag);\n}\n\nmodule.exports = isSymbol;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/isSymbol.js?");

/***/ }),

/***/ "../node_modules/lodash/lowerFirst.js":
/*!********************************************!*\
  !*** ../node_modules/lodash/lowerFirst.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var createCaseFirst = __webpack_require__(/*! ./_createCaseFirst */ \"../node_modules/lodash/_createCaseFirst.js\");\n\n/**\n * Converts the first character of `string` to lower case.\n *\n * @static\n * @memberOf _\n * @since 4.0.0\n * @category String\n * @param {string} [string=''] The string to convert.\n * @returns {string} Returns the converted string.\n * @example\n *\n * _.lowerFirst('Fred');\n * // => 'fred'\n *\n * _.lowerFirst('FRED');\n * // => 'fRED'\n */\nvar lowerFirst = createCaseFirst('toLowerCase');\n\nmodule.exports = lowerFirst;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/lowerFirst.js?");

/***/ }),

/***/ "../node_modules/lodash/toString.js":
/*!******************************************!*\
  !*** ../node_modules/lodash/toString.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var baseToString = __webpack_require__(/*! ./_baseToString */ \"../node_modules/lodash/_baseToString.js\");\n\n/**\n * Converts `value` to a string. An empty string is returned for `null`\n * and `undefined` values. The sign of `-0` is preserved.\n *\n * @static\n * @memberOf _\n * @since 4.0.0\n * @category Lang\n * @param {*} value The value to convert.\n * @returns {string} Returns the converted string.\n * @example\n *\n * _.toString(null);\n * // => ''\n *\n * _.toString(-0);\n * // => '-0'\n *\n * _.toString([1, 2, 3]);\n * // => '1,2,3'\n */\nfunction toString(value) {\n  return value == null ? '' : baseToString(value);\n}\n\nmodule.exports = toString;\n\n\n//# sourceURL=webpack:///../node_modules/lodash/toString.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./background/background.js");
/******/ 	
/******/ })()
;