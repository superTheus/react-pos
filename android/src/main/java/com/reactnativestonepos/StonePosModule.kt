package com.reactnativestonepos

import stone.utils.Stone
import stone.user.UserModel
import android.content.Context
import com.facebook.react.bridge.*
import com.paymentservice.controller.AbortController
import stone.application.StoneStart
import com.reactnativestonepos.executors.*
import com.reactnativestonepos.helpers.StoneTransactionHelpers

class StonePosModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  companion object {
    private const val TAG = "RNStonePos"
    private const val IS_RUNNING_IN_POS = "IS_RUNNING_IN_POS"

    var currentUserList: List<UserModel>? = null
    fun hasStoneCodeInList(stoneCode: String): Boolean {
      if (currentUserList?.findLast { it.stoneCode.equals(stoneCode) } != null) {
        return true
      }

      return false
    }

    fun updateUserList(reactContext: Context) {
      synchronized(this) {
        if (Stone.isInitialized()) {
          currentUserList = StoneStart.init(reactContext)
        }
      }
    }
  }

  override fun getName(): String {
    return "StonePos"
  }

  @ReactMethod
  fun addListener(@Suppress("UNUSED_PARAMETER") type: String?) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  @ReactMethod
  fun removeListeners(@Suppress("UNUSED_PARAMETER") type: Int?) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  override fun getConstants(): Map<String, Any>? {
    val constants: MutableMap<String, Any> = HashMap()

    constants[IS_RUNNING_IN_POS] = StoneTransactionHelpers.isRunningInPOS(reactApplicationContext)

    return constants
  }

  @ReactMethod
  fun initSDK(appName: String, promise: Promise) {
    try {
      synchronized(this) {
        currentUserList = StoneStart.init(reactApplicationContext)

        Stone.setAppName(appName)

        promise.resolve(true)
      }
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  /**
   * Activation and Deactivation Methods
   */
  @ReactMethod
  fun activateCode(
    stoneCode: String,
    dialogMessage: String?,
    dialogTitle: String?,
    useDefaultUI: Boolean,
    promise: Promise
  ) {
    try {
      ActivateDeactivateCode(reactApplicationContext, currentActivity).executeAction(
        isActivationAction = true,
        stoneCode,
        dialogMessage,
        dialogTitle,
        useDefaultUI,
        promise
      )
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun deactivateCode(
    stoneCode: String,
    dialogMessage: String?,
    dialogTitle: String?,
    useDefaultUI: Boolean,
    promise: Promise
  ) {
    try {
      ActivateDeactivateCode(reactApplicationContext, currentActivity).executeAction(
        isActivationAction = false,
        stoneCode,
        dialogMessage,
        dialogTitle,
        useDefaultUI,
        promise
      )
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun getActivatedCodes(promise: Promise) {
    try {
      ActivateDeactivateCode(reactApplicationContext, currentActivity).executeGetActivatedCodes(
        promise
      )
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  /**
   * Transactions fetching methods
   */

  @ReactMethod
  fun getAllTransactionsOrderByIdDesc(promise: Promise) {
    try {
      GetTransactions(reactApplicationContext, currentActivity).executeActionOrderByIdDesc(promise)
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun abortTransaction(promise: Promise) {
    try {
      AbortController(reactApplicationContext, currentActivity).abort(reactApplicationContext, promise)
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun getLastTransaction(promise: Promise) {
    try {
      GetTransactions(reactApplicationContext, currentActivity).executeActionGetLastTransaction(
        promise
      )
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun getAllTransaction(promise: Promise) {
    try {
      GetTransactions(reactApplicationContext, currentActivity).executeActionOrderByIdDesc(
        promise
      )
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun findTransactionWithAuthorizationCode(authorizationCode: String, promise: Promise) {
    try {
      GetTransactions(
        reactApplicationContext,
        currentActivity
      ).executeFindTransactionWithAuthorizationCode(authorizationCode, promise)
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun findTransactionWithInitiatorTransactionKey(
    initiatorTransactionKey: String,
    promise: Promise
  ) {
    try {
      GetTransactions(
        reactApplicationContext,
        currentActivity
      ).executeFindTransactionWithInitiatorTransactionKey(initiatorTransactionKey, promise)
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun findTransactionWithId(transactionId: Int, promise: Promise) {
    try {
      GetTransactions(reactApplicationContext, currentActivity).executeFindTransactionWithId(
        transactionId,
        promise
      )
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  /**
   * Transaction Executors
   */

  @ReactMethod
  fun reversePendingTransactions(
    dialogMessage: String?,
    dialogTitle: String?,
    useDefaultUI: Boolean,
    progressCallbackEventName: String,
    promise: Promise
  ) {
    try {
      ReversePendingTransactions(reactApplicationContext, currentActivity).executeAction(
        dialogMessage,
        dialogTitle,
        useDefaultUI,
        progressCallbackEventName,
        promise
      )
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun voidTransaction(
    transactionAtk: String,
    dialogMessage: String?,
    dialogTitle: String?,
    useDefaultUI: Boolean,
    progressCallbackEventName: String,
    promise: Promise
  ) {
    try {
      VoidTransaction(reactApplicationContext, currentActivity).executeAction(
        transactionAtk,
        dialogMessage,
        dialogTitle,
        useDefaultUI,
        progressCallbackEventName,
        promise
      )
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun captureTransaction(
    transactionAtk: String,
    dialogMessage: String?,
    dialogTitle: String?,
    useDefaultUI: Boolean,
    progressCallbackEventName: String,
    promise: Promise
  ) {
    try {
      CaptureTransaction(reactApplicationContext, currentActivity).executeAction(
        transactionAtk,
        dialogMessage,
        dialogTitle,
        useDefaultUI,
        progressCallbackEventName,
        promise
      )
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun makeTransaction(
    transactionSetup: ReadableMap,
    progressCallbackEventName: String,
    promise: Promise
  ) {
    try {
      MakeTransaction(reactApplicationContext, currentActivity).executeAction(
        transactionSetup,
        progressCallbackEventName,
        promise
      )
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun sendTransactionReceiptMail(
    transactionAtk: String,
    receiptType: String,
    toContact: ReadableArray,
    fromContact: ReadableMap,
    dialogMessage: String?,
    dialogTitle: String?,
    useDefaultUI: Boolean,
    progressCallbackEventName: String,
    promise: Promise
  ) {
    try {
      SendTransactionReceiptMail(reactApplicationContext, currentActivity).executeAction(
        transactionAtk,
        receiptType,
        toContact,
        fromContact,
        dialogMessage,
        dialogTitle,
        useDefaultUI,
        progressCallbackEventName,
        promise
      )
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun fetchTransactionsForCard(
    pinpadMacAddress: String?,
    dialogMessage: String?,
    dialogTitle: String?,
    useDefaultUI: Boolean,
    progressCallbackEventName: String,
    promise: Promise
  ) {
    try {
      FetchTransactionsForCard(reactApplicationContext, currentActivity).executeAction(
        pinpadMacAddress,
        dialogMessage,
        dialogTitle,
        useDefaultUI,
        progressCallbackEventName,
        promise
      )
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  /**
   * Pinpad Methods
   */

  @ReactMethod
  fun displayMessageInPinPad(
    pinpadMessage: String,
    pinpadMacAddress: String?,
    dialogMessage: String?,
    dialogTitle: String?,
    useDefaultUI: Boolean,
    progressCallbackEventName: String,
    promise: Promise
  ) {
    try {
      DisplayMessageInPinPad(reactApplicationContext, currentActivity).executeAction(
        pinpadMessage,
        pinpadMacAddress,
        dialogMessage,
        dialogTitle,
        useDefaultUI,
        progressCallbackEventName,
        promise
      )
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun connectToPinPad(
    pinpadName: String,
    pinpadMacAddress: String,
    dialogMessage: String?,
    dialogTitle: String?,
    useDefaultUI: Boolean,
    progressCallbackEventName: String,
    promise: Promise
  ) {
    try {
      ConnectToPinPad(reactApplicationContext, currentActivity).executeAction(
        pinpadName,
        pinpadMacAddress,
        dialogMessage,
        dialogTitle,
        useDefaultUI,
        progressCallbackEventName,
        promise
      )
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  /**
   * Print methods
   */
  @ReactMethod
  fun printReceiptInPOSPrinter(
    receiptType: String,
    transactionAtk: String,
    isReprint: Boolean,
    dialogMessage: String?,
    dialogTitle: String?,
    useDefaultUI: Boolean,
    progressCallbackEventName: String,
    promise: Promise
  ) {
    try {
      PrintReceiptInPOSPrinter(reactApplicationContext, currentActivity).executeAction(
        receiptType,
        transactionAtk,
        isReprint,
        dialogMessage,
        dialogTitle,
        useDefaultUI,
        progressCallbackEventName,
        promise
      )
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun printReceiptInPOSPrinterReactive(
    receiptType: String,
    transactionAtk: String,
    transactionAmount: String,
    isReprint: Boolean,
    dialogMessage: String?,
    dialogTitle: String?,
    useDefaultUI: Boolean,
    progressCallbackEventName: String,
    promise: Promise
  ) {
    try {
      PrintReceiptInPOSPrinterReactive(reactApplicationContext, currentActivity).executeAction(
        receiptType,
        transactionAtk,
        transactionAmount,
        isReprint,
        dialogMessage,
        dialogTitle,
        useDefaultUI,
        progressCallbackEventName,
        promise
      )
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun getPOS(
    promise: Promise
  ) {
    try {
      GetPOS(reactApplicationContext, currentActivity).executeAction(promise)
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun printHTMLInPOSPrinter(
    htmlContent: String,
    dialogMessage: String?,
    dialogTitle: String?,
    useDefaultUI: Boolean,
    progressCallbackEventName: String,
    promise: Promise
  ) {
    try {
      PrintHtmlInPOSPrinter(reactApplicationContext, currentActivity).executeAction(
        htmlContent,
        dialogMessage,
        dialogTitle,
        useDefaultUI,
        progressCallbackEventName,
        promise
      )
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun deactivateButtons(promise: Promise) {
    try {
      ScreenModel(reactApplicationContext).setStatusBarDropDownMode(1, promise);
      ScreenModel(reactApplicationContext).setNavigationBarVisibility(1, promise);
      ScreenModel(reactApplicationContext).setHideNavigationBarItemsRecent(promise);
    }catch (e: Exception) {
      promise.reject(e);
    }
  }
}
