'use strict';

import { expect, clock } from 'mai-chai';
import { HubLoader, Correlator } from 'electrum-ws-client';

/******************************************************************************/

class Sink {
  pong (text) {
    console.log (`pong got "${text}"`);
  }
}

/******************************************************************************/

describe ('HubLoader', () => {
  describe ('rpc()', () => {
    it ('talks to the hub over a WebSocket channel', async () => {
      const loader = new HubLoader ('foo');
      expect (loader.hubName).to.equal ('foo');
      let ready = 0;
      await loader.load ('ws://localhost:54320', 'x', async hub => {
        await hub.start ();
        const perf = clock ();
        const reply = await hub.rpc ('Length', {message: 'Hello'});
        expect (clock (perf)).to.be.at.most (20);
        expect (reply).to.equal ('5 characters');
        ready++;
      });
      expect (ready).to.equal (1);
    });
  });

  describe ('send()', () => {
    it ('talks to the hub over a WebSocket channel', async () => {
      const loader = new HubLoader ('foo');
      expect (loader.hubName).to.equal ('foo');
      let ready = 0;
      await loader.load ('ws://localhost:54320', 'x', async hub => {
        hub.registerSink (() => new Sink ());
        await hub.start ();
        const perf = clock ();
        const reply = await hub.send ('Ping', {text: 'Hi'});
        expect (clock (perf)).to.be.at.most (20);
        ready++;
      });
      expect (ready).to.equal (1);
    });
  });
});

/******************************************************************************/