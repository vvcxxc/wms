import store from '@/store'
export const TOKEN_KEY = 'token'

export const setToken = (token) => {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export const getToken = () => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (token) return token
  else return false
}
export const addTagNavList = (index, query) => {
  let list = store.state.app.tagNavList
  if (!list) {
    store.state.app.tagNavList = []
    store.state.app.tagNavList.push({
      index: index,
      query: query,
      isActive: true,
    });
  } else {
    let num = 0;
    for (let i = 0; i < list.length; i++) {
      if (index == list[i].index) {
        num++;
        store.state.app.tagNavList[i].isActive = true;
      } else {
        store.state.app.tagNavList[i].isActive = false;
      }
    }
    if (num <= 0) {
      store.state.app.tagNavList.push({
        index: index,
        query: query,
        isActive: true,
      });
    }
  }
  sessionStorage.tagList = JSON.stringify(store.state.app.tagNavList)
}