import * as React from 'react';
import DeviceInfo from 'react-native-device-info';
import AlertPrompt from 'react-native-prompt-android';
import type { TransactionType } from '../../../src/types';
import * as StonePOS from 'react-native-stone-pos';
import packageJson from '../../package.json';
import { Alert } from 'react-native';
import type { ReturnPOSType } from '../utils/types';

type TestTransactionData = {
  [key: string]: TransactionType | null;
};


export default class StonneService {
  // sendPrintSimple(text: string) {
  //   stonneService.handlePrintSimple(text);
  // }

  // sendPrintMultline(text: string[]) {
  //   stonneService.handlePrintMultiline(text);
  // }

  // sendValidateCard() {
  //   stonneService.handleValidateCard();
  // }

  // sendTransaction(handlerMessageStatus: (message: string) => void, TransactionInfo: TransactionInterface) {
  //   stonneService.handleTransaction(TransactionInfo.capture, TransactionInfo.portion, TransactionInfo.typePayment, TransactionInfo.value, (message: string) => {
  //     handlerMessageStatus(message);
  //   });
  // }

  // activateStoneCode(stoneCode: string) {
  //   stonneService.handleStoneCode(stoneCode);
  // }

  // deviceInfoTest = async () => {
  //   Alert.alert(
  //     'Info',
  //     `Version Name: ${DeviceInfo.getVersion()}\nPackage Name: ${DeviceInfo.getBundleId()}\nIs Running in POS: ${
  //       StonePOS.IS_RUNNING_IN_POS
  //     }`
  //   );
  // };

  // wrongCodeActivationTest = async () => {
  //   try {
  //     const hasActivated = await StonePOS.activateCode(
  //       '111111111',
  //       'Testing wrong activation code',
  //       'Activating...',
  //       true
  //     );
  //     if (hasActivated) {
  //       Alert.alert(
  //         'Error',
  //         "Oops, something went wrong, this code wasn't supposed to be activateable"
  //       );
  //     } else {
  //       Alert.alert('Success', 'Your test passed, no code activated');
  //     }
  //   } catch (e) {
  //     Alert.alert(
  //       'Success',
  //       `Your test passed, no code activated: ${JSON.stringify(e)}`
  //     );
  //   }
  // };

  approvedCodeActivationTest = async (stoneCode: string): Promise<ReturnPOSType> => {
    try {
      const hasActivated = await StonePOS.activateCode(
        stoneCode,
        'Iniciando ativação Stone Code',
        'Ativando',
        true
      );
      if (hasActivated) {
        return {
          type: "Success",
          message: "Stone code Ativado"
        }
      } else {
        return {
          type: "Error",
          message: "Erro ao ativar Stone code"
        }
      }
    } catch (e) {
      return {
        type: "Error",
        message: `Erro ao ativar Stone code\n Erro: ${JSON.stringify(e)}`
      }
    }
  };

  getActivatedCodesInfos = async (): Promise<ReturnPOSType> => {
    try {
      const activatedCodes = await StonePOS.getActivatedCodes();
      return {
        type: "Success",
        message: "Informações do Stone Code ativado",
        data: activatedCodes
      }
    } catch (e) {
      return {
        type: "Error",
        message: "Informações do Stone Code ativado"
      }
    }
  };

  // oneInstallmentCreditDeniedTest = async () => {
  //   try {
  //     const transactionStatus = await StonePOS.makeTransaction({
  //       installmentCount: 1,
  //       installmentHasInterest: false,
  //       typeOfTransaction: 'CREDIT',
  //       amountInCents: '51',
  //       shortName: 'TST_004',
  //       capture: true,
  //       useDefaultUI: true,
  //     });

  //     if (transactionStatus.transactionStatus == 'DECLINED') {
  //       Alert.alert(
  //         'Success',
  //         `Your test passed\nTransaction Date: ${transactionStatus.date}\nTransaction ATK: ${transactionStatus.acquirerTransactionKey}\nMessage From Authorizer: ${transactionStatus.messageFromAuthorizer}`
  //       );
  //     } else {
  //       Alert.alert(
  //         'Error',
  //         `Your test failed: ${transactionStatus.transactionStatus}`
  //       );
  //     }
  //   } catch (e) {
  //     Alert.alert('Error', `Your test failed: ${JSON.stringify(e)}`);
  //   }
  // };

  // wrongPasswordCreditTest = async () => {
  //   try {
  //     const transactionStatus = await StonePOS.makeTransaction({
  //       installmentCount: 1,
  //       installmentHasInterest: false,
  //       typeOfTransaction: 'CREDIT',
  //       amountInCents: '55',
  //       shortName: 'TST_006',
  //       capture: true,
  //       useDefaultUI: true,
  //     });

  //     if (transactionStatus.transactionStatus == 'DECLINED') {
  //       Alert.alert(
  //         'Success',
  //         `Your test passed\nTransaction Date: ${transactionStatus.date}\nTransaction ATK: ${transactionStatus.acquirerTransactionKey}\nMessage From Authorizer: ${transactionStatus.messageFromAuthorizer}`
  //       );
  //     } else {
  //       Alert.alert(
  //         'Error',
  //         `Your test failed: ${transactionStatus.transactionStatus}`
  //       );
  //     }
  //   } catch (e) {
  //     Alert.alert('Error', `Your test failed: ${JSON.stringify(e)}`);
  //   }
  // };

