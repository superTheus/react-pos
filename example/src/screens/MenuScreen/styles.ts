import fonts from "../../utils/fonts";
import styled from "styled-components/native";
import colors from "../../utils/colors";

export const Container = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

export const ViewButtons = styled.View`
    display: flex;
    width: 100%;
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

export const IconButton = styled.Image`
  width: 30px;
  height: 30px;
`;

export const TextButton = styled.Text`
  font-size: 20px;
  font-weight: 200;
  font-family: ${fonts.sharonSansLight};
`;