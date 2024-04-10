let peripheral = null;

function updateStatus(status) {
  const mainContent = document.getElementById("status");
  mainContent.innerText = status;
}

function decodeBuffer(rawValue) {
  const dec = new TextDecoder("utf-8");
  const value = rawValue.buffer;
  return dec.decode(value);
}

function updateBackground(colorCode) {
  const mainContent = document.getElementsByClassName("container")[0];
  switch (colorCode) {
    case "O": {
      mainContent.style.backgroundColor = "#FFA500";
      break;
    }
    case "R": {
      mainContent.style.backgroundColor = "#C41E3A";
      break;
    }
    case "G": {
      mainContent.style.backgroundColor = "#AFE1AF";
      break;
    }
    case "B": {
      mainContent.style.backgroundColor = "#088F8F";
      break;
    }
  }
}

async function getColorCharacteristic(uuid) {
  const serviceUUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
  const service = await peripheral.getPrimaryService(serviceUUID);
  const characteristic = await service.getCharacteristic(uuid);
  return characteristic;
}

function handleBatteryLevelChanged(event) {
  const value = decodeBuffer(event.target.value);
  updateBackground(value);
}

const scanAndConnectButton = document.getElementById("scanAndConnect");
scanAndConnectButton.onclick = async function () {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ name: "Friyia" }, { name: "Arduino" }],
    optionalServices: ["19b10000-e8f2-537e-4f6c-d104768a1214"],
  });
  peripheral = await device.gatt.connect();
  updateStatus("Connected");
};

const readColorButton = document.getElementById("readColor");
readColorButton.onclick = async function () {
  const characteristic = await getColorCharacteristic(
    "19b10001-e8f2-537e-4f6c-d104768a1215"
  );
  const rawValue = await characteristic.readValue();
  const colorCode = decodeBuffer(rawValue);
  updateBackground(colorCode);
};

const startNotifyButton = document.getElementById("writeNotify");
startNotifyButton.onclick = async function () {
  const characteristic = await getColorCharacteristic(
    "19b10001-e8f2-537e-4f6c-d104768a1216"
  );
  const enc = new TextEncoder();
  await characteristic.writeValue(enc.encode("START"));
  updateStatus("Streaming");
};

const streamButton = document.getElementById("streamData");
streamButton.onclick = async function () {
  const characteristic = await getColorCharacteristic(
    "19b10001-e8f2-537e-4f6c-d104768a1217"
  );

  await characteristic.startNotifications();

  characteristic.addEventListener(
    "characteristicvaluechanged",
    handleBatteryLevelChanged
  );
};
