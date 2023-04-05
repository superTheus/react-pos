package com.paymentservice.controller

import android.app.Activity
import android.widget.Toast
import br.com.stone.posandroid.providers.PosTransactionProvider
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.reactnativestonepos.executors.BaseExecutor
import stone.application.interfaces.StoneCallbackInterface
import stone.database.transaction.TransactionObject
import stone.providers.BaseTransactionProvider
import stone.utils.Stone


class AbortController(context: ReactApplicationContext,
                      currentActivity: Activity?
): BaseExecutor(context, currentActivity)  {

  private val transactionProvider: BaseTransactionProvider? = null
  protected val transactionObject = TransactionObject()

  fun abort(context: ReactApplicationContext, promise: Promise) {

    val transaction = TransactionObject()
    val provider = PosTransactionProvider(context, transaction, Stone.getUserModel(0))

    provider.connectionCallback = object : StoneCallbackInterface {
      override fun onSuccess() {
        Toast.makeText(context, "Cancelado", Toast.LENGTH_SHORT).show()
        promise.resolve("Cancelado");
      }

      override fun onError() {
        Toast.makeText(context, "Erro ao cancelar: "
          + provider.listOfErrors, Toast.LENGTH_SHORT).show()
        promise.resolve("Erro ao Cancelar");
      }
    }

    provider.abortPayment();
    transactionProvider?.abortPayment();
  }
}
