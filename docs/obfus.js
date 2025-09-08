document.addEventListener("DOMContentLoaded", function() {
  const jsfileInput = document.getElementById("jsfile");
  const uploadBtn = document.getElementById("uploadBtn");
  const fileName = document.getElementById("fileName");
  const jsCode = document.getElementById("jsCode");
  const obfuscateBtn = document.getElementById("obfuscateBtn");
  const clearBtn = document.getElementById("clearBtn");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const resultContainer = document.getElementById("resultContainer");
  const obfuscatedCode = document.getElementById("obfuscatedCode");
  const statusMessage = document.getElementById("statusMessage");
  uploadBtn.addEventListener("click", () => jsfileInput.click());
  jsfileInput.addEventListener("change", function() {
    if (this.files.length > 0) {
      fileName.textContent = this.files[0].name;
      const reader = new FileReader();
      reader.onload = function(e) {
        jsCode.value = e.target.result;
      };
      reader.readAsText(this.files[0]);
    } else {
      fileName.textContent = "No file selected";
    }
  });
  clearBtn.addEventListener("click", function() {
    jsfileInput.value = "";
    jsCode.value = "";
    fileName.textContent = "No file selected";
    resultContainer.classList.add("hidden");
    copyBtn.classList.add("hidden");
    downloadBtn.classList.add("hidden");
    showStatus("Cleared all inputs", "green");
  });
  obfuscateBtn.addEventListener("click", async function() {
    if (!jsCode.value.trim() && jsfileInput.files.length === 0) {
      showStatus("Please provide JavaScript code", "red");
      return;
    }
    obfuscateBtn.disabled = true;
    obfuscateBtn.innerHTML = '<i class="material-icons mr-2">hourglass_empty</i> Processing...';
    try {
      const result = await yoedzHardObfuscate(jsCode.value);
      obfuscatedCode.textContent = result;
      resultContainer.classList.remove("hidden");
      copyBtn.classList.remove("hidden");
      downloadBtn.classList.remove("hidden");
      showStatus("Code obfuscated successfully!", "green");
    } catch (error) {
      console.error("Error:", error);
      showStatus("Error during obfuscation", "red");
    } finally {
      obfuscateBtn.disabled = false;
      obfuscateBtn.innerHTML = '<i class="material-icons mr-2">lock</i> Obfuscate Code';
    }
  });
  copyBtn.addEventListener("click", function() {
    navigator.clipboard.writeText(obfuscatedCode.textContent).then(() => showStatus("Copied to clipboard!", "green")).catch(err => showStatus("Failed to copy", "red"));
  });
  downloadBtn.addEventListener("click", function() {
    const blob = new Blob([obfuscatedCode.textContent], {
      type: "application/javascript"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "obfuscated.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showStatus("Download started", "green");
  });

  function showStatus(message, color) {
    statusMessage.textContent = message;
    statusMessage.style.color = color === "green" ? "#68d391" : "#fc8181";
    statusMessage.classList.remove("hidden");
    setTimeout(() => statusMessage.classList.add("hidden"), 3e3);
  }
  async function yoedzHardObfuscate(code) {
    if (typeof JavaScriptObfuscator === "undefined") {
      await loadScript("https://cdn.jsdelivr.net/npm/javascript-obfuscator/dist/index.browser.js");
    }
    const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 1,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: .5,
      debugProtection: false,
      identifierNamesGenerator: "hexadecimal",
      identifiersPrefix: "㡫YoedzXy㠽",
      renameGlobals: true,
      renameProperties: false,
      reservedNames: [],
      rotateStringArray: true,
      selfDefending: true,
      shuffleStringArray: true,
      splitStrings: true,
      stringArray: true,
      stringArrayEncoding: ["rc4"],
      stringArrayThreshold: 1,
      transformObjectKeys: true,
      unicodeEscapeSequence: true,
      domainLock: [],
      seed: 0
    });
    return obfuscationResult.getObfuscatedCode();
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
});