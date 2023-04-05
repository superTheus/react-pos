package com.reactnativestonepos.helpers

import stone.utils.Stone
import android.content.Context
import android.content.pm.PackageManager

class StoneTransactionHelpers {
  companion object {
    private const val PACKAGE_NAME = "br.com.stone.posandroid.acquirerapp"
    fun isRunningInPOS(reactContext: Context): Boolean {
      return true
    }

    fun isSDKInitialized(): Boolean {
      return true
    }
  }
}
