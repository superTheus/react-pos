import fonts from "../../utils/fonts";
import styled from "styled-components/native";
import colors from "../../utils/colors";

export const Container = styled.SafeAreaView`
  flex: 1;
  padding: 20px;
  align-items: center;
  justify-content: space-between;
`;

export const TitleArea = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 400px;
`

export const ImageGreen = styled.View`
  width: 50%;
`;

export const TitleView = styled(ImageGreen)`
  margin-top: 150px;
  height: 170px;
  justify-content: space-between;
`;

export const TitleText = styled.Text`
  color: ${colors.secondaryColorGreen};
  font-size: 20px;
  font-family: ${fonts.sharonSansBold};
`;

export const CaptionText = styled.Text`
  color: ${colors.gray};
  font-size: 14px;
  font-family: ${fonts.sharonSansRegular};
`;

export const ButtonArea =  styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const Buttons =  styled.TouchableOpacity`
  width: 45%;
  height: 150px;
  background-color: ${colors.whiteBackground};
  border-radius: 10px;
  justify-content: space-between;
  align-items: center;
  padding: 30px 20px;
`;

export const TextMenu = styled.Text`
  font-size: 20px;
  font-weight: 200;
  font-family: ${fonts.sharonSansLight};
`;

export const PayIconImage = styled.Image`
  width: 40px;
  height: 40px;
`;

export const MenuIconImage = styled.Image`
  width: 30px;
  height: 30px;
`;

export const ContainerInput = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const Input = styled.TextInput`
  width: 100%;
  height: 40px;
  border: 0px;
  border-bottom-color: ${colors.primaryColorGreen};
  border-bottom-width: 1px;
  text-align: center;
`

export const ButtonSave = styled.TouchableOpacity`
  width: 100px;
  height: 30px;
  border-radius: 5px;
  background-color: ${colors.primaryColorGreen};
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export const TextButton = styled.Text`
  color: ${colors.whiteBackground};
`;

export const GreenImageIndex = styled.Image`
  width: 90%;
`