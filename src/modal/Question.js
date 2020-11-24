import Constants from '../Config/Constant';
const Question = {
  name: Constants.QUESTION,
  properties: {
    question: { type: Constants.STRING },
    answers: { type: 'Answer[]' },
  }
};

export default Question;
