import Category from './Category';
import Story from './Story';
import Realm from 'realm';

const realm = new Realm({
  schema: [
    Category,
    Story
  ],
  schemaVersion: 2,
  migration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 2) {
      const oldObjects = oldRealm.objects('Story');
      const newObjects = newRealm.objects('Story');

      for (let i = 0; i < oldObjects.length; i += 1) {
        newObjects[i].isView = "";
      }
    }
  }
})

export default realm;