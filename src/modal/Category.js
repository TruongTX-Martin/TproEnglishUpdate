import Constants from '../config/Constant';

const Category = {
    name: Constants.CATEGORY,
    primaryKey: Constants.ID,
    properties: {
      id: { type: Constants.STRING },
      title: { type: Constants.STRING },
    }
  };
  
  export default Category;