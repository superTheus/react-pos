import React, { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/core';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TransactionType } from "react-native-stone-pos";
import * as StonePOS from 'react-native-stone-pos';
import axios from "axios";

import HeaderComponent from "../../../components/header";
import type { StackParamList } from "../../../routes/types";
import { LabelValue, MoneyText, ValueMoneyText, ValueMoneyView, ValueView } from "../InitialScreen/styles";
import FormPayButton from "../../../components/FormPay";
import ImgPay from "../../../assets/images/original/ic_insert_card.png";
import StoneLogoImg from "../../../assets/images/png/svgexport-5.png";
import QrcodeLogo from "../../../assets/images/png/svgexport-1.png";
import StonneService from "../../../services/service_stone";
import { getKey, getScreenInUse, getValuePay, saveKey, saveScreenInUse } from "../../../utils/storages";
import LoadComponent from "../../../components/Load";
import IconSuccess from "../../../assets/images/jaddcomponents_assets_images_selectedbullet.png";
import IconError from "../../../assets/images/original/ic_close_error.png";
import IconErrorV2 from "../../../assets/images/original/ic_close_error_v2.png";
import GreenCircle from "../../../assets/images/STONE_IMAGES/ic_green_circle.png";
import LogingCircle from "../../../assets/images/loading_pay.gif";

import {
  BackViewGreen,
  BtnClose,
  BtnPrint,
  ButtonView,
  CaptionGreenQrcode,
  CaptionQrcode,
  Container,
  ContainerForms,
  ContainerPay,
  ContainerPortions,
  ContainerPrint,
  Icon,
  ImagePay,
  ImageView,
  LabelBtnClose,
  LabelBtnPrint,
  LabelValuePayView,
  PaySelected,
  PaySelectedLabel,
  Qrcode,
  SpinnerLoad,
  StoneLogo,
  Subtitle,
  SubtitleScreenErro,
  TitleScreenErro,
  ValueArea,
  ViewQrCode
} from "./styles";
import { format } from "../../../utils/utils";
import { Alert, BackHandler, DeviceEventEmitter, Image, ImageBackground, StyleSheet } from "react-native";

type navigateProps = NativeStackNavigationProp<StackParamList, 'MainScreen'>;

export default function PaymentForms() {
  const Navigation = useNavigation<navigateProps>();
  const serviceStonne = new StonneService();

  const [selectedForm, setSelectedForm] = useState(false);
  const [selectedFormText, setSelectedFormText] = useState('');
  const [valuePayText, setValuePayText] = useState('');
  const [valueMoney, setValueMoney] = useState(0);
  const [load, setLoad] = useState(true);

  const [screenLoadSending, setScreenLoadSending] = useState(false);

  const [erroScreenTitle, setErroScreenTitle] = useState("Erro na Leitura");
  const [erroScreenSubtitle, setErroScreenSubtitle] = useState<String>();

  const [screenInUse, setScreenInUse] = useState<"creditScreen" | "portionScreen" | "mainScreen" | "payScreen" | "errorScreen" | "errorScreenV2" | "printScreen">("mainScreen");

  function defineFormPayText(type: 'debit' | 'credit' | 'voucher' | 'pix' | 'code') {
    switch (type) {
      case 'debit':
        setSelectedFormText('Débito');
        break;
      case 'credit':
        setSelectedFormText('Crédito');
        break;
      case 'voucher':
        setSelectedFormText('Alimentação');
        break;
      case 'pix':
        setSelectedFormText('Pix');
        break;
      case 'code':
        setSelectedFormText('QR Code');
        break;
    }
  }

  async function savePay(form: 'debit' | 'credit' | 'voucher' | 'pix' | 'code') {
    defineFormPayText(form);
    setSelectedForm(true);

    /** Pega o valor corrente digitado na maquina */
    let amount: any = valuePayText.replace(",", '').replace(".", "");
    if (form === 'debit') {
      amount = await getValueApi();
      selectedScreen("payScreen");
      setScreenInUse("payScreen");
      await serviceStonne.payServiceCreditDebit(amount, 'DEBIT', valuePayText.replace(",", '').replace(".", "")).then(async (transactionStatus: TransactionType) => {
        var transctionKey = "";
        if (transactionStatus.transactionStatus == 'APPROVED') {
          transactionStatus.balance = valuePayText.replace(",", '').replace(".", "");
          selectedScreen("printScreen");
          setScreenInUse("printScreen");
          /** Repassa valor naturalizado para impressora */
          console.log(
            'Imprimindo via estabelecimento',
            await StonePOS.printReceiptInPOSPrinterReactive(
              'MERCHANT',
              transactionStatus.acquirerTransactionKey!,
              valuePayText.replace(",", '').replace(".", ""),
              false,
              'Imprimindo via estabelecimento'
            )
          );
          console.log(transactionStatus.balance);
          transctionKey = JSON.stringify(transactionStatus);
        } else if (transactionStatus.transactionStatus == 'WITH_ERROR') {
          selectedScreen("errorScreen");
          setScreenInUse("errorScreen");
          setErroScreenSubtitle("Transação cancelada pelo usuário.");
          setErroScreenTitle("Transação Cancelada")
          return;
        } else {
          if (transactionStatus.messageFromAuthorizer && transactionStatus.messageFromAuthorizer.includes('CARTÃO RECUSADO, NÃO TENTE NOVAMENTE.')) {
            selectedScreen("errorScreenV2");
            setScreenInUse("errorScreenV2");
            setErroScreenTitle("Erro na transação");
            if (transactionStatus.messageFromAuthorizer === 'CARTÃO RECUSADO, NÃO TENTE NOVAMENTE.') {
              setErroScreenSubtitle(transactionStatus.messageFromAuthorizer);
              return;
            }
            if (transactionStatus.messageFromAuthorizer.includes('MSG: ')) {
              let message = transactionStatus.messageFromAuthorizer.split("CARTÃO RECUSADO, NÃO TENTE NOVAMENTE. MSG: ");
              setErroScreenSubtitle(message[1]);
              return;
            }
          }
          selectedScreen("errorScreen");
          setScreenInUse("errorScreen");
          if (transactionStatus.messageFromAuthorizer) {
            setErroScreenSubtitle(transactionStatus.messageFromAuthorizer);
          }
        }

        setTimeout(async () => {
          await saveKey(transctionKey);
        }, 500);
      });
    }
    if (form === 'credit') {
      selectedScreen("creditScreen");
      setScreenInUse("creditScreen");
    }
  }

  async function getValueApi() {
    const options = {
      method: 'POST',
      url: 'http://200.9.155.175/v1/api/bin',
      headers: { 'Content-Type': 'application/json' },
      data: {
        serial_number: await StonePOS.getPOS()
      }
    };
    const result = await axios.request(options).then(async (response) => {
      return response.data.amount
    }).catch(function (error) {
      return false;
    });
    return result;
  }

  async function payCredit(portionValue: number) {
    selectedScreen("payScreen");
    setScreenInUse("payScreen");
    if (portionValue === 1) {
      setSelectedFormText('À Vista');
    } else {
      setSelectedFormText('Sem Juros');
    }

    /** Pega o valor corrente digitado na maquina */
    let amount: any = valuePayText.replace(",", '').replace(".", "");
    amount = await getValueApi();
    await serviceStonne.payServiceCreditDebit(amount, "CREDIT", valuePayText.replace(",", '').replace(".", ""), portionValue, false).then(async (transactionStatus: TransactionType) => {
      var transctionKey = "";
      if (transactionStatus.transactionStatus == 'APPROVED') {
        selectedScreen("printScreen");
        setScreenInUse("printScreen");
        console.log(
          'Imprimindo via estabelecimento',
          await StonePOS.printReceiptInPOSPrinterReactive(
            'MERCHANT',
            transactionStatus.acquirerTransactionKey!,
            valuePayText.replace(",", '').replace(".", ""),
            false,
            'Imprimindo via estabelecimento'
          )
        );
        transctionKey = JSON.stringify(transactionStatus);
      } else if (transactionStatus.transactionStatus == 'WITH_ERROR') {
        selectedScreen("errorScreen");
        setScreenInUse("errorScreen");
        setErroScreenSubtitle("Transação cancelada pelo usuário.");
        setErroScreenTitle("Transação Cancelada")
        return;
      } else {
        if (transactionStatus.messageFromAuthorizer && transactionStatus.messageFromAuthorizer.includes('CARTÃO RECUSADO, NÃO TENTE NOVAMENTE.')) {
          selectedScreen("errorScreenV2");
          setScreenInUse("errorScreenV2");
          setErroScreenTitle("Erro na transação");
          if (transactionStatus.messageFromAuthorizer === 'CARTÃO RECUSADO, NÃO TENTE NOVAMENTE.') {
            setErroScreenSubtitle(transactionStatus.messageFromAuthorizer);
            return;
          }
          if (transactionStatus.messageFromAuthorizer.includes('MSG: ')) {
            let message = transactionStatus.messageFromAuthorizer.split("CARTÃO RECUSADO, NÃO TENTE NOVAMENTE. MSG: ");
            setErroScreenSubtitle(message[1]);
            return;
          }
        }
        selectedScreen("errorScreen");
        setScreenInUse("errorScreen");
        if (transactionStatus.messageFromAuthorizer) {
          setErroScreenSubtitle(transactionStatus.messageFromAuthorizer);
        }
      }

      setTimeout(async () => {
        await saveKey(transctionKey);
      }, 500);
    });
  }

  async function printClient() {
    const value = await getKey();
    if (value) {
      /** NESSE CASO IMPRIME A VIA PENULTIMA VIA */
      console.log(
        'Imprimindo via cliente',
        await StonePOS.printReceiptInPOSPrinterReactive(
          'CLIENT',
          JSON.parse(value).acquirerTransactionKey!,
          valuePayText.replace(",", '').replace(".", ""),
          false,
          'Imprimindo via cliente'
        )
      );
    }
  }

  async function getValuePayment() {
    const value = await getValuePay();
    if (value) {
      setValueMoney(value);
      setValuePayText(format(value));
    }
    setLoad(false);
  }

  function formatPotion(portion: number): string {
    let value = valueMoney;
    let portionValue = value / portion;
    let text = format(portionValue);
    return text;
  }

  async function selectedScreen(value: "creditScreen" | "portionScreen" | "mainScreen" | "payScreen" | "errorScreen" | "errorScreenV2" | "printScreen") {
    await saveScreenInUse(value);
  }

  async function cancelTransaction() {
    selectedScreen("mainScreen");
    setScreenInUse("mainScreen");
  }

  async function backAction() {
    const screen = await getScreenInUse();

    // if(screenLoadSending){
    //   return true;
    // }

    if (screen == "creditScreen" || screen == "errorScreen") {
      selectedScreen("mainScreen");
      setScreenInUse("mainScreen");
    }
    if (screen == "portionScreen") {
      selectedScreen("creditScreen");
      setScreenInUse("creditScreen");
    }
    if (screen == "payScreen") {
      Alert.alert("", "Deseja sair de Pagamento? A sua operação não será finalizada", [
        {
          text: "NÃO",
          onPress: () => null,
          style: "cancel"
        },
        {
          text: "SIM",
          onPress: () => cancelTransaction()
        }
      ]);
    }
    if (screen == "mainScreen") {
      Alert.alert("Atenção!", "Tem certeza que deseja sair?", [
        {
          text: "Cancelar",
          onPress: () => null,
          style: "cancel"
        },
        {
          text: "SIM",
          onPress: () => Navigation.goBack()
        }
      ]);
    }
    if (screen == "printScreen") {
      Navigation.navigate("MainScreen");
    }
    return true;
  };

  function closeErrorScreen() {
    setScreenLoadSending(false);
    selectedScreen("mainScreen");
    setScreenInUse("mainScreen");
  }

  function initPortionScreen() {
    selectedScreen("portionScreen");
    setScreenInUse("portionScreen");
  }

  useEffect(() => {
    DeviceEventEmitter.addListener("MAKE_TRANSACTION_PROGRESS", (data: any) => {
      if (data.status === "TRANSACTION_SENDING") {
        setScreenLoadSending(true);
      }
    });
  }, []);

  useEffect(() => {
    getValuePayment();
    selectedScreen("mainScreen");
  }, [])

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  if (load) {
    return <LoadComponent />;
  }

  if (screenInUse == "printScreen") {
    return (
      <ContainerPrint>
        <ImageView>
          <Icon source={IconSuccess} resizeMode="contain" />
          <Subtitle>Pagamento Aprovado</Subtitle>
        </ImageView>
        <ButtonView>
          <BtnClose activeOpacity={0.6} onPress={() => Navigation.navigate("MainScreen")} >
            <LabelBtnClose> Fechar </LabelBtnClose>
          </BtnClose>
          <BtnPrint activeOpacity={0.6} onPress={() => printClient()}>
            <LabelBtnPrint> Imprimir Via do Cliente </LabelBtnPrint>
          </BtnPrint>
        </ButtonView>
      </ContainerPrint>
    );
  }

  if (screenInUse == "errorScreen" || screenInUse == "errorScreenV2") {
    return (
      <ContainerPrint>
        <ImageView>
          {screenInUse == "errorScreen" ?
            <Icon source={IconError} resizeMode="contain" />
            :
            <Icon source={IconErrorV2} resizeMode="contain" />
          }
          <TitleScreenErro>{erroScreenTitle}</TitleScreenErro>
          <SubtitleScreenErro>{erroScreenSubtitle}</SubtitleScreenErro>
        </ImageView>
        <ButtonView>
          <BtnClose activeOpacity={0.6} onPress={() => closeErrorScreen()} >
            <LabelBtnClose> Fechar </LabelBtnClose>
          </BtnClose>
        </ButtonView>
      </ContainerPrint>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
      justifyContent: "center"
    },
    text: {
      color: "white",
      fontSize: 42,
      lineHeight: 84,
      fontWeight: "bold",
      textAlign: "center",
      backgroundColor: "#000000c0"
    }
  });

  if (screenLoadSending) {
    return (
      <ContainerPrint>
        <ImageView>
          <BackViewGreen>
            <ImageBackground source={GreenCircle} resizeMode="contain" style={styles.image}>
              <SpinnerLoad source={LogingCircle} resizeMode="contain" />
            </ImageBackground>
          </BackViewGreen>
          <TitleScreenErro> Processando </TitleScreenErro>
        </ImageView>
      </ContainerPrint>
    );
  }

  return (
    <Container>
      <HeaderComponent text="MODALIDADE" border={true} option={() => backAction()} />
      <ValueArea>
        <LabelValuePayView>
          <LabelValue> Valor </LabelValue>
          {selectedForm &&
            <PaySelected>
              <PaySelectedLabel>
                {selectedFormText}
              </PaySelectedLabel>
            </PaySelected>
          }
        </LabelValuePayView>
        <ValueView>
          <ValueMoneyView>
            <MoneyText> R$ </MoneyText>
            <ValueMoneyText> {valuePayText} </ValueMoneyText>
          </ValueMoneyView>
        </ValueView>
      </ValueArea>
      {screenInUse == "mainScreen" ?
        <ContainerForms>
          <FormPayButton order="1" text="Débito" action={() => savePay("debit")} />
          <FormPayButton order="2" text="Crédito" action={() => savePay("credit")} />
        </ContainerForms>
        : screenInUse == "payScreen" ?
          <ContainerPay>
            <ImagePay source={ImgPay} resizeMode="contain" />
            <Subtitle>
              Aproxime, insira ou passe o cartão
            </Subtitle>
            <StoneLogo source={StoneLogoImg} resizeMode="contain" />
            <ViewQrCode>
              <Qrcode source={QrcodeLogo} resizeMode="contain" />
              <CaptionQrcode> Ou pague com {'\n'} <CaptionGreenQrcode> QR Code clicando aqui </CaptionGreenQrcode> </CaptionQrcode>
            </ViewQrCode>
          </ContainerPay>
          : screenInUse == "portionScreen" ?
            <ContainerPortions>
              <FormPayButton order="2" alternative text={formatPotion(2)} action={() => payCredit(2)} />
              <FormPayButton order="3" alternative text={formatPotion(3)} action={() => payCredit(3)} />
              <FormPayButton order="4" alternative text={formatPotion(4)} action={() => payCredit(4)} />
              <FormPayButton order="5" alternative text={formatPotion(5)} action={() => payCredit(5)} />
              <FormPayButton order="6" alternative text={formatPotion(6)} action={() => payCredit(6)} />
              <FormPayButton order="7" alternative text={formatPotion(7)} action={() => payCredit(7)} />
              <FormPayButton order="8" alternative text={formatPotion(8)} action={() => payCredit(8)} />
              <FormPayButton order="9" alternative text={formatPotion(9)} action={() => payCredit(9)} />
              <FormPayButton order="10" alternative text={formatPotion(10)} action={() => payCredit(10)} />
              <FormPayButton order="11" alternative text={formatPotion(11)} action={() => payCredit(11)} />
              <FormPayButton order="12" alternative text={formatPotion(12)} action={() => payCredit(12)} />
              {/* <FormPayButton order="13" alternative text={formatPotion(13)} action={() => payCredit(13)} />
              <FormPayButton order="14" alternative text={formatPotion(14)} action={() => payCredit(14)} />
              <FormPayButton order="15" alternative text={formatPotion(15)} action={() => payCredit(15)} />
              <FormPayButton order="16" alternative text={formatPotion(16)} action={() => payCredit(16)} />
              <FormPayButton order="17" alternative text={formatPotion(17)} action={() => payCredit(17)} />
              <FormPayButton order="18" alternative text={formatPotion(18)} action={() => payCredit(18)} /> */}
            </ContainerPortions>
            : screenInUse == "creditScreen" &&
            <ContainerForms>
              <FormPayButton order="1" text="À Vista" action={() => payCredit(1)} />
              {valueMoney >= 20 &&
                <FormPayButton order="2" text="Parcelado sem Juros" action={() => initPortionScreen()} />
              }
            </ContainerForms>
      }
    </Container>
  );
}