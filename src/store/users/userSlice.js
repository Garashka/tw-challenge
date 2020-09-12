import { createSlice } from '@reduxjs/toolkit';

export const userDirectorySlice = createSlice({
  name: 'directory',
  initialState: {
    api: "https://reqres.in/api/users",
    users: [{
      "id": 1,
      "email": "george.bluth@reqres.in",
      "first_name": "George",
      "last_name": "Bluth",
      "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"
    }],
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload.data
    },
  }
});

export const { setUsers } = userDirectorySlice.actions;

export default userDirectorySlice.reducer;