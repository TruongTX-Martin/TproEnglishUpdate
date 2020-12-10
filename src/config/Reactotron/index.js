import Reactotron from 'reactotron-react-native'

Reactotron
  .configure({
    name: "React Native Demo",
    host: '10.80.0.33',
    /*If you want to connect Android for debug*/
  })
  .useReactNative({
    asyncStorage: false, // there are more options to the async storage.
    networking: { // optionally, you can turn it off with false.
      ignoreUrls: /symbolicate/
    },
    editor: false, // there are more options to editor
    errors: { veto: (stackFrame) => false }, // or turn it off with false
    overlay: false, // just turning off overlay
  })
  .connect();

// .connect({
//   enabled: true,
//   host: '192.168.1.30',  // server ip
//   port: 9090
// });

console.log = Reactotron.log;
