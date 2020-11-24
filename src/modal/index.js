import Realm from 'realm';

import Category from './Category';
import ChildCategory from './ChildCategory';
import Transcript from './Transcript';
import Question from './Question';
import Lesson from './Lesson';
import Answer from './Answer';
import NewWord from './NewWord';

const realm = new Realm({
  schema: [
    Category,
    ChildCategory,
    Answer,
    Question,
    Transcript,
    Lesson,
    NewWord
  ],
  schemaVersion: 2,
  migration: (oldRealm, newRealm) => {

  }
})

export default realm;