import Constants from '../Config/Constant';
const Newword = {
  name: Constants.NEWWORD,
  primaryKey: Constants.ID,
  properties: {
    id: { type: Constants.INT },
    childCategoryId: { type: Constants.STRING },
    lessonId: { type: Constants.STRING },
    title: { type: Constants.STRING },
    meaning: { type: Constants.STRING },
    note: { type: Constants.STRING },
    isMyWord: { type: Constants.BOOLEAN },
    isWrong: { type: Constants.BOOLEAN },
  }
};

export default Newword;
