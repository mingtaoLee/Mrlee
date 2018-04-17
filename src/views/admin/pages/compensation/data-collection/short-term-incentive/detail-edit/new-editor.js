/**
 * Created by ZHANZF on 2017-11-8.
 */
import { Modifier } from './modifier'
import req from 'api/compensation/data-collection/short-term-incentive'
export class NewEditor extends Modifier {
  save () {
    delete this.vm.form[this.vm.idKey]
    const submitData = this.transformSubmitData(this.vm.form)
    // submitData[this.vm.idKey] && delete submitData[this.vm.idKey]
    // submitData.extraPayInfoDtosList.map(item => {
    //   item.id && delete item.id
    // })
    return new Promise((resolve, reject) => {
      req('addBestirs', submitData).then(res => {
        this.showReqMessage(res)
        resolve(!!res)
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}
