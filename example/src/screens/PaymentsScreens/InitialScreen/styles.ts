import styled from "styled-components/native";
import Feather from "react-native-vector-icons/Feather";
import colors from "../../../utils/colors";
import fonts from "../../../utils/fonts";

export const Container = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  justify-content: space-between;
`;

export const ValuesArea = styled.View`
    width: 100%;
    height: 120px;
    padding: 10px 20px;
`;

export const ViewsNumbers = styled.View`
    width: 100%;  
    flex-direction: row;
`

export const ViewsNumbersWhite = styled.View`
    width: 80%;
    background-color: ${colors.whiteBackground};
    padding: 50px 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
`

export const ViewsCalc = styled.View`
    width: 20%;
    padding: 15px 0px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
`

export const LabelValueView = styled.View`
    width: 100%;
`;

export const LabelValue = styled.Text`
    color: ${colors.grayLight};
    font-size: 16px;
    font-family: ${fonts.sharonSansRegular};
`;

export const ValueView = styled.View`
    width: 100%;
    display: flex;
    flex-direction: row;
`;

export const ValueMoneyView = styled.View`
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 25px;
`;

export const DeleteView = styled.View`
    width: 20%;
    display: flex;
    flex-direction: row;
    margin-top: 25px;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 15px 0px;
`;


export const MoneyText = styled(LabelValue)`
    font-size: 30px;
`;

export const ValueMoneyText = styled.Text`
    font-size: 30px;    
    font-family: ${fonts.sharonSansRegular};
`;

export const IconDelete = styled(Feather)`
    font-size: 30px;
`