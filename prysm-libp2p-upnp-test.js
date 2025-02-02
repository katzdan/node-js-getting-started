'use strict'

const libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const PeerInfo = require('peer-info')
const waterfall = require('async/waterfall')
const defaultsDeep = require('@nodeutils/defaults-deep')
//const PeerId = require('peer-id')
const multiaddr = require('multiaddr')
// This MyBundle class is your libp2p bundle packed with TCP
class MyBundle extends libp2p {
  constructor (_options) {
    const defaults = {
      // modules is a JS object that will describe the components
      // we want for our libp2p bundle
      modules: {
        transport: [
          TCP
        ]
      }
    }

    super(defaultsDeep(_options, defaults))
  }
}

let node

waterfall([
  // First we create a PeerInfo object, which will pack the
  // info about our peer. Creating a PeerInfo is an async
  // operation because we use the WebCrypto API
  // (yeei Universal JS)
  (cb) => PeerInfo.create(cb),
  (peerInfo, cb) => {
    // To signall the addresses we want to be available, we use
    // the multiaddr format, a self describable address
    peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0')
    // Now we can create a node with that PeerInfo object
    node = new MyBundle({ peerInfo: peerInfo })
    // Last, we start the node!
    node.start(cb)
  }
], (err) => {
  if (err) { throw err }

  // At this point the node has started
  console.log('node has started (true/false):', node.isStarted())
  // And we can print the now listening addresses.
  // If you are familiar with TCP, you might have noticed
  // that we specified the node to listen in 0.0.0.0 and port
  // 0, which means "listen in any network interface and pick
  // a port for me
  console.log('listening on:')
  node.peerInfo.multiaddrs.forEach((ma) => console.log(ma.toString()))

  //set the stais address
  const addr = multiaddr("/ip4/118.173.172.41/tcp/38638/p2p/QmWqeyvpgfxk1MtSRcH6SQZ3BuSvudaKCa6haCJG5SUtYg")

  node.dial(addr, function (err, conn) {
      if (err)
        throw err
  })

})
