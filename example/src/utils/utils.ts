import { Switch } from "react-native";
import type { TrasactionsType } from "./types";

export const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2
})

export function formatValue(valueMoney: number, newValue: string, twoZero: boolean): number {
  let AUX = "0";
  if ((valueMoney === 0)) {
    AUX = newValue;
  } else if (valueMoney > 0 && valueMoney < 1 && !twoZero) {
    for (let index = 0; index < newValue.length; index++) {
      AUX = AUX + `${newValue[index]}`;
      if (index === 0) {
        AUX = AUX + '.';
      }
    }
  } else {
    let LastNumber = newValue[newValue.length - 1];
    let PenultimateNumber = newValue[newValue.length - 2];
    let Float = "." + PenultimateNumber + LastNumber;
    AUX = newValue.slice(0, -2) + Float
  }

  return parseFloat(AUX);
}

export function format(value: number) {
  return formatter.format(value).replace("R$", "");
}

export type statuTransaction = {
  tipo: string;
  mensagem: string;
}

export function getMsgReturn(transaction: TrasactionsType): statuTransaction {
  if(transaction.transactionStatus === "APPROVED"){
    return {
      tipo: "Aprovado",
      mensagem: "Transação aprovada com sucesso"
    }
  }

  if(transaction.transactionStatus === "CANCELLED"){
    return {
      tipo: "Cancelado",
      mensagem: "Transação cancelada"
    }
  }

  if(transaction.transactionStatus === "DECLINED"){
    return {
      tipo: "Recusado",
      mensagem: "Transação negada"
    }
  }

  if(transaction.transactionStatus === "DECLINED_BY_CARD"){
    return {
      tipo: "Recusado",
      mensagem: "Transação negada pelo cartão"
    }
  }

  if(transaction.transactionStatus === "PARTIAL_APPROVED"){
    return {
      tipo: "Aprovada Parcialmente",
      mensagem: "Transação foi parcialmente aprovada"
    }
  }

  if(transaction.transactionStatus === "PENDING"){
    return {
      tipo: "Pendente",
      mensagem: "O provider de transação está em andamento"
    }
  }
  
  if(transaction.transactionStatus === "PENDING_REVERSAL"){
    return {
      tipo: "Pendente",
      mensagem: "Transação foi interrompida por algum motivo e será revertida pelo provider de reversão"
    }
  }

  if(transaction.transactionStatus === "REJECTED"){
    return {
      tipo: "Rejeitado",
      mensagem: "Transação rejeitada"
    }
  }

  if(transaction.transactionStatus === "REVERSED"){
    return {
      tipo: "Cancelado",
      mensagem: "A transação foi cancelada automaticamente devido à algum erro ou interrupção no fluxo de pagamento"
    }
  }

  if(transaction.transactionStatus === "TECHNICAL_ERROR"){
    return {
      tipo: "Erro técnico",
      mensagem: "A transação foi cancelada automaticamente devido à algum erro ou interrupção no fluxo de pagamento"
    }
  }

  if(transaction.transactionStatus === "UNKNOWN"){
    return {
      tipo: "Status Desconhecido",
      mensagem: "Ocorreu um erro antes de ser enviada para o autorizador"
    }
  }

  if(transaction.transactionStatus === "WITH_ERROR"){
    return {
      tipo: "Com Erro",
      mensagem: "Transação não completada com sucesso. O Provedor de Reversão irá desfazer as transações com este status"
    }
  }

  return {
    tipo: "Sem Status",
    mensagem: "Transação Sem Status"
  }
}