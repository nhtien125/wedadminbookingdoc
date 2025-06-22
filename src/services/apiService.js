import Swal from "sweetalert2";
import API_BASE_URL from "./apiConfig";

// Hàm phụ để hiển thị thông báo lỗi
const showError = (title, message) => {
  Swal.fire({
    title,
    text: message,
    icon: "error",
    confirmButtonText: "OK",
  });
};

class ApiService {
  // Hàm xử lý phản hồi chung
  static async handleResponse(response) {
    try {
      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      if (!isJson) {
        throw new Error(`Expected JSON response, got ${contentType || "no content-type"}`);
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! Status: ${response.status} (${response.statusText})`
        );
      }

      return data;
    } catch (error) {
      throw new Error(
        error.message || `Failed to parse response: Status ${response.status}`
      );
    }
  }

  // Hàm gửi yêu cầu HTTP chung
static async request(method, endpoint, data = null, customHeaders = {}) {
  try {
    if (!API_BASE_URL) {
      throw new Error("API_BASE_URL is not defined");
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        ...customHeaders,
      },
    };

    // Thêm body nếu có data (không thêm cho GET/DELETE)
    if (data && method !== "GET" && method !== "DELETE") {
      if (data instanceof FormData) {
        options.body = data; // Use FormData as is
      } else {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(data);
      }
    }

    const response = await fetch(url, options);
    return await this.handleResponse(response);
  } catch (error) {
    let errorMessage = error.message;

    console.error(`${method} ${endpoint} failed:`, error);
    showError(
      "Lỗi Hệ Thống",
      errorMessage || "Đã có lỗi xảy ra, vui lòng thử lại sau!"
    );
    throw error;
  }
}


  // GET request
  static async get(endpoint, customHeaders = {}) {
    return this.request("GET", endpoint, null, customHeaders);
  }

  // POST request
  static async post(endpoint, data, customHeaders = {}) {
    return this.request("POST", endpoint, data, customHeaders);
  }

  // PUT request
  static async put(endpoint, data, customHeaders = {}) {
    return this.request("PUT", endpoint, data, customHeaders);
  }

  // DELETE request
  static async delete(endpoint, customHeaders = {}) {
    return this.request("DELETE", endpoint, null, customHeaders);
  }
}

export default ApiService;