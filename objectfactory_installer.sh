echo "Installing Object Factory on your machine..."
git clone https://github.com/ojas21dighe/object-factory.git
cd object-factory
echo "Installing npm packages..."
npm install
npm rebuild sass
npm run build
echo "npm install successfull..."
clear