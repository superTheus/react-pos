package com.reactnativestonepos.executors

import android.app.Activity
import stone.application.enums.Action
import stone.providers.ReversalProvider
import com.facebook.react.bridge.Promise
import com.reactnativestonepos.StonePosModule
import com.reactnativestonepos.helpers.writableMapOf
import com.reactnativestonepos.helpers.CodedException
import stone.application.interfaces.StoneActionCallback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule

class ReversePendingTransactions(
  reactApplicationContext: ReactApplicationContext,
  currentActivity: Activity?
) : BaseExecutor(reactApplicationContext, currentActivity) {
  fun executeAction(
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

      val transactionProvider = ReversalProvider(
        if (useDefaultUI) {
          currentActivity!!
        } else {
          reactApplicationContext
        }
      )

      transactionProvider.useDefaultUI(useDefaultUI)
      transactionProvider.dialogMessage = if (dialogMessage.isNullOrEmpty()) {
        "Cancelando transações com erro"
      } else {
        dialogMessage
      }

      transactionProvider.dialogTitle = if (dialogTitle.isNullOrEmpty()) {
        "Cancelando..."
      } else {
        dialogTitle
      }

      transactionProvider.connectionCallback = object : StoneActionCallback {
        override fun onSuccess() {
          promise.resolve(true)
        }

        override fun onError() {
          promise.reject("405", "Transaction Failed")
        }

        override fun onStatusChanged(action: Action?) {
          reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(
              progressCallbackEventName, writableMapOf(
                "initiatorTransactionKey" to null,
                "status" to action?.name
              )
            )
        }
      }

      transactionProvider.execute()
    }
  }
}
