package com.reactnativestonepos.executors

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.sunmi.pay.hardware.aidlv2.AidlConstantsV2
import com.sunmi.pay.hardware.aidlv2.system.BasicOptV2

class ScreenModel(reactApplicationContext: ReactApplicationContext) {

  val context = reactApplicationContext;

  private val hardwareApplication: HardwareApplication = HardwareApplication(context);
  private val basicOptV2: BasicOptV2? = hardwareApplication.basicOptV2;

  fun setStatusBarDropDownMode(key: Int, promise: Promise) {
    val DISABLE_STATUS_BAR_DROP_DOWN = key
    try {
      basicOptV2!!.setStatusBarDropDownMode(DISABLE_STATUS_BAR_DROP_DOWN);
      promise.resolve("Success");
    } catch (e: Exception) {
      promise.resolve(e.printStackTrace());
    }
  }

  fun setNavigationBarVisibility(key: Int, promise: Promise) {
    val HIDE_NAV_BAR = key
    try {
      basicOptV2!!.setNavigationBarVisibility(HIDE_NAV_BAR)
      promise.resolve("Success");
    } catch (e: Exception) {
      promise.resolve(e.printStackTrace());
    }
  }

  fun setHideNavigationBarItemsRecent(promise: Promise) {
    val HIDE_NAV_ITEM_RECENT_KEY = 16777216
    val HIDE_NAV_ITEM_HOME_KEY = 2097152
    try {
      basicOptV2!!.setHideNavigationBarItems(HIDE_NAV_ITEM_RECENT_KEY or HIDE_NAV_ITEM_HOME_KEY);
      promise.resolve("Success");
    } catch (e: Exception) {
      promise.resolve(e.printStackTrace());
    }
  }
}
