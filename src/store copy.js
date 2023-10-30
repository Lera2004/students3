import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";

export default createStore({
  plugins: [createPersistedState()],
  state: {
    count: 0,
    theme: "light-theme",
    user: null

  },
   mutations: { 
        setCount: (state, count) => { 
            state.count = count; 
        }, 
        setTheme: (state, theme) => { 
            state.theme = theme; 
        }, 
        setUser: (state, user) => {
          state.user = user;
        },
    },
  actions: {
    setCount({ commit }, count) {
      commit('setCount', count);
    },

  },
  getters: {
    getCount: (state) => state.count,
    getSelectedTheme: (state) => state.theme,
    getUser: (state) =>
         {
             return state.user
         }

  },
})
