export class Personel {
	constructor () {
		this.userId = '123'
	}
	deleteRepeatNumber (arr = []) {
      return arr.filter(item => item > 6)
    }
}