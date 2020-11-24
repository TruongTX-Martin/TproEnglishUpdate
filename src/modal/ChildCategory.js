import Constants from '../Config/Constant';
const ChildCategory = {
  name: Constants.CHILDCATEGORY,
  primaryKey: Constants.ID,
  properties: {
    id: { type: Constants.STRING },
    categoryId: { type: Constants.STRING },
    title: { type: Constants.STRING }
  }
};

export default ChildCategory;
