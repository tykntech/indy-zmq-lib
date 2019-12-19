import { EventEmitter } from 'events';
const lazysodium = require('libsodium-wrappers');
const localzmq = require('zeromq/v5-compat');
const bs58 = require('bs58');

class Jobs extends EventEmitter {
  /**
   *
   */
  constructor() {
    super();
  }
}

class LedgerError extends Error {
  public data: any;
}

interface ZmqConnectionConfig {
  timeout: number;
  serverKey: any;
  host: string;
  port: number;
}

export async function ParseGenesisTx(
  stringConf: string,
  sodium: any
): Promise<ZmqConnectionConfig> {
  if (!sodium) {
    await lazysodium.ready;
    sodium = lazysodium;
  }

  if (!sodium) {
    throw new Error('Sodium is undefined. Check your library load');
  }

  const conf = JSON.parse(stringConf).txn.data;
  const retObject: ZmqConnectionConfig = {
    timeout: typeof conf.timeout !== 'number' ? conf.timeout : 1000 * 60,
    serverKey: sodium.crypto_sign_ed25519_pk_to_curve25519(bs58.decode(conf.dest)),
    host: conf.data.client_ip,
    port: conf.data.client_port
  };
  return retObject;
}

export function Wrap({ timeout, serverKey, host, port }: ZmqConnectionConfig, parZmq: any) {
  const zmq = parZmq || localzmq;
  const reqs: any = {};
  const api: any = new Jobs();

  const initZmqSocket = (async function() {
    const zsock = zmq.socket('dealer');
    const keypair = zmq.curveKeypair();

    zsock.identity = keypair.public;
    zsock.curve_publickey = keypair.public;
    zsock.curve_secretkey = keypair.secret;
    zsock.curve_serverkey = serverKey;

    zsock.linger = 0; // TODO set correct timeout
    zsock.connect('tcp://' + host + ':' + port);

    zsock.on('message', function(msg: any) {
      try {
        const str = msg.toString('utf8');
        if (str === 'po') {
          api.emit('pong');
          return;
        }
        let data = JSON.parse(str);
        let reqId;
        let err;
        switch (data.op) {
          case 'REQACK':
            reqId = data.reqId;
            if (reqs[reqId]) {
              reqs[reqId].ack = Date.now();
            }
            break;
          case 'REQNACK':
          case 'REJECT':
            reqId = data.reqId;
            err = new LedgerError(data.reason);
            err.data = data;
            if (reqs[reqId]) {
              reqs[reqId].reject(err);
            } else {
              api.emit('error', err);
            }
            break;
          case 'REPLY':
            if (data.result && data.result.txn && data.result.txn.metadata) {
              reqId = data.result.txn.metadata.reqId;
            } else {
              reqId = data.result.reqId;
            }

            if (reqs[reqId]) {
              reqs[reqId].resolve(data);
              delete reqs[reqId];
            } else {
              let err = new LedgerError('reqId not found: ' + reqId);
              err.data = data;
              api.emit('error', err);
            }
            break;
          default:
            err = new LedgerError('op not handled: ' + data.op);
            err.data = data;
            api.emit('error', err);
        }
      } catch (err) {
        // TODO try MsgPack
        api.emit('error', err);
      }
    });
    return zsock;
  })();

  let checkTimeouts = setInterval(function() {
    Object.keys(reqs).forEach(function(reqId) {
      if (Date.now() - reqs[reqId].sent > timeout) {
        reqs[reqId].reject(new Error('Timeout'));
        delete reqs[reqId];
      }
    });
  }, 1000);

  api.ping = async function ping() {
    const zsock = await initZmqSocket;
    zsock.send(['pi']);
  };

  api.send = async function send(data: any) {
    const zsock = await initZmqSocket;

    if (!data) {
      data = {};
    }

    if (!data.reqId) {
      data.reqId = Date.now();
    }

    let p = new Promise(function(resolve, reject) {
      reqs[data.reqId] = {
        sent: Date.now(),
        ack: null,
        resolve: resolve,
        reject: reject
      };
    });

    let msg = Buffer.from(JSON.stringify(data));
    if (!msg) {
      throw new Error('Empty message, something went wrong.');
    }
    zsock.send(msg);
    return p;
  };

  api.close = async function close() {
    clearInterval(checkTimeouts);
    const zsock = await initZmqSocket;
    zsock.close();
    Object.keys(reqs).forEach(function(reqId) {
      reqs[reqId].reject(new Error('Closed'));
      delete reqs[reqId];
    });
    api.emit('close');
  };
  return api;
}
