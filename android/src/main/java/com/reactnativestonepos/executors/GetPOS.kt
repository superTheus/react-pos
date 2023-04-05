package com.reactnativestonepos.executors

import android.app.Activity
import com.facebook.react.bridge.Promise
import com.reactnativestonepos.StonePosModule
import com.reactnativestonepos.helpers.CodedException
import com.facebook.react.bridge.ReactApplicationContext
import com.reactnativestonepos.helpers.ConversionHelpers
import com.reactnativestonepos.helpers.StoneTransactionHelpers
import stone.utils.Stone

class GetPOS(
  reactApplicationContext: ReactApplicationContext,
  currentActivity: Activity?
) : BaseExecutor(reactApplicationContext, currentActivity) {
  fun executeAction(
    promise: Promise
  ) {
    checkSDKInitializedAndHandleExceptions(promise) {
      if (!StoneTransactionHelpers.isRunningInPOS(reactApplicationContext)) {
        throw CodedException("101", "You can only run this in a POS")
      }

      if (StonePosModule.currentUserList.isNullOrEmpty()) {
        throw CodedException("401", "You need to activate the terminal first")
      }
      promise.resolve(Stone.getPosAndroidDevice().getPosAndroidSerialNumber())
    }
  }
}
