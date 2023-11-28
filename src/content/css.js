import dom from './dom';

const uniqueCss = (element, cssSelector) => {
  const matchingElements = [...dom.findElementsByCssSelector(element.ownerDocument, cssSelector)];
  if (matchingElements.length === 1 && matchingElements[0] === element) {
    return cssSelector;
  }
  for (let i = 0; i < matchingElements.length; i += 1) {
    const newCssSelector = `${cssSelector}:nth-of-type(${i + 1})`;
    const matches = [...dom.findElementsByCssSelector(element.ownerDocument, newCssSelector)];
    if (matches[0] === element) {
      return newCssSelector;
    }
  }
  return cssSelector;
};

const idBuilder = (element) => {
  const id = dom.getId(element);
  if (id) {
    return uniqueCss(element, `${element.nodeName.toLowerCase()}[id='${id}']`);
  }
  return false;
};

const ngModelBuilder = (element) => {
  const prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', `ng:`];
  for (let i = 0, j = prefixes.length; i < j; i += 1) {
    const attr = `${prefixes[i]}model`;
    const model = element.getAttribute(attr);
    if (model) {
      return uniqueCss(element, `${element.nodeName.toLowerCase()}[${attr}='${model}']`);
    }
  }
  return false;
};

const nameBuilder = (element) => {
  const name = dom.getName(element);
  if (name) {
    return uniqueCss(element, `${element.nodeName.toLowerCase()}[name='${name}']`);
  }
  return false;
};

const ariaLabelBuilder = (element) => {
  const label = element.getAttribute('aria-label');
  if (label) {
    return uniqueCss(element, `${element.nodeName.toLowerCase()}[aria-label='${label}']`);
  }
  return false;
};

const linkHrefBuilder = (element) => {
  if (element.nodeName === 'A') {
    if (element.href !== '') {
      const url = new URL(element.href);
      const path = url.pathname.substr(1, url.pathname.length - 1);
      if (path) {
        return uniqueCss(element, `a[href*='${path}']`);
      }
    }
  }
  return false;
};

const inputButtonValueBuilder = (element) => {
  if (element.nodeName === 'INPUT' && ['button', 'submit'].includes(element.type)) {
    const text = element.value.trim();
    if (!text.match(/^\s*$/)) {
      return uniqueCss(element, `input[value*='${text}']`);
    }
  }
  return false;
};

const imageBuilder = (element) => {
  if (element.nodeName === 'IMG') {
    if (element.alt !== '') {
      return uniqueCss(element, `img[alt='${element.alt}']`);
    }
    if (element.title !== '') {
      return uniqueCss(element, `img[title='${element.title}']`);
    }
    if (element.src !== '') {
      const url = new URL(element.src);
      const path = url.pathname.substr(1, url.pathname.length - 1);
      return uniqueCss(element, `img[src*='${path}']`);
    }
  }
  return false;
};

const uniqueClassNameBuilder = (element) => {
  const uniqueClassName = dom.getUniqueClassName(element);
  if (uniqueClassName) {
    return `${element.nodeName.toLowerCase()}[class*='${uniqueClassName}']`;
  }
  return false;
};

const forBuilder = (element) => {
  const forValue = element.getAttribute('for');
  if (forValue) {
    return uniqueCss(element, `${element.nodeName.toLowerCase()}[for='${forValue}']`);
  }
  return false;
};

const builders = [idBuilder, ngModelBuilder, nameBuilder, ariaLabelBuilder, uniqueClassNameBuilder, linkHrefBuilder, inputButtonValueBuilder, imageBuilder, forBuilder];

const getPreferredLocator = (element) => {
  for (let i = 0, j = builders.length; i < j; i += 1) {
    const builder = builders[i];
    const ret = builder(element);
    if (ret) {
      return ret;
    }
  }
  return false;
};

const getRelativeCssFromParent = (element) => {
  const index = dom.getIndexOfElement(element);
  const sameSiblingCount = dom.getSameSiblingCount(element);
  let currentSelector = `${element.nodeName.toLowerCase()}`;
  if (index > 0 || sameSiblingCount > 0) {
    currentSelector += `:nth-of-type(${index + 1})`;
  }
  return currentSelector;
};

const relativeCssBuilder = (element) => {
  let path = '';
  let current = element;
  while (current != null) {
    if (current.parentNode != null) {
      path = `${getRelativeCssFromParent(current)} > ${path}`;
      // clean up hanging absolute indicator and spaces
      const matches = path.match(/^(.*)\s>\s$/);
      if (matches) {
        [, path] = matches;
      }
      if (current.parentNode.nodeType === 1) {
        const preferredParentXPath = getPreferredLocator(current.parentNode);
        if (preferredParentXPath) {
          return uniqueCss(element, `${preferredParentXPath} > ${path}`);
        }
      }
    } else {
      return false;
    }
    current = current.parentNode;
  }
  return false;
};

const getCssSelector = (element) => {
  // regular builders
  let ret = getPreferredLocator(element);
  if (ret) {
    return ret;
  }
  // relative builder
  ret = relativeCssBuilder(element);
  if (ret) {
    return ret;
  }

  // fallback
  return dom.getCssSelector(element);
};

export default getCssSelector;
