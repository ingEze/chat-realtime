import { Dropbox } from 'dropbox'
import { DROPBOX_TOKEN } from '../../config/config'

const dbx = new Dropbox({ accessToken: DROPBOX_TOKEN })
