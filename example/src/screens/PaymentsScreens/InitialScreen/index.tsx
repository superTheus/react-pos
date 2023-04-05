import React, { useState, useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { useNavigation } from '@react-navigation/core';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { StackParamList } from "../../../routes/types";
import HeaderComponent from "../../../components/header";
import ButtonNumberComponent from "../../../components/ButtonNumber";
import {
    Container,
    DeleteView,
    IconDelete,
    LabelValue,
    LabelValueView,
    MoneyText,
    ValueMoneyText,
    ValueMoneyView,
    ValuesArea,
    ValueView,
    ViewsCalc,
    ViewsNumbers,
    ViewsNumbersWhite
} from "./styles";
import { saveValuePay } from "../../../utils/storages";
import { format, formatValue } from "../../../utils/utils";

type navigateProps = NativeStackNavigationProp<StackParamList, 'MainScreen'>;

export default function InitialScreenPayment() {
    const Navigation = useNavigation<navigateProps>();

    const [valueMoneyText, setValueMoneyText] = useState('0,00');
    const [valueMoney, setValueMoney] = useState(0);
    const [valueMoneySum, setValueMoneySum] = useState(0);

    const [thisCalc, setThisCalc] = useState(false);
    const [operationType, setOperationType] = useState<"sum" | "mult" | "division" | "subtraction">("sum");

    function formatTextView(value: number, twoZero?: boolean) {
        if (thisCalc) {
            updateValueCalc(value);
        } else {
            updateValue(value, valueMoney, twoZero);
        }
    }

    function updateValue(value: number, valueInUse: number, twoZero?: boolean) {
        let newValue = "";
        
        if ((valueInUse === 0)) {
            newValue = "0.0" + value;
        } else if (valueInUse > 0 && valueInUse < 1) {
            if (twoZero) {
                newValue = (String(valueInUse).replace(".", "") + "00").substring(1);
            } else {
                newValue = (valueInUse.toFixed(2).replace(".", "") + value).substring(1);
            }
        } else {
            if (twoZero) {
                newValue = (String(valueInUse.toFixed(2)).replace(".", "") + "00")
            } else {
                newValue = (String(valueInUse.toFixed(2)).replace(".", "") + value);
            }
        }
        setValueMoney(formatValue(valueInUse, newValue, twoZero ? true : false));
    }

    function updateValueCalc(value: number) {
        let newValue = String(valueMoneySum) + value;
        setValueMoneySum(Number(newValue));
        formatTextCalc(Number(newValue));
    }

    function formatTextCalc(value: number) {
        if (String(value).length <= 2) {
            setValueMoneyText(`${format(valueMoney)} ${getSinalisation(operationType)} ${value}`);
        } else {
            setValueMoneyText(`${format(valueMoney)} ${getSinalisation(operationType)} ${format(formatValue(valueMoneySum, String(value), false))}`);
        }
    }

    function deleteValue() {
        if (thisCalc) {
            let newValue = Number(String(valueMoneySum).slice(0, -1));
            setValueMoneySum(newValue);
            if (newValue === 0) {
                setThisCalc(false);
            } else {
                formatTextCalc(newValue);
            }
        } else {
            if (String(valueMoney.toFixed(2)).replace('.', '').length <= 3) {
                let newValue = "0" + String(valueMoney.toFixed(2)).replace('.', '').slice(0, -1);
                setValueMoney(formatValue(valueMoney, newValue, false));
            } else {
                let newValue = String(valueMoney.toFixed(2)).replace('.', '').slice(0, -1);
                setValueMoney(formatValue(valueMoney, newValue, false));
            }
        }
    }

    function initCalc(type: "sum" | "mult" | "division" | "subtraction") {
        if (!thisCalc) {
            setThisCalc(true);
            setOperationType(type);
            setValueMoneyText(`${format(valueMoney)} ${getSinalisation(type)} `);
        }
    }

    function getSinalisation(type: "sum" | "mult" | "division" | "subtraction"): string {
        if (type === "sum") {
            return "+"
        }

        if (type === "subtraction") {
            return "-"
        }

        if (type === "mult") {
            return "*"
        }

        if (type === "division") {
            return "/"
        }

        return "+"
    }

    async function saveValuePayStorage() {
        let valuePay = valueMoney;
        if (thisCalc) {
            valuePay = resultCalc();
        }
        const savepay = await saveValuePay(valuePay);
        if (savepay) {
            Navigation.navigate('PaymentForms')
        }
    }

    function resultCalc() {
        let newValue = 0
        let valueCalc = String(valueMoneySum).length > 2 ? formatValue(valueMoneySum, String(valueMoneySum), false) : valueMoneySum;
        if(operationType === "sum") {
            newValue = valueMoney + valueCalc;
        }
        if(operationType === "subtraction") {
            newValue = valueMoney - valueCalc;
        }
        if(operationType === "mult") {
            newValue = valueMoney * valueCalc;
        }
        if(operationType === "division") {
            newValue = valueMoney / valueCalc;
        }
        setThisCalc(false);
        setValueMoneySum(0);
        setValueMoney(newValue);

        return newValue;
    }

    return (
        <Container>
            <HeaderComponent text="VALOR" option={() => Navigation.goBack()}> </HeaderComponent>
            <ValuesArea>
                <LabelValueView>
                    <LabelValue> Valor </LabelValue>
                </LabelValueView>
                <ValueView>
                    <ValueMoneyView>
                        <MoneyText> R$ </MoneyText>
                        {
                            thisCalc ?
                                <MoneyText> {valueMoneyText} </MoneyText>
                                :
                                <ValueMoneyText> {format(valueMoney)} </ValueMoneyText>
                        }
                    </ValueMoneyView>
                    <DeleteView>
                        <TouchableOpacity onPress={deleteValue} activeOpacity={0.6}>
                            <IconDelete name="delete" />
                        </TouchableOpacity>
                    </DeleteView>
                </ValueView>
            </ValuesArea>
            <ViewsNumbers>
                <ViewsNumbersWhite>
                    <ButtonNumberComponent action={() => formatTextView(1)} text="1" />
                    <ButtonNumberComponent action={() => formatTextView(2)} text="2" />
                    <ButtonNumberComponent action={() => formatTextView(3)} text="3" />

                    <ButtonNumberComponent action={() => formatTextView(4)} text="4" />
                    <ButtonNumberComponent action={() => formatTextView(5)} text="5" />
                    <ButtonNumberComponent action={() => formatTextView(6)} text="6" />

                    <ButtonNumberComponent action={() => formatTextView(7)} text="7" />
                    <ButtonNumberComponent action={() => formatTextView(8)} text="8" />
                    <ButtonNumberComponent action={() => formatTextView(9)} text="9" />

                    <ButtonNumberComponent action={() => formatTextView(0, true)} text="00" />
                    <ButtonNumberComponent action={() => formatTextView(0)} text="0" />
                    <ButtonNumberComponent action={() => saveValuePayStorage()} alternative={true} />
                </ViewsNumbersWhite>
                <ViewsCalc>
                    <ButtonNumberComponent action={() => initCalc("sum")} text="+" calcBtn={true} />
                    <ButtonNumberComponent action={() => initCalc("subtraction")} text="-" calcBtn={true} />
                    <ButtonNumberComponent action={() => initCalc("division")} text="÷" calcBtn={true} />
                    <ButtonNumberComponent action={() => initCalc("mult")} text="x" calcBtn={true} />
                    <ButtonNumberComponent action={() => resultCalc()} text="=" calcBtn={true} />
                </ViewsCalc>
            </ViewsNumbers>
        </Container >
    );
}