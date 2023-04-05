import React from "react";
import styled from "styled-components/native";
import Feather from "react-native-vector-icons/Feather";

import colors from "../utils/colors";
import { StyleSheet } from "react-native";
import fonts from "../utils/fonts";


type FormPayButtonProps = {
    order: string;
    text: string;
    action: () => void;
    alternative?: boolean;
}

export default function FormPayButton({ order, text, action, alternative }: FormPayButtonProps) {
    return (
        <>
            {!alternative ?
                <Container activeOpacity={0.6} onPress={action} style={Style.box}>
                    <TextLabel>
                        {order} - {text}
                    </TextLabel>
                    <Icon name="arrow-right" size={24} />
                </Container>
                :
                <ContainerAlternative activeOpacity={0.6} onPress={action}>
                    <TextLabel>
                        <TextPortion>{order}x</TextPortion> - {text}
                    </TextLabel>
                    <Icon name="arrow-right" size={24} />
                </ContainerAlternative>
            }
        </>
    )
};

const Style = StyleSheet.create({
    box: {
        shadowColor: colors.alternativeWhite,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    }
});

const Container = styled.TouchableOpacity`
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    padding: 20px;
    border-radius: 10px;
    width: 95%;
    background-color: ${colors.whiteBackground};
    margin: 5px 0px;
    border: 1px solid ${colors.alternativeWhite};
`;

const ContainerAlternative = styled.TouchableOpacity`
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    padding: 20px;
    width: 100%;
    background-color: ${colors.whiteBackground};
    border: 1px solid ${colors.alternativeWhite};
`;

const TextLabel = styled.Text`
    color: ${colors.gray};
    font-size: 20px;
    font-family: ${fonts.sharonSansRegular};
`;

const TextPortion = styled.Text`
    color: ${colors.primaryColorGreen};
    font-size: 20px;
    font-family: ${fonts.sharonSansRegular};
`;

const Icon = styled(Feather)`
  color: ${colors.primaryColorGreen}
`;