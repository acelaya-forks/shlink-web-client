import { createSlice } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';

const { actions, reducer } = createSlice({
  name: 'shlink/appUpdates',
  initialState: false,
  reducers: {
    appUpdateAvailable: () => true,
    resetAppUpdate: () => false,
  },
});

export const { appUpdateAvailable, resetAppUpdate } = actions;

export const appUpdatesReducer = reducer;

export const useAppUpdated = () => {
  const dispatch = useAppDispatch();
  const appUpdateAvailable = useCallback(() => dispatch(actions.appUpdateAvailable()), [dispatch]);
  const resetAppUpdate = useCallback(() => dispatch(actions.resetAppUpdate()), [dispatch]);
  const appUpdated = useAppSelector((state) => state.appUpdated);

  return { appUpdated, appUpdateAvailable, resetAppUpdate };
};
