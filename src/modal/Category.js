import Constants from '../Config/Constant';
const Category = {
  name: Constants.CATEGORY,
  primaryKey: Constants.ID,
  properties: {
    id: { type: Constants.STRING },
    title: { type: Constants.STRING },
    description: { type: Constants.STRING }
  }
};

export default Category;
