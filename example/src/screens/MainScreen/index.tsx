import React, { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/core';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { StackParamList } from "example/src/routes/types";
import PayIcon from "../../assets/images/original/ic_launcher_payment.png";
import MenuIcon from "../../assets/images/STONE_IMAGES/ic_menu.png";
import {
  ButtonArea,
  Buttons,
  CaptionText,
  Container,
  GreenImageIndex,
  ImageGreen,
  MenuIconImage,
  PayIconImage,
  TextMenu,
  TitleArea,
  TitleText,
  TitleView
} from "./styles";
import { getStoneCode, saveStoneCode, saveStoneInfo } from "../../utils/storages";
import LoadComponent from "../../components/Load";
import StonneService from "../../services/service_stone";
import type { InfoStoneCode, ReturnPOSType } from "example/src/utils/types";

import GreenImage from "../../assets/images/stone_extra.png";
import { BackHandler } from "react-native";

type navigateProps = NativeStackNavigationProp<StackParamList, 'MainScreen'>;

export default function MainScreen() {
  const [isSDKInitialized, setSDKInitialized] = useState(false);
  const Navigation = useNavigation<navigateProps>();
  const serviceStonne = new StonneService();
  const [load, setLoad] = useState(true);

  const [titleText, setTitleText] = useState('');

  const StoneCode = "569832657";

  async function handleStoneCode() {
    let stoneCodeValue = await getStoneCode();
    await serviceStonne.sdkInitialize().then(async () => {
      if (!stoneCodeValue && !isSDKInitialized) {
        await saveStoneCodeLocal(StoneCode).then(() => {
          setSDKInitialized(true);
        });
      };
    }).then(async () => {
      const StoneCodeInfos: ReturnPOSType = await serviceStonne.getActivatedCodesInfos();
      
      if (StoneCodeInfos.data) {
        const dataStoneCode: any[] = StoneCodeInfos.data;
        await saveStoneInfo(dataStoneCode[dataStoneCode.length - 1]).then((data: InfoStoneCode) => {
          if (data) {
            setTitleText(data.merchantName);
          }
        });
      }
    });
    setLoad(false);
  }

  async function saveStoneCodeLocal(stoneCode: string) {
    const dataResultStone: ReturnPOSType = await serviceStonne.approvedCodeActivationTest(stoneCode);
    await saveStoneCode(Number(stoneCode));
  }

  async function deactivate () {
    var initHardware = false;

    do {
      const returnData = await serviceStonne.deactivateHardware();
      if(returnData.type !== 'Error'){
        initHardware = true;
      }
    } while (!initHardware);

  }

  function backAction() {
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  useEffect(() => {
    handleStoneCode();
  }, []);

  useEffect(() => {
    deactivate();
  }, []);

  if (load) {
    return <LoadComponent />;
  }

  return (
    <Container>
      <TitleArea>
        <ImageGreen>
          <GreenImageIndex source={GreenImage} resizeMode="contain" />
        </ImageGreen>
        <TitleView>
          <TitleText>
            {titleText}
          </TitleText>
          <CaptionText>
            Acesse o pagamento para iniciar uma venda ou utilize o menu
          </CaptionText>
        </TitleView>
      </TitleArea>
      <ButtonArea>
        <Buttons activeOpacity={0.6} onPress={() => Navigation.navigate('Menu')}>
          <MenuIconImage source={MenuIcon} />
          <TextMenu>Menu</TextMenu>
        </Buttons>
        <Buttons activeOpacity={0.4} onPress={() => Navigation.navigate('InitialScreenPayment')}>
          <PayIconImage source={PayIcon} />
          <TextMenu>Pagamento</TextMenu>
        </Buttons>
      </ButtonArea>
    </Container >
  );
}