import HomeStore from './domainstore/HomeStore';
import ListStoryStore from './domainstore/ListStoryStore';
import DetailStore from './domainstore/DetailStore';

const homeStore = new HomeStore();
const listStoryStore = new ListStoryStore();
const detailStore = new DetailStore();


export default {
    homeStore,
    listStoryStore,
    detailStore
}