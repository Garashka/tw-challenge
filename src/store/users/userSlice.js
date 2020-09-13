import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'directory',
  initialState: {
    userApi: "https://reqres.in/api/users",
    users: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload.data
    },
  }
});

export const { setUsers } = userSlice.actions;

export default userSlice.reducer;