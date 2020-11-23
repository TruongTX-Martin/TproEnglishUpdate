import Constants from '../config/Constant';

const Story = {
  name: Constants.STORY,
  primaryKey: Constants.ID,
  properties: {
    id: { type: Constants.STRING },
    categoryId: { type: Constants.STRING },
    name: { type: Constants.STRING },
    urlFile: { type: Constants.STRING },
    isView: { type: Constants.STRING },
  }
};

export default Story;