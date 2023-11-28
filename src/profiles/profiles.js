import SeleniumWebDriverJavaTemplate from './RAFI - SeleniumJavaTemplate';
import JSONTemplate from './JSONTemplate';

export default [
  {
    name: 'RAFI - Selenium Java Template',
    template: SeleniumWebDriverJavaTemplate,
    locators: ['id', 'linkText', 'partialLinkText', 'name', 'model', 'binding', 'css', 'xpath', 'className', 'tagName'],
  },

  {
    name: 'JSON Template',
    template: JSONTemplate,
    locators: ['id', 'linkText', 'partialLinkText', 'name', 'model', 'binding', 'css', 'xpath', 'className', 'tagName'],
  },

];
