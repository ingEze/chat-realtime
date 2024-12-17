import { Dropbox } from 'dropbox'

export class DropboxService {
  constructor (accessToken) {
    this.dbx = new Dropbox({ accessToken })
  }
}
