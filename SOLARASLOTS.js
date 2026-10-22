
/**
 * Simulated deposit-notification sender (for testing an automation pipeline).
 * Posts clearly labeled SIMULATED embeds on a fixed schedule.
 *
 * SETUP
 * 1. script.google.com > New project, paste this in.
 * 2. Put your webhook URL in WEBHOOK_URL (use a private dev/test channel).
 * 3. Run "testSend" once to check it, then run "setup" to start the schedule.
 *    Run "stop" to turn it off.
 */
 
const WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1562696447265218621/BrdSFDx0IaDCv1m5Qdld0aAPajOPwTd56GIocUvk4JZMcd3xJeXTltEFza0pRK_I7z6l';
 
// Time between messages is picked randomly in this range (whole minutes, min 1).
const MIN_MINUTES = 1;
const MAX_MINUTES = 13;
 
function buildMessage() {
  return {
    embeds: [{
      title: 'Slot filled',
      description: 'Automated test message. Not a real deposit.',
      color: 0x808080,
      fields: [
        { name: 'Amount', value: randFloat(1, 15, 2) + ' SOL (simulated)' },
        { name: 'Wallet', value: randChars(4) + '`' },
        { name: 'Status', value: 'Received' }
      ],
      footer: { text: 'Solara | Professional Trading System' },
      timestamp: new Date().toISOString()
    }]
  };
}
 
function randFloat(min, max, decimals) {
  return (Math.random() * (max - min) + min).toFixed(decimals);
}
function randChars(length) {
  const cs = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < length; i++) s += cs.charAt(Math.floor(Math.random() * cs.length));
  return s;
}
 
function send_() {
  const res = UrlFetchApp.fetch(WEBHOOK_URL, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(buildMessage()),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() >= 300) {
    console.log('Discord error ' + res.getResponseCode() + ': ' + res.getContentText());
  }
}
 
function tick() { send_(); }
 
function setup() {
  stop();
  ScriptApp.newTrigger('tick').timeBased().everyMinutes(INTERVAL_MINUTES).create();
}
 
function stop() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
}
 
function testSend() { send_(); }
 