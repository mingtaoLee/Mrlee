/**
 * Created by ZHANZF on 2017-11-8.
 */
import { Modifier } from './modifier'
import req from 'api/compensation/base-setting/company-rules'
export class NewEditor extends Modifier {
  initData (componentId) {
    this.vm.load()
    return req('getCompensationItem', {componentId: componentId}).then(res => {
      if (res) this.vm.form = this.transformData(res)
      this.vm.loaded()
    })
  }

  save () {
    delete this.vm.form[this.vm.idKey]
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('postCompensationItem', submitData).then(res => {
        this.showReqMessage(res)
        resolve(!!res)
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}