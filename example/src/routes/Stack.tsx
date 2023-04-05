import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { StackParamList } from './types';
import MainScreen from '../screens/MainScreen';
import InitialScreenPayment from '../screens/PaymentsScreens/InitialScreen';
import PaymentForms from '../screens/PaymentsScreens/PaymentForms';
import MenuComponent from '../screens/MenuScreen';
import TransactionList from '../screens/TransactionsListScreen';

const StackNavigator = createNativeStackNavigator<StackParamList>();

export default function Stack() {
  return (
    <NavigationContainer>
      <StackNavigator.Navigator>
        <StackNavigator.Screen options={{
          headerShown: false
        }}
          name="MainScreen" component={MainScreen} />
        <StackNavigator.Screen options={{
          headerShown: false
        }}
          name="Menu" component={MenuComponent} />
        <StackNavigator.Screen options={{
          headerShown: false
        }}
          name="InitialScreenPayment" component={InitialScreenPayment} />
        <StackNavigator.Screen options={{
          headerShown: false
        }}
          name="PaymentForms" component={PaymentForms} />
        <StackNavigator.Screen options={{
          headerShown: false
        }}
          name="TransactionList" component={TransactionList} />
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
}
