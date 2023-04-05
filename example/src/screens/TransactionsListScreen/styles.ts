import fonts from "../../utils/fonts";
import styled from "styled-components/native";
import colors from "../../utils/colors";

export const Container = styled.SafeAreaView`
  flex: 1;
  padding: 20px;
`;

export const TrasactionView = styled.TouchableOpacity`
    width: 100%;
    padding: 10px 0px;
    border-bottom-color: ${colors.primaryColorGreen};
    border-bottom-width: 1px;
`;

export const Line = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
`;

export const TitleView = styled.Text`
    font-size: 18px;
    color: ${colors.gray};
    font-family: ${fonts.sharonSansRegular};
`;

export const StatusText = styled.Text`
    font-size: 12px;
    color: ${colors.gray};
    font-family: ${fonts.sharonSansRegular};
`;

export const ContainerModal = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

export const MainViewModal = styled.View`
    width: 90%;
    background-color: ${colors.whiteBackground};
    padding: 20px;
    border-radius: 5px;
`

export const LineModal = styled.TouchableOpacity`
    width: 100%;
    justify-content: center;
    align-items: center
    border-bottom-color: ${colors.grayLight};
    border-bottom-width: 1px;
    padding: 15px 0px;
`;

export const TextModal = styled.Text`
    font-size: 16px;
    color: ${colors.gray};
    font-family: ${fonts.sharonSansRegular};
`;

export const ButtonClose = styled.TouchableOpacity`
    width: 30px;
    height: 30px;
    background-color: ${colors.whiteBackground};
    border-radius: 15px;
    z-index: -100;
    position: absolute;
    top: -10px;
    right: -10px;
    justify-content: center;
    align-items: center;
`;

export const ImageClose = styled.Image`
    width: 100%;
`;