  payServiceCreditDebit = async (
    amountInCents: String,
    typeOfTransaction = 'CREDIT',
    shortName: String = 'TST_007',
    installmentCount: Number = 1,
    installmentHasInterest: Boolean = false
  ): Promise<TransactionType> => {

    const transactionStatus: TransactionType = await StonePOS.makeTransaction({
      installmentCount,
      installmentHasInterest,
      typeOfTransaction: typeOfTransaction as any,
      amountInCents,
      shortName,
      capture: true,
      useDefaultUI: true,
    });

    return transactionStatus;
  };

  abort = async (): Promise<any> => {
    const transactionStatus: any = await StonePOS.abortTransaction();
    return transactionStatus;
  };

  printReceiot = async (transactionStatus: any, type: 'MERCHANT' | 'CLIENT', message: string) => {
    await StonePOS.printReceiptInPOSPrinter(
      type,
      transactionStatus.acquirerTransactionKey!,
      false,
      message
    )
  }

  // voidTransactionFromTest = async (testId: string) => {
  //   if (testTransactionData[testId]?.acquirerTransactionKey) {
  //     try {
  //       const transactionStatus = await StonePOS.voidTransaction(
  //         testTransactionData[testId]?.acquirerTransactionKey!
  //       );

  //       if (transactionStatus.transactionStatus == 'CANCELLED') {
  //         Alert.alert(
  //           'Success',
  //           `Your test passed\nTransaction Date: ${transactionStatus.date}\nTransaction ATK: ${transactionStatus.acquirerTransactionKey}\nMessage From Authorizer: ${transactionStatus.messageFromAuthorizer}`
  //         );

  //         setTestTransactionData({
  //           ...testTransactionData,
  //           [testId]: null,
  //         });
  //       } else {
  //         Alert.alert(
  //           'Error',
  //           `Your test failed: ${transactionStatus.transactionStatus}`
  //         );
  //       }
  //     } catch (e) {
  //       Alert.alert('Error', `Your test failed: ${JSON.stringify(e)}`);
  //     }
  //   } else {
  //     Alert.alert('Error', 'Your test failed: No previous transaction found');
  //   }
  // };

  lastTransactionDataTest = async (): Promise<ReturnPOSType> => {
    try {
      const transactionStatus = await StonePOS.getLastTransaction();

      if (transactionStatus) {
        return {
          type: "Success",
          message: "Informações da Transações",
          data: transactionStatus
        }
      } else {
        return {
          type: "Error",
          message: "Erro ao Capturar Transações",
        }
      }
    } catch (e) {
      return {
        type: "Error",
        message: "Não foi possível retornar as transações",
      }
    }
  };

  allTransactionData = async (): Promise<ReturnPOSType> => {
    try {
      const transactionStatus = await StonePOS.getAllTransaction();
      if (transactionStatus) {
        return {
          type: "Success",
          message: "Informações da Transações",
          data: transactionStatus
        }
      } else {
        return {
          type: "Error",
          message: "Erro ao Capturar Transações",
        }
      }
    } catch (e) {
      return {
        type: "Error",
        message: "Não foi possível retornar as transações",
      }
    }
  };

  // htmlPrintTest = async () => {
  //   try {
  //     var htmlMapped: String[] = Array(2)
  //       .fill(0)
  //       .map((_, index) => {
  //         return `<p>Hello world, this is a HTML print ${index}</p><b>Hello in bold</b><center>Hello in center</center>`;
  //       });

  //     const transactionStatus = await StonePOS.printHTMLInPOSPrinter(
  //       `<html><head><style type='text/css'>body { font-size: 22pt; }</style></head><body>${htmlMapped.join(
  //         '\n'
  //       )}</body>`
  //     );

  //     if (transactionStatus) {
  //       Alert.alert(
  //         'Success',
  //         `Your test passed\nTransaction Data: ${JSON.stringify(
  //           transactionStatus
  //         )}`
  //       );
  //     } else {
  //       Alert.alert('Error', `Your test failed, no transaction data`);
  //     }
  //   } catch (e) {
  //     Alert.alert(
  //       'Error',
  //       `Your test failed, no transaction data: ${JSON.stringify(e)}`
  //     );
  //   }
  // };

  sdkInitialize = async (): Promise<ReturnPOSType> => {
    try {
      const sdkInitializeResult = await StonePOS.initSDK(packageJson.name);

      if (sdkInitializeResult) {
        return {
          type: "Success",
          message: "Aplicativo Inicializado",
          data: sdkInitializeResult
        }
      } else {
        return {
          type: "Error",
          message: "Falha ao iniciar o aplicativo"
        }
      }
    } catch (e) {
      return {
        type: "Error",
        message: `Falha ao iniciar o aplicativo, \n Error: ${JSON.stringify(e)}`
      }
    }
  };

  deactivateHardware = async (): Promise<ReturnPOSType> => {
    try {
      const stoneHardware = await StonePOS.deactivateButtons();
      if (stoneHardware) {
        return {
          type: "Success",
          message: "Hardware Clear",
          data: stoneHardware
        }
      } else {
        return {
          type: "Error",
          message: "Hardware Not Clear"
        }
      }
    } catch (e) {
      return {
        type: "Error",
        message: "Hardware Not Clear",
        data: e
      }
    }
  }
}