import React from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import type { StackParamList } from "../../routes/types";
import TransactionIcon from "../../assets/images/STONE_IMAGES/list.png";
import HelpIcon from "../../assets/images/STONE_IMAGES/ic_launcher.png";
import {
    Buttons,
    Container,
    IconButton,
    TextButton,
    ViewButtons
} from "./styles";
import HeaderComponent from "../../components/header";
import StonneService from "../../services/service_stone";

type navigateProps = NativeStackNavigationProp<StackParamList, 'TransactionList'>;

export default function MenuComponent() {
    const Navigation = useNavigation<navigateProps>();
    
    const serviceStonne = new StonneService();

    return (
        <>
            <HeaderComponent text="Aplicativos" option={() => Navigation.goBack()} />
            <Container>
                <ViewButtons>
                    <Buttons activeOpacity={0.6} onPress={() => Navigation.navigate('TransactionList')}>
                        <IconButton source={TransactionIcon} />
                        <TextButton>Transações</TextButton>
                    </Buttons>
                    <Buttons activeOpacity={0.6}>
                        <IconButton source={HelpIcon} />
                        <TextButton>Suporte</TextButton>
                    </Buttons>
                </ViewButtons>
            </Container>
        </>
    );
}