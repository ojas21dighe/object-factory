import scrollIntoView from 'scroll-into-view-if-needed';
import inspector from './inspector';
import './content.scss';
import dom from './dom';
import locatorMatches from './locatorMatches';

const bg = 'rgba(255, 255, 0, 0.5)';
const bo = 'red';
const styleString = `border: ${bo} solid 2px !important; background-color: ${bg} !important; background: ${bg} !important;`;
let styleTimeout = null;

const removeStyle = (el) => {
  const style = el.getAttribute('style');
  el.setAttribute('style', style.replace(styleString, ''));
  el.classList.remove('object-factory-highlight');
};

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'startScanning') {
    inspector.start({ profile: msg.data.profile, options: msg.data.options });
    return;
  }

  if (msg.type === 'startAdding') {
    inspector.start({ model: msg.data.model || null, profile: msg.data.profile, options: msg.data.options });
    return;
  }

  if (msg.type === 'stopInspecting') {
    inspector.stop();
    return;
  }

  if (msg.type === 'showMatches') {
    const { locator } = msg.data;
    const matches = locatorMatches(locator);
    console.log('matches:', matches);

    // remove existing matches
    clearTimeout(styleTimeout);
    [...dom.findElementsByClassName(document, 'object-factory-highlight')].forEach((el) => {
      removeStyle(el);
    });

    console.log(`showMatches for ${locator}`);

    if (matches.length < 1) {
      chrome.runtime.sendMessage({ type: 'contentPopupError', data: { message: `0 elements match that locator in the model` } });
      return;
    }
    if (matches.length === 1) {
      chrome.runtime.sendMessage({ type: 'contentPopupSuccess', data: { message: `1 element matches that locator in the model` } });
    }
    if (matches.length > 1) {
      chrome.runtime.sendMessage({ type: 'contentPopupWarning', data: { message: `${matches.length} elements match that locator in the model` } });
    }

    scrollIntoView(matches[0], { behavior: 'smooth', scrollMode: 'if-needed' });

    matches.forEach((el) => {
      el.classList.add('object-factory-highlight');
      el.setAttribute('style', styleString);
      styleTimeout = setTimeout(() => {
        removeStyle(el);
      }, 3000);
    });
  }
    // if(msg.type === 'highlightAllMatches'){

    //   const { locator } = msg.data;
    //   const matches = locatorMatches(locator);
    //   console.log('matches:', matches);
  
    //   console.log(`highlightAllMatches for ${locator}`);
  
    //   if (matches.length < 1) {
    //     chrome.runtime.sendMessage({ type: 'contentPopupError', data: { message: `0 elements match that locator in the model` } });
    //     return;
    //   }
    //   if (matches.length === 1) {
    //     chrome.runtime.sendMessage({ type: 'contentPopupSuccess', data: { message: `Selected elements match the locators in the model` } });
    //   }
    //   if (matches.length > 1) {
    //     chrome.runtime.sendMessage({ type: 'contentPopupWarning', data: { message: `${matches.length} elements match that locator in the model` } });
    //   }
  
    //   scrollIntoView(matches[0], { behavior: 'smooth', scrollMode: 'if-needed' });
  
    //   matches.forEach((el) => {
    //     el.classList.add('object-factory-highlight');
    //     el.setAttribute('style', styleString);
    //     styleTimeout = setTimeout(() => {
    //       removeStyle(el);
    //     }, 10000);
    //   });
    // }
});
