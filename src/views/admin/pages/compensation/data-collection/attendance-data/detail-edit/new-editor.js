/**
 * Created by ZHANZF on 2017-11-8.
 */
import { Modifier } from './modifier'
import req from 'api/compensation/data-collection/attendance-data'
export class NewEditor extends Modifier {
  save () {
    delete this.vm.form[this.vm.idKey]
    const submitData = this.transformSubmitData(this.vm.form)
    return new Promise((resolve, reject) => {
      req('postAttendances', submitData).then(res => {
        this.showReqMessage(res)
        resolve(!!res)
      }).catch(err => {
        console.log(`Error: ${err.message}`)
        reject(err)
      })
    })
  }
}
