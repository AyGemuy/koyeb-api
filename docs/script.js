document.addEventListener("DOMContentLoaded", async function() {
  document.body.classList.add("noscroll");
  hideLoader();
  try {
    const endpoints = await (await fetch("/endpoints")).json();
    const set = await (await fetch("/set")).json();
    setContent("api-icon", "href", set.icon);
    setContent("api-title", "textContent", set.name.main);
    setContent("api-description", "content", set.description);
    setContent("api-name", "textContent", set.name.main);
    setContent("api-author", "textContent", `by ${set.author}`);
    setContent("api-desc", "textContent", set.description);
    setContent("api-copyright", "textContent", `© 2025 ${set.name.copyright}. All rights reserved.`);
    setContent("api-info", "href", set.info_url);
    setupApiLinks(set);
    setupApiContent(endpoints);
    setupApiButtonHandlers(endpoints);
    setupSearchFunctionality();
  } catch (error) {
    console.error("Error loading configuration:", error);
  }

  function setContent(id, property, value) {
    const element = document.getElementById(id);
    if (element) element[property] = value;
  }

  function setupApiLinks(gtw) {
    const apiLinksContainer = document.getElementById("api-links");
    apiLinksContainer.innerHTML = "";
    if (apiLinksContainer && gtw.links?.length) {
      gtw.links.forEach(link => {
        const linkContainer = document.createElement("div");
        linkContainer.className = "flex items-center gap-2";
        const bulletPoint = document.createElement("div");
        bulletPoint.className = `w-2 h-2 bg-gray-400 rounded-full`;
        const linkElement = document.createElement("a");
        linkElement.href = link.url;
        linkElement.textContent = link.name;
        linkElement.className = "hover:underline";
        linkElement.target = "_blank";
        linkContainer.appendChild(bulletPoint);
        linkContainer.appendChild(linkElement);
        apiLinksContainer.appendChild(linkContainer);
      });
    }
  }
  const pageLoader = document.getElementById("page-loader");
  window.addEventListener("load", function() {
    setTimeout(function() {
      const scrollPosition = parseInt(document.body.style.top || "0") * -1;
      document.body.classList.remove("noscroll");
      document.body.style.top = "";
      window.scrollTo(0, scrollPosition);
      pageLoader.style.opacity = "0";
      setTimeout(function() {
        pageLoader.style.display = "none";
      }, 800);
    }, 1e3);
  });

  function showLoader() {
    const scrollPosition = window.scrollY;
    document.body.style.top = `-${scrollPosition}px`;
    document.body.classList.add("noscroll");
    pageLoader.style.display = "flex";
    pageLoader.style.opacity = "1";
  }

  function hideLoader() {
    setTimeout(function() {
      const scrollPosition = parseInt(document.body.style.top || "0") * -1;
      document.body.classList.remove("noscroll");
      document.body.style.top = "";
      window.scrollTo(0, scrollPosition);
      pageLoader.style.opacity = "0";
      setTimeout(function() {
        pageLoader.style.display = "none";
      }, 800);
    }, 1e3);
  }

  function setupApiContent(gtw) {
    const apiContent = document.getElementById("api-content");
    apiContent.innerHTML = "";
    const categoryNavContainer = document.createElement("div");
    categoryNavContainer.className = "category-nav-container";
    const categoryNav = document.createElement("div");
    categoryNav.className = "category-nav";
    const allCategory = document.createElement("span");
    allCategory.className = "category-tag active";
    allCategory.textContent = "ALL";
    allCategory.dataset.category = "all";
    categoryNav.appendChild(allCategory);
    const categories = [...new Set(gtw.endpoints.map(cat => cat.name))];
    categories.forEach(category => {
      const categoryTag = document.createElement("span");
      categoryTag.className = "category-tag";
      categoryTag.textContent = category.toUpperCase();
      categoryTag.dataset.category = category.toLowerCase();
      categoryNav.appendChild(categoryTag);
    });
    categoryNavContainer.appendChild(categoryNav);
    apiContent.appendChild(categoryNavContainer);
    const endpointsContainer = document.createElement("div");
    endpointsContainer.id = "endpoints-container";
    apiContent.appendChild(endpointsContainer);
    renderEndpoints(gtw.endpoints, "all");
    categoryNav.addEventListener("click", function(e) {
      if (e.target.classList.contains("category-tag")) {
        document.querySelectorAll(".category-tag").forEach(tag => {
          tag.classList.remove("active");
        });
        e.target.classList.add("active");
        const category = e.target.dataset.category;
        renderEndpoints(gtw.endpoints, category);
        e.target.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    });
  }

  function renderEndpoints(endpoints, selectedCategory) {
    const endpointsContainer = document.getElementById("endpoints-container");
    endpointsContainer.innerHTML = "";
    endpoints.forEach(category => {
      if (selectedCategory !== "all" && category.name.toLowerCase() !== selectedCategory) {
        return;
      }
      const categoryContainer = document.createElement("div");
      categoryContainer.className = "api-category mb-8";
      const categoryHeader = document.createElement("div");
      categoryHeader.className = "api-category-title flex items-center mb-4 pb-2 border-b border-gray-200";
      const categoryName = document.createElement("h3");
      categoryName.className = "text-xl font-semibold text-gray-800";
      categoryName.textContent = category.name;
      const endpointCount = document.createElement("span");
      endpointCount.className = "api-category-count ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full";
      endpointCount.textContent = Object.keys(category.items).length;
      categoryHeader.appendChild(categoryName);
      categoryHeader.appendChild(endpointCount);
      categoryContainer.appendChild(categoryHeader);
      const endpointsGrid = document.createElement("div");
      endpointsGrid.className = "api-endpoints grid grid-cols-1 md:grid-cols-2 gap-4";
      categoryContainer.appendChild(endpointsGrid);
      const sortedItems = Object.entries(category.items).sort(([, a], [, b]) => (a.name || "").localeCompare(b.name || "")).map(([, item]) => item);
      sortedItems.forEach(itemData => {
        const itemName = Object.keys(itemData)[0];
        const item = itemData[itemName];
        const itemElement = createApiItemElement(itemName, item);
        endpointsGrid.appendChild(itemElement);
      });
      endpointsContainer.appendChild(categoryContainer);
    });
  }

  function createApiItemElement(itemName, item) {
    const itemDiv = document.createElement("div");
    itemDiv.className = "api-endpoint bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow";
    itemDiv.dataset.name = itemName || "";
    itemDiv.dataset.desc = item.desc || "";
    const title = document.createElement("h5");
    title.className = "text-lg font-semibold text-gray-700 mb-1";
    title.textContent = itemName || "Unnamed Item";
    const description = document.createElement("p");
    description.className = "text-sm text-gray-600 mb-3";
    description.textContent = item.desc || "No description";
    const methodPathContainer = document.createElement("div");
    methodPathContainer.className = "flex items-center justify-between";
    const method = document.createElement("span");
    method.className = "endpoint-method px-2 py-1 text-xs font-medium bg-gray-800 text-white rounded";
    method.textContent = item.method || "GET";
    const path = document.createElement("span");
    path.className = "endpoint-path text-xs font-mono text-gray-600 truncate";
    path.textContent = item.path + (item.path.includes("?") ? "&apikey=apikey" : "?apikey=apikey");
    path.textContent = item.path;
    const button = document.createElement("button");
    button.className = "get-api-btn mt-3 w-full px-3 py-1.5 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 transition";
    button.dataset.apiPath = item.path || "";
    button.dataset.apiName = itemName || "";
    button.dataset.apiDesc = item.desc || "";
    button.textContent = "TRY";
    methodPathContainer.appendChild(method);
    methodPathContainer.appendChild(path);
    itemDiv.appendChild(title);
    itemDiv.appendChild(description);
    itemDiv.appendChild(methodPathContainer);
    itemDiv.appendChild(button);
    return itemDiv;
  }

  function openApiModal(name, endpoint, description, method) {
    const modal = document.getElementById("api-modal");
    const modalBackdrop = modal.querySelector(".fixed.inset-0.bg-black");
    const modalContent = modal.querySelector(".relative.z-10");
    const closeModalBtn = document.getElementById("close-modal");
    const submitApiBtn = document.getElementById("submit-api");
    const modalTitle = document.getElementById("modal-title");
    const apiMethod = document.getElementById("api-method");
    const apiDescription = document.getElementById("api-description");
    const paramsContainer = document.getElementById("params-container");
    const responseContainer = document.getElementById("response-container");
    const responseData = document.getElementById("response-data");
    const responseStatus = document.getElementById("response-status");
    const responseTime = document.getElementById("response-time");
    const existingUrlDisplay = document.querySelector(".urlDisplay");
    if (existingUrlDisplay) existingUrlDisplay.remove();
    responseContainer.classList.add("hidden");
    responseData.innerHTML = "";
    submitApiBtn.classList.remove("hidden");
    paramsContainer.classList.remove("hidden");
    paramsContainer.innerHTML = "";
    modalTitle.textContent = name;
    apiDescription.textContent = description;
    apiMethod.textContent = method || "GET";
    const apiKeyField = document.createElement("div");
    apiKeyField.className = "mb-4";
    apiKeyField.innerHTML = `
        <label class="block text-sm font-medium text-gray-700 mb-1">API Key</label>
        <input type="text" id="param-apikey" class="api-key-input w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500" value="yoedzx" placeholder="Enter your API key">
        <div id="error-apikey" class="text-red-500 text-xs mt-1 hidden">API key is required</div>
    `;
    paramsContainer.appendChild(apiKeyField);
    const url = new URL(endpoint, window.location.origin);
    const urlParams = url.search ? url.search.substring(1).split("&") : [];
    urlParams.forEach(param => {
      const [key] = param.split("=");
      if (key && key !== "apikey") {
        const isOptional = key.startsWith("_");
        const paramField = document.createElement("div");
        paramField.className = "mb-3";
        paramField.innerHTML = `
                <label class="block text-sm font-medium text-gray-700 mb-1">${key.capitalize()}</label>
                <input type="text" id="param-${key}" class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500" placeholder="Enter ${key}${isOptional ? " (optional)" : ""}">
                <div id="error-${key}" class="text-red-500 text-xs mt-1 hidden">This field is required</div>
            `;
        paramsContainer.appendChild(paramField);
      }
    });
    submitApiBtn.onclick = async function() {
      let isValid = true;
      const apiKeyInput = document.getElementById("param-apikey");
      const apiKeyError = document.getElementById("error-apikey");
      if (!apiKeyInput.value.trim()) {
        isValid = false;
        apiKeyError.classList.remove("hidden");
        apiKeyInput.classList.add("border-red-500");
      } else {
        apiKeyError.classList.add("hidden");
        apiKeyInput.classList.remove("border-red-500");
      }
      if (!isValid) return;
      responseContainer.classList.remove("hidden");
      paramsContainer.classList.add("hidden");
      submitApiBtn.classList.add("hidden");
      const startTime = Date.now();
      try {
        let apiUrl = endpoint;
        const separator = apiUrl.includes("?") ? "&" : "?";
        apiUrl = `${apiUrl}${separator}apikey=${encodeURIComponent(apiKeyInput.value.trim())}`;
        const paramInputs = paramsContainer.querySelectorAll("input");
        paramInputs.forEach(input => {
          const key = input.id.replace("param-", "");
          const value = input.value.trim();
          if (key !== "apikey" && value !== "") {
            apiUrl += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
          }
        });
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        };
        const response = await fetch(apiUrl, requestOptions);
        const endTime = Date.now();
        const duration = endTime - startTime;
        responseStatus.textContent = response.status;
        responseStatus.className = response.ok ? "px-2 py-1 text-xs font-medium bg-green-100 text-green-800 mr-2" : "px-2 py-1 text-xs font-medium bg-red-100 text-red-800 mr-2";
        responseTime.textContent = `${duration}ms`;
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "API request failed");
        }
        const contentType = response.headers.get("content-type");
        if (contentType.includes("application/json")) {
          const jsonData = await response.json();
          responseData.innerHTML = `<pre class="whitespace-pre-wrap break-words">${JSON.stringify(jsonData, null, 2)}</pre>`;
        } else {
          const text = await response.text();
          responseData.innerHTML = `<pre class="whitespace-pre-wrap break-words">${text}</pre>`;
        }
      } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        responseStatus.textContent = "Error";
        responseStatus.className = "px-2 py-1 text-xs font-medium bg-red-100 text-red-800 mr-2";
        responseTime.textContent = `${duration}ms`;
        responseData.innerHTML = `
                <div class="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-red-700">
                                ${error.message || "Invalid API key - please use ?apikey=yoedzx"}
                            </p>
                        </div>
                    </div>
                </div>
            `;
      }
    };
  }

  function setupApiButtonHandlers(gtw) {
    document.addEventListener("click", event => {
      if (event.target.classList.contains("get-api-btn")) {
        const {
          apiPath,
          apiName,
          apiDesc
        } = event.target.dataset;
        const currentItem = gtw.endpoints.flatMap(category => Object.values(category.items)).map(itemData => {
          const itemName = Object.keys(itemData)[0];
          return {
            name: itemName,
            ...itemData[itemName]
          };
        }).find(item => item.path === apiPath && item.name === apiName);
        openApiModal(apiName, apiPath, apiDesc);
      }
    });
  }

  function setupSearchFunctionality() {
    const searchInput = document.getElementById("api-search");
    if (!searchInput) return;
    let originalEndpoints = null;
    let currentCategory = "all";
    document.querySelector(".category-nav").addEventListener("click", function(e) {
      if (e.target.classList.contains("category-tag")) {
        currentCategory = e.target.dataset.category;
        if (searchInput.value.trim()) {
          searchInput.dispatchEvent(new Event("input"));
        }
      }
    });

    function captureOriginalData() {
      const categories = document.querySelectorAll(".api-category");
      const result = [];
      categories.forEach(category => {
        const categoryName = category.querySelector(".api-category-title h3").textContent.toLowerCase();
        const endpointsGrid = category.querySelector(".api-endpoints");
        const items = Array.from(endpointsGrid.querySelectorAll(".api-endpoint")).map(item => {
          return {
            element: item.cloneNode(true),
            name: item.dataset.name,
            desc: item.dataset.desc,
            category: categoryName
          };
        });
        result.push({
          categoryElement: category,
          categoryName: categoryName,
          endpointsGrid: endpointsGrid,
          items: items
        });
      });
      return result;
    }

    function restoreOriginalData() {
      if (!originalEndpoints) return;
      originalEndpoints.forEach(categoryData => {
        categoryData.categoryElement.classList.add("hidden");
        if (currentCategory === "all" || categoryData.categoryName === currentCategory) {
          categoryData.categoryElement.classList.remove("hidden");
          categoryData.endpointsGrid.innerHTML = "";
          categoryData.items.forEach(item => {
            categoryData.endpointsGrid.appendChild(item.element.cloneNode(true));
          });
        }
      });
    }
    originalEndpoints = captureOriginalData();
    searchInput.addEventListener("input", function(e) {
      const searchTerm = e.target.value.toLowerCase().trim();
      if (!searchTerm) {
        restoreOriginalData();
        return;
      }
      originalEndpoints.forEach(categoryData => {
        const shouldShowCategory = currentCategory === "all" || categoryData.categoryName === currentCategory;
        const visibleItems = categoryData.items.filter(item => {
          if (!shouldShowCategory) return false;
          const title = item.name?.toLowerCase() || "";
          const desc = item.desc?.toLowerCase() || "";
          return title.includes(searchTerm) || desc.includes(searchTerm);
        });
        categoryData.endpointsGrid.innerHTML = "";
        if (visibleItems.length === 0) {
          categoryData.categoryElement.classList.add("hidden");
        } else {
          categoryData.categoryElement.classList.remove("hidden");
          visibleItems.forEach(item => {
            categoryData.endpointsGrid.appendChild(item.element.cloneNode(true));
          });
        }
      });
    });
  }

  function openApiModal(name, endpoint, description, method) {
    const modal = document.getElementById("api-modal");
    const modalBackdrop = modal.querySelector(".fixed.inset-0.bg-black");
    const modalContent = modal.querySelector(".relative.z-10");
    const closeModalBtn = document.getElementById("close-modal");
    const submitApiBtn = document.getElementById("submit-api");
    const modalTitle = document.getElementById("modal-title");
    const apiMethod = document.getElementById("api-method");
    const apiDescription = document.getElementById("api-description");
    const paramsContainer = document.getElementById("params-container");
    const responseContainer = document.getElementById("response-container");
    const responseData = document.getElementById("response-data");
    const responseStatus = document.getElementById("response-status");
    const responseTime = document.getElementById("response-time");
    const existingUrlDisplay = document.querySelector(".urlDisplay");
    if (existingUrlDisplay) {
      existingUrlDisplay.remove();
    }
    responseContainer.classList.add("hidden");
    responseData.innerHTML = "";
    submitApiBtn.classList.remove("hidden");
    paramsContainer.classList.remove("hidden");
    paramsContainer.innerHTML = "";
    modalTitle.textContent = name;
    apiDescription.textContent = description;
    const url = new URL(endpoint, window.location.origin);
    const urlParams = url.search ? url.search.substring(1).split("&") : [];
    if (urlParams.length) {
      urlParams.forEach(param => {
        const [key] = param.split("=");
        if (key) {
          const isOptional = key.startsWith("_");
          const placeholderText = `Enter ${key}${isOptional ? " (optional)" : ""}`;
          const paramField = document.createElement("div");
          paramField.className = "mb-3";
          paramField.innerHTML = `
                        <input type='text' id='param-${key}' class='w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent' placeholder='${placeholderText}'>
                        <div id='error-${key}' class='text-red-500 text-xs mt-1 hidden'>This field is required</div>
                    `;
          paramsContainer.appendChild(paramField);
        }
      });
    } else {
      const placeholderMatch = endpoint.match(/{([^}]+)}/g);
      if (placeholderMatch) {
        placeholderMatch.forEach(match => {
          const paramName = match.replace(/{|}/g, "");
          const isOptional = paramName.startsWith("_");
          const placeholderText = `Enter ${paramName}${isOptional ? " (optional)" : ""}`;
          const paramField = document.createElement("div");
          paramField.className = "mb-3";
          paramField.innerHTML = `
                        <input type='text' id='param-${paramName}' class='w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent' placeholder='${placeholderText}'>
                        <div id='error-${paramName}' class='text-red-500 text-xs mt-1 hidden'>This field is required</div>
                    `;
          paramsContainer.appendChild(paramField);
        });
      }
    }
    modal.classList.remove("hidden");
    document.body.classList.add("noscroll");
    modal.offsetWidth;
    modal.classList.add("opacity-100");
    modalBackdrop.classList.add("opacity-50");
    modalContent.classList.add("scale-100", "opacity-100");
    const closeModal = function() {
      modal.classList.remove("opacity-100");
      modalBackdrop.classList.remove("opacity-50");
      modalContent.classList.remove("scale-100", "opacity-100");
      setTimeout(() => {
        modal.classList.add("hidden");
        document.body.classList.remove("noscroll");
      }, 300);
    };
    closeModalBtn.onclick = closeModal;
    modal.addEventListener("click", function(event) {
      if (event.target === modal) {
        closeModal();
      }
    });
    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape") {
        closeModal();
      }
    }, {
      once: true
    });
    submitApiBtn.onclick = async function() {
      let isValid = true;
      document.querySelectorAll('[id^="error-"]').forEach(errorElement => {
        errorElement.classList.add("hidden");
      });
      if (paramsContainer.children.length > 0) {
        Array.from(paramsContainer.children).forEach(paramDiv => {
          const input = paramDiv.querySelector("input");
          const paramName = input.id.replace("param-", "");
          const paramValue = input.value.trim();
          const errorElement = document.getElementById(`error-${paramName}`);
          if (!paramName.startsWith("_") && paramValue === "") {
            isValid = false;
            errorElement.classList.remove("hidden");
            input.classList.add("border-red-500");
          } else {
            input.classList.remove("border-red-500");
          }
        });
      }
      if (!isValid) {
        return;
      }
      responseContainer.classList.remove("hidden");
      paramsContainer.classList.add("hidden");
      submitApiBtn.classList.add("hidden");
      const startTime = Date.now();
      try {
        let apiUrl = endpoint;
        if (paramsContainer.children.length > 0) {
          Array.from(paramsContainer.children).forEach(paramDiv => {
            const input = paramDiv.querySelector("input");
            const paramName = input.id.replace("param-", "");
            const paramValue = input.value;
            if (paramName.startsWith("_") && paramValue === "") {
              return;
            }
            if (apiUrl.includes(`{${paramName}}`)) {
              apiUrl = apiUrl.replace(`{${paramName}}`, encodeURIComponent(paramValue));
            } else {
              const urlObj = new URL(apiUrl, window.location.origin);
              urlObj.searchParams.set(paramName, paramValue);
              apiUrl = urlObj.pathname + urlObj.search;
            }
          });
        }
        const fullUrl = new URL(apiUrl, window.location.origin).href;
        const urlDisplayDiv = document.createElement("div");
        urlDisplayDiv.className = "urlDisplay mb-4 p-3 bg-gray-50 font-mono text-xs overflow-hidden";
        const urlContent = document.createElement("div");
        urlContent.className = "break-all";
        urlContent.textContent = fullUrl;
        urlDisplayDiv.appendChild(urlContent);
        responseContainer.parentNode.insertBefore(urlDisplayDiv, responseContainer);
        responseData.innerHTML = "Loading...";
        const requestOptions = {
          method: "get",
          headers: {
            "Content-Type": "application/json"
          }
        };
        const response = await fetch(apiUrl, requestOptions);
        const endTime = Date.now();
        const duration = endTime - startTime;
        responseStatus.textContent = response.status;
        responseStatus.className = response.ok ? "px-2 py-1 text-xs font-medium bg-green-100 text-green-800 mr-2" : "px-2 py-1 text-xs font-medium bg-red-100 text-red-800 mr-2";
        responseTime.textContent = `${duration}ms`;
        const contentType = response.headers.get("content-type");
        if (contentType && (contentType.includes("image/") || contentType.includes("video/") || contentType.includes("audio/") || contentType.includes("application/octet-stream"))) {
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          if (contentType.includes("image/")) {
            responseData.innerHTML = `<img src='${objectUrl}' alt='Response Image' class='max-w-full h-auto' />`;
          } else if (contentType.includes("video/")) {
            responseData.innerHTML = `
                            <video controls class='max-w-full'>
                                <source src='${objectUrl}' type='${contentType}'>
                                Your browser does not support the video tag.
                            </video>`;
          } else if (contentType.includes("audio/")) {
            responseData.innerHTML = `
                            <audio controls class='w-full'>
                                <source src='${objectUrl}' type='${contentType}'>
                                Your browser does not support the audio tag.
                            </audio>`;
          } else {
            responseData.innerHTML = `
                            <div class='text-center p-4'>
                                <p class='mb-2'>Binary data received (${blob.size} bytes)</p>
                                <a href='${objectUrl}' download='response-data' class='px-4 py-2 bg-blue-500 text-white hover:bg-blue-600'>Download File</a>
                            </div>`;
          }
        } else if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          const responseText = JSON.stringify(data, null, 2);
          responseData.innerHTML = `<pre class='whitespace-pre-wrap break-words'>${responseText}</pre>`;
        } else {
          const responseText = await response.text();
          responseData.innerHTML = `<pre class='whitespace-pre-wrap break-words'>${responseText}</pre>`;
        }
      } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        responseStatus.textContent = "Error";
        responseStatus.className = "px-2 py-1 text-xs font-medium bg-red-100 text-red-800 mr-2";
        responseTime.textContent = `${duration}ms`;
        responseData.innerHTML = `<pre class='text-red-500'>${error.message}</pre>`;
      }
    };
  }
});