import React, { useEffect, useState } from "react";
import type { TrasactionsType } from "example/src/utils/types";
import { formatter, getMsgReturn, statuTransaction } from "../../utils/utils";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import * as StonePOS from 'react-native-stone-pos';

import CloseIcon from "../../assets/images/STONE_IMAGES/ic_cancel.png";
import StonneService from "../../services/service_stone";
import {
    ButtonClose,
    Container,
    ContainerModal,
    ImageClose,
    Line,
    LineModal,
    MainViewModal,
    StatusText,
    TextModal,
    TitleView,
    TrasactionView
} from "./styles";
import { FlatList, Text, View } from "react-native";
import HeaderComponent from "../../components/header";
import type { StackParamList } from "../../routes/types";
import LoadComponent from "../../components/Load";

type navigateProps = NativeStackNavigationProp<StackParamList, 'MainScreen'>;

export default function TransactionList() {
    const Navigation = useNavigation<navigateProps>();
    const serviceStonne = new StonneService();

    const [load, setLoad] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const [TransactionList, setTransactionList] = useState<TrasactionsType[]>([]);
    const [transactionInUse, setTransactionInUse] = useState<TrasactionsType>();

    async function handleListTransactions() {
        const data = await serviceStonne.allTransactionData();
        const transactions = [];
        data.data.reverse();
        for (var counter = 0; counter < data.data.length; counter++) {
            console.log(data.data[counter]);
            if (counter === 0) {
                if (data.data[counter].transactionStatus === 'APPROVED' && data.data[counter].balance != null) {
                    data.data[counter].amount = data.data[counter].balance;
                    transactions.push(data.data[counter]);
                }
                continue;
            }
            let current_transaction = data.data[counter];
            if (current_transaction.transactionStatus === 'APPROVED' && current_transaction.balance != null) {
                current_transaction.amount = current_transaction.balance;
                transactions.push(current_transaction);
            }
        }
        transactions.reverse()
        setTransactionList(transactions);
        setLoad(false);
    }

    function getValue(transaction: TrasactionsType): string {
        let AUX = "0";
        if (transaction && transaction?.amount.length >= 3) {
            let LastNumber = transaction?.amount[transaction?.amount.length - 1];
            let PenultimateNumber = transaction?.amount[transaction?.amount.length - 2];
            let Float = "." + PenultimateNumber + LastNumber;
            AUX = transaction?.amount.slice(0, -2) + Float
        }
        return formatter.format(parseFloat(AUX));
    }

    function getStatus(transaction: TrasactionsType): statuTransaction {
        return getMsgReturn(transaction);
    }

    function selectedTransaction(transaction: TrasactionsType) {
        setTransactionInUse(transaction);
        setModalOpen(true);
    }

    async function print(type: 'MERCHANT' | 'CLIENT') {
        await StonePOS.printReceiptInPOSPrinterReactive(
            type,
            transactionInUse?.acquirerTransactionKey!,
            transactionInUse?.amount ?? '',
            false,
            'Imprimindo via cliente'
        );
    }

    const renderItem = ({ item }: any) => {
        const Transaction: TrasactionsType = item;
        if (Transaction.transactionStatus !== "PENDING") {
            return (
                <TrasactionView activeOpacity={0.6} onPress={() => selectedTransaction(Transaction)}>
                    <Line>
                        <TitleView> {Transaction.appLabel} </TitleView>
                        <TitleView> {getValue(Transaction)} </TitleView>
                    </Line>
                    <Line>
                        <StatusText> {Transaction.cardHolderNumber} - {Transaction.cardBrandName} </StatusText>
                        <StatusText> {getStatus(Transaction).tipo} </StatusText>
                    </Line>
                </TrasactionView>
            );
        }
    }

    useEffect(() => {
        handleListTransactions();
    }, []);

    if (load) {
        return <LoadComponent />;
    }

    return (
        <>
            <Modal isVisible={modalOpen}>
                <ContainerModal>
                    <MainViewModal>
                        <ButtonClose activeOpacity={0.6} onPress={() => setModalOpen(false)}>
                            <ImageClose source={CloseIcon} resizeMode="contain" />
                        </ButtonClose>
                        <LineModal activeOpacity={0.6} onPress={() => print("CLIENT")}>
                            <TextModal>Imprimir Via do Cliente</TextModal>
                        </LineModal>
                        <LineModal activeOpacity={0.6} onPress={() => print("MERCHANT")}>
                            <TextModal>Imprimir Via do Estabelecimento</TextModal>
                        </LineModal>
                    </MainViewModal>
                </ContainerModal>
            </Modal>
            <HeaderComponent text="Lista de Transações" option={() => Navigation.goBack()}> </HeaderComponent>
            <Container>
                <FlatList
                    data={TransactionList}
                    renderItem={renderItem}
                    keyExtractor={(item: TrasactionsType) => item.transactionReference + item.time}
                    showsVerticalScrollIndicator={false}
                />
            </Container>
        </>
    );
}