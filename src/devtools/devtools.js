const handlePanelShown = () => {
  console.log('Object Factory panel shown');
};

const handlePanelHidden = () => {
  console.log('Object Factory panel hidden');
};

chrome.devtools.panels.create('Object Factory', 'icons/icon_32.png', 'panel/panel.html', (newPanel) => {
  newPanel.onShown.addListener(handlePanelShown);
  newPanel.onHidden.addListener(handlePanelHidden);
});
