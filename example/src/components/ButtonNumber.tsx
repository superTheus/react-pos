import React from "react";
import styled from "styled-components/native";

import colors from "../utils/colors";

import StoneLogoIcon from "../assets/images/original/ic_stone_logo_antigo.png"

type ButtonNumberProsps = {
    text?: string,
    alternative?: boolean,
    action: () => void,
    calcBtn?: boolean;
    active?: boolean;
}

type StylesProps = {
    alternative?: boolean,
    calcBtn?: boolean,
    active?: boolean;
}

export default function ButtonNumberComponent({text, alternative, action, calcBtn}: ButtonNumberProsps) {

    return (
        <>
            {alternative ?
                <ButtonNumber onPress={action} alternative={true} >
                    <ImageIcon source={StoneLogoIcon} />
                </ButtonNumber>
            : 
            <ButtonNumber onPress={action} calcBtn={calcBtn}>
                <TextButton> {text} </TextButton>
            </ButtonNumber>
            }
        </>
    );
}

const ButtonNumber = styled.TouchableOpacity<StylesProps>`
    width: 70px;
    height: 70px;
    ${
        (props: StylesProps) => !props.calcBtn && `
            border: 1px;
            border-radius: 70px;
            border-color: #E8E8E8;
        `
    };
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0px;
    ${(props: StylesProps) => props.alternative ? `background-color: ${colors.primaryColorGreen}` : ''};
`;

const TextButton = styled.Text`
    color: #6B6973;
    font-size: 24px;
    font-weight: 200;
    font-family: sans-serif;
`;

const ImageIcon = styled.Image`
    width: 30px;
    height: 25px;
`;