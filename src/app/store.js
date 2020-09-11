import { configureStore } from '@reduxjs/toolkit';
import userDirectoryReducer from '../features/user-directory/directorySlice';

export default configureStore({
  reducer: {
    directory: userDirectoryReducer,
  },
});
