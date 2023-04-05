import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import colors from "../utils/colors";

export default function LoadComponent() {
    return (
        <Container>
            <ActivityIndicator size="large" color={colors.primaryColorGreen} />
        </Container>
    )
};

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;