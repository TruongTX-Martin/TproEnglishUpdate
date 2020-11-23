rm -rf node_modules/
yarn cache clean
rm -rf $TMPDIR/react-*
 watchman watch-del-all
 rm -rf /tmp/haste-map-react-native-packager-*
 yarn install
 cd ios/
 rm -rf Podfile.lock
 rm -rf Pods/
 pod install
 cd ..
 ./edit_before_release.sh
