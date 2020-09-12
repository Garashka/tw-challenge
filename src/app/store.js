import { configureStore } from '@reduxjs/toolkit';
import userDirectoryReducer from '../components/user-directory/directorySlice';

export default configureStore({
  reducer: {
    directory: userDirectoryReducer,
  },
});
