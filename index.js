function updateStatus(status) {
  const mainContent = document.getElementById("status");
  mainContent.innerText = status;
}

const scanAndConnectButton = document.getElementById("scanAndConnect");
scanAndConnectButton.onclick = async function () {};

const readColorButton = document.getElementById("readColor");
readColorButton.onclick = async function () {};

const startNotifyButton = document.getElementById("writeNotify");
startNotifyButton.onclick = async function () {};

const streamButton = document.getElementById("streamData");
streamButton.onclick = async function () {};
