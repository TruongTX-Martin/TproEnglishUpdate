import Constants from '../Config/Constant';
const Lesson = {
  name: Constants.LESSON,
  primaryKey: Constants.ID,
  properties: {
    id: { type: Constants.STRING },
    childCategoryId: { type: Constants.STRING },
    title: { type: Constants.STRING },
    url: { type: Constants.STRING },
    transcripts: { type: 'Transcript[]' },
    questions: { type: 'Question[]' },
    isSubmit: { type: Constants.BOOLEAN },
    total: { type: Constants.INT },
    score: { type: Constants.INT }
  }
};

export default Lesson;
