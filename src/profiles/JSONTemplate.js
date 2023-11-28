
const transformLocatorName = locatorName => {
  if (locatorName === 'css') {
    return 'cssSelector';
  }
  return locatorName;
};

const renderFindByLocatorStatement = locator => 
`
                            "selector": {
                                            "${transformLocatorName(locator.name)}": "${locator.locator}"
                                        }
  `;

const renderGetElementMethod = entity => {
  let output = `
                  {
                      "name": "${entity.name}",
                      ${renderFindByLocatorStatement(entity.locators.find(l => l.selected))}
                  }
`; 
return output;
};


export default model =>
  model.entities
    .map(entity => `${renderGetElementMethod(entity)}`)
    .join(',');