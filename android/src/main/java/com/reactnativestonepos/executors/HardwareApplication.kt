package com.reactnativestonepos.executors

import com.facebook.react.bridge.ReactApplicationContext
import com.sunmi.pay.hardware.aidlv2.emv.EMVOptV2
import com.sunmi.pay.hardware.aidlv2.etc.ETCOptV2
import com.sunmi.pay.hardware.aidlv2.pinpad.PinPadOptV2
import com.sunmi.pay.hardware.aidlv2.print.PrinterOptV2
import com.sunmi.pay.hardware.aidlv2.readcard.ReadCardOptV2
import com.sunmi.pay.hardware.aidlv2.security.SecurityOptV2
import com.sunmi.pay.hardware.aidlv2.system.BasicOptV2
import com.sunmi.pay.hardware.aidlv2.tax.TaxOptV2
import sunmi.paylib.SunmiPayKernel
import sunmi.paylib.SunmiPayKernel.ConnectCallback

class HardwareApplication(reactApplicationContext: ReactApplicationContext) {
  var basicOptV2: BasicOptV2 = SunmiPayKernel.getInstance().mBasicOptV2;
  var readCardOptV2 // 获取读卡模块
    : ReadCardOptV2? = null
  var pinPadOptV2 // 获取PinPad操作模块
    : PinPadOptV2? = null
  var securityOptV2 // 获取安全操作模块
    : SecurityOptV2? = null
  var emvOptV2 // 获取EMV操作模块
    : EMVOptV2? = null
  var taxOptV2 // 获取税控操作模块
    : TaxOptV2? = null
  var etcOptV2 // 获取ETC操作模块
    : ETCOptV2? = null
  var printerOptV2 // 获取打印操作模块
    : PrinterOptV2? = null

  var context: ReactApplicationContext = reactApplicationContext

  private var connectPaySDK //是否已连接PaySDK
    = false

  fun bindPaySDKService() {
    val payKernel = SunmiPayKernel.getInstance()
    payKernel.initPaySDK(context, object : ConnectCallback {
      override fun onConnectPaySDK() {
//        LogUtil.e(Constant.TAG, "onConnectPaySDK...")
        emvOptV2 = payKernel.mEMVOptV2
        basicOptV2 = payKernel.mBasicOptV2
        pinPadOptV2 = payKernel.mPinPadOptV2
        readCardOptV2 = payKernel.mReadCardOptV2
        securityOptV2 = payKernel.mSecurityOptV2
        taxOptV2 = payKernel.mTaxOptV2
        etcOptV2 = payKernel.mETCOptV2
        printerOptV2 = payKernel.mPrinterOptV2
        connectPaySDK = true
      }

      override fun onDisconnectPaySDK() {
//        LogUtil.e(Constant.TAG, "onDisconnectPaySDK...")
        connectPaySDK = false
        emvOptV2 = null
        basicOptV2 = SunmiPayKernel.getInstance().mBasicOptV2;
        pinPadOptV2 = null
        readCardOptV2 = null
        securityOptV2 = null
        taxOptV2 = null
        etcOptV2 = null
        printerOptV2 = null
      }
    })
  }
}
