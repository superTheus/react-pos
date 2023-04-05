import React from "react";
import Feather from "react-native-vector-icons/Feather";

import styled from "styled-components/native";
import colors from "../utils/colors";
import fonts from "../utils/fonts";

interface HeaderProps {
    text: string;
    option: () => void;
    children?: React.ReactNode;
    border?: boolean
}

type StyleProps = {
    border?: boolean
}

export default function HeaderComponent({ text, option, border }: HeaderProps) {

    return (
        <Container border={border}>
            <ButtonBack activeOpacity={0.6} onPress={option}>
                <BackIcon name="arrow-left" size={30} />
            </ButtonBack>
            <TitleView>
                <TextTitle>
                    {text}
                </TextTitle>
            </TitleView>
        </Container>
    );
}

const Container = styled.SafeAreaView<StyleProps>`
    padding: 20px;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 70px;
    background-color: ${colors.whiteBackground};
    ${props => props.border ? 'border-bottom-width: 1px' : ''};
    ${props => props.border ? `border-color: ${colors.alternativeWhite}` : ''};
`;

const ButtonBack = styled.TouchableOpacity`
    width: 10%;
    height: 50px;
`;

const TitleView = styled.View`
    width: 90%;
    height: 50px;
    align-items: center;
`;

const BackIcon = styled(Feather)`
    color: ${colors.primaryColorGreen};
`;

const TextTitle = styled.Text`
    font-size: 20px;
    font-family: ${fonts.sharonSansRegular};
    margin-right: 10%;
`;