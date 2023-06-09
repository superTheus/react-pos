package com.reactnativestonepos.executors

import stone.utils.Stone
import android.app.Activity
import stone.utils.PinpadObject
import stone.application.enums.Action
import com.reactnativestonepos.helpers.*
import com.facebook.react.bridge.Promise
import com.reactnativestonepos.StonePosModule
import stone.application.interfaces.StoneActionCallback
import com.facebook.react.bridge.ReactApplicationContext
import stone.providers.ValidateTransactionByCardProvider
import com.facebook.react.modules.core.DeviceEventManagerModule
import br.com.stone.posandroid.providers.PosValidateTransactionByCardProvider

class FetchTransactionsForCard(
  reactApplicationContext: ReactApplicationContext,
  currentActivity: Activity?
) : BaseExecutor(reactApplicationContext, currentActivity) {
  fun executeAction(
    pinpadMacAddress: String?,
    dialogMessage: String?,
    dialogTitle: String?,
    useDefaultUI: Boolean,
    progressCallbackEventName: String,
    promise: Promise
  ) {
    try {
      if (StoneTransactionHelpers.isSDKInitialized()) {
        if (StonePosModule.currentUserList.isNullOrEmpty()) {
          throw CodedException("401", "You need to activate the terminal first")
        }

        if (StoneTransactionHelpers.isRunningInPOS(reactApplicationContext)) {
          throw CodedException(
            "402",
            "You are running in POS mode, there's no support for PinPad messages"
          )
        }

        val selectedPinPad: PinpadObject? =
          if (StoneTransactionHelpers.isRunningInPOS(reactApplicationContext)) {
            null
          } else {
            if (!pinpadMacAddress.isNullOrEmpty()) {
              Stone.getPinpadObjectList().findLast {
                it.macAddress == pinpadMacAddress
              } ?: throw CodedException("401", "Pinpad not found")
            } else {
              if (Stone.getPinpadListSize() > 0) {
                Stone.getPinpadFromListAt(0)
              } else {
                throw CodedException("401", "No pinpad connected")
              }
            }
          }

        val transactionProvider =
          if (StoneTransactionHelpers.isRunningInPOS(reactApplicationContext)) {
            PosValidateTransactionByCardProvider(
              if (useDefaultUI) {
                currentActivity!!
              } else {
                reactApplicationContext
              }
            )
          } else {
            ValidateTransactionByCardProvider(
              if (useDefaultUI) {
                currentActivity!!
              } else {
                reactApplicationContext
              }, selectedPinPad!!
            )
          }

        transactionProvider.useDefaultUI(useDefaultUI)
        transactionProvider.dialogMessage = if (dialogMessage.isNullOrEmpty()) {
          "Validando transação"
        } else {
          dialogMessage
        }
        transactionProvider.dialogTitle = if (dialogTitle.isNullOrEmpty()) {
          "Aguarde"
        } else {
          dialogTitle
        }

        transactionProvider.connectionCallback = object : StoneActionCallback {
          override fun onSuccess() {
            promise.resolve(
              writableArrayFrom(
                transactionProvider.transactionsWithCurrentCard.map {
                  ConversionHelpers.convertTransactionToWritableMap(it)
                }
              )
            )
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
    } catch (e: CodedException) {
      promise.reject(e.code, e.internalMessage)
    } catch (e: Exception) {
      promise.reject(e)
    }
  }
}
