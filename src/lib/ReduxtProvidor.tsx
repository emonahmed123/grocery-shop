"use client"


import { store, persistor } from '@/redux/store';
import React from 'react';
import { Provider } from 'react-redux';

import { PersistGate } from 'redux-persist/integration/react'
import { AuthProviders } from './AuthProviders';

const ReduxtProvidor = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor} >
                <AuthProviders>    {children}</AuthProviders>
            </PersistGate>
        </Provider>
    );
};

export default ReduxtProvidor;