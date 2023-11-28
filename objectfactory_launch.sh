echo "Updating All Library Files..."
npm update all
echo "Fetching Product Updates from remote..."
git remote update
git fetch
git checkout origin/main
git pull
git checkout main
git restore .
git rebase origin/main
git push --force
npm rebuild sass
npm run build
clear
echo "Launching Object Factory..."
npm run launch:chrome