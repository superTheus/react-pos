package com.reactnativestonepos.executors

import android.app.Activity
import stone.application.enums.Action
import com.facebook.react.bridge.Promise
import stone.providers.CancellationProvider
import com.reactnativestonepos.StonePosModule
import stone.database.transaction.TransactionDAO
import com.reactnativestonepos.helpers.writableMapOf
import com.reactnativestonepos.helpers.CodedException
import stone.application.interfaces.StoneActionCallback
import com.reactnativestonepos.helpers.ConversionHelpers
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule

class VoidTransaction(
  reactApplicationContext: ReactApplicationContext,
  currentActivity: Activity?
) : BaseExecutor(reactApplicationContext, currentActivity) {
  fun executeAction(
    transactionAtk: String,
    dialogMessage: String?,
    dialogTitle: String?,
    useDefaultUI: Boolean,
    progressCallbackEventName: String,
    promise: Promise
  ) {
    checkSDKInitializedAndHandleExceptions(promise) {
      if (StonePosModule.currentUserList.isNullOrEmpty()) {
        throw CodedException("401", "You need to activate the terminal first")
      }

      val transactionObject = TransactionDAO(reactApplicationContext).findTransactionWithAtk(transactionAtk)

      if (transactionObject != null) {
        val transactionProvider = CancellationProvider(
          if (useDefaultUI) {
            currentActivity!!
          } else {
            reactApplicationContext
          }, transactionObject
        )

        transactionProvider.useDefaultUI(useDefaultUI)

        transactionProvider.dialogMessage = if (!dialogMessage.isNullOrEmpty()) {
          dialogMessage
        } else {
          "Executando transação..."
        }

        transactionProvider.dialogTitle = if (!dialogTitle.isNullOrEmpty()) {
          dialogTitle
        } else {
          "Executando..."
        }

        transactionProvider.connectionCallback = object : StoneActionCallback {
          override fun onSuccess() {
            try {
              val trx =
                TransactionDAO(reactApplicationContext).findTransactionWithAtk(transactionObject.acquirerTransactionKey)
              if (trx != null) {
                promise.resolve(
                  ConversionHelpers.convertTransactionToWritableMap(
                    trx,
                    transactionProvider.messageFromAuthorize
                  )
                )
              } else {
                promise.resolve(null)
              }
            } catch (e: Exception) {
              promise.reject(e)
            }
          }

          override fun onError() {
            promise.reject("405", "Transaction Failed")
          }

          override fun onStatusChanged(action: Action?) {
            reactApplicationContext
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
              .emit(
                progressCallbackEventName, writableMapOf(
                  "initiatorTransactionKey" to transactionObject.initiatorTransactionKey,
                  "status" to action?.name
                )
              )
          }
        }

        transactionProvider.execute()
      } else {
        throw CodedException("402", "Transaction not found")
      }
    }
  }
}
