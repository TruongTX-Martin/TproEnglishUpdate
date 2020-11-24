import Constants from '../Config/Constant';
const Answer = {
  name: Constants.ANSWER,
  properties: {
    key: { type: Constants.STRING },
    checked: { type: Constants.BOOLEAN },
    value: { type: Constants.STRING }
  }
};

export default Answer;
