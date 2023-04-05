import fonts from "../../../utils/fonts";
import styled from "styled-components/native";
import colors from "../../../utils/colors";
import { LabelValueView, ValuesArea } from "../InitialScreen/styles";

export const Container = styled.SafeAreaView`
  flex: 1;
  align-items: center;
`;

export const LabelValuePayView = styled(LabelValueView)`
  flex-direction: row;
  justify-content: space-between;
`;

export const PaySelected = styled.View`
  width: auto;
  height: 30px;
  border-radius: 20px;
  background-color: ${colors.primaryColorGreen};
  justify-content: center;
  align-items: center;
  padding: 0px 10px;
`

export const PaySelectedLabel = styled.Text`
  color: ${colors.whiteBackground};
  font-weight: 600;
  font-family: ${fonts.sharonSansRegular};
`

export const ContainerForms = styled.View`
  width: 100%;
  align-items: center;
  margin-top: 20px;
`;

export const ContainerPortions = styled.ScrollView`
  width: 100%;
`;

export const ValueArea = styled(ValuesArea)`
  height: auto;
  padding: 10px 10px;
  margin-bottom: 0px;
  background-color: ${colors.whiteBackground};
  border-bottom-width: 1px;
  border-color: ${colors.alternativeWhite};
`;

export const ContainerPay = styled.View`
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 68%;
  padding: 0px 20px;
`;

export const ImagePay = styled.Image`
  width: 150px;
  height: 140px;
  margin-top: 30px;
`;

export const Subtitle = styled.Text`
  font-size: 20px;
  color: ${colors.gray};
  width: 200px;
  text-align: center;
  margin-top: 30px;
  font-family: ${fonts.sharonSansRegular};
`;

export const TitleScreenErro = styled(Subtitle)`
  color: ${colors.black};
  font-family: ${fonts.sharonSansRegular};
`;

export const SubtitleScreenErro = styled(Subtitle)`
  font-size: 16px;
  width: 100%;
  font-family: ${fonts.sharonSansRegular};
`;

export const ContainerPrint = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    justify-content: space-between;
    padding:  20px;
`;

export const ButtonView = styled.TouchableOpacity`
    width: 100%;
    height: 150px;
    justify-content: space-between;
`;

export const ImageView = styled.View`
    width:100%;
    align-items: center;
    padding: 20px;
`;

export const Icon = styled.Image`
    width: 150px;
    height: 150px;
`;

export const SubtitlePrint = styled.Text`
    font-size: 24px;
    margin-top: 20px;
    color: ${colors.gray};
`;

export const BtnClose = styled.TouchableOpacity`
    border-radius: 10px;
    border: 1px solid ${colors.primaryColorGreen};
    padding: 20px;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

export const BtnPrint = styled(BtnClose)`
    background-color: ${colors.primaryColorGreen};
    border: 0px;
`;

export const LabelBtnClose = styled.Text`
    color: ${colors.primaryColorGreen};
    font-size: 16px;
    font-family: ${fonts.sharonSansRegular};
`;

export const LabelBtnPrint = styled(LabelBtnClose)`
    color: ${colors.whiteBackground}; 
    font-family: ${fonts.sharonSansRegular};   
`;

export const StoneLogo = styled.Image`
  width: 100px;
  height: 20px;
  margin-top: 10px;
`

export const ViewQrCode = styled.View`
  width: 100%;
  border-top-color: ${colors.grayLight};
  border-top-width: 1px;
  padding-top: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const Qrcode = styled.Image`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`

export const CaptionQrcode = styled.Text`
  font-size: 18px;
  width: 200px;
`;

export const CaptionGreenQrcode = styled(CaptionQrcode)`
  color: ${colors.primaryColorGreen};
  text-decoration: underline;
`;

export const BackViewGreen = styled.View`
  width: 150px;
  height: 150px;
`;

export const SpinnerLoad = styled.Image`
  width: 150px;
  height: 150px;
`;