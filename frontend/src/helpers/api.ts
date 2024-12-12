
const BASE_URL = 'http://localhost:5000';


interface RequestBody<T = unknown> {
  [key: string]: T; 
}

const apiFetch = async (
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: RequestBody,
  contentType?: string
) => {
  try {
    const headers: HeadersInit = {
      Accept: "*/*",
    };

    if (!contentType) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      headers,
      body: JSON.stringify(body) ,
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || "Network response was not ok";
      console.log(errorMessage)
     
    }

    return responseData;
  } catch (error) {
    console.error("API call error:", error);
  }
};

export const DesignationList = () => {
  return apiFetch("/api/designations/list", "GET");
};

export const CreateDesignation = (body: RequestBody) => {
  return apiFetch("/api/designations", "POST", body);
};

export const CreateEmployee = (body: RequestBody) => {
  return apiFetch("/api/employees", "POST", body);
};

export const Hierarchy = () => {
  return apiFetch("/api/hierarchy", "GET");
};

export const GetEmployees = () => {
  return apiFetch("/api/employees", "GET");
};

export const EditDesignation = (
  designationId: string,
  body: RequestBody
) => {
  return apiFetch(`/api/designations/${designationId}`, "PUT", body);
};

export const EditEmployee = (
  employeeId: string,
  body: RequestBody
) => {
  return apiFetch(`/api/employees/${employeeId}`, "PUT", body);
};

export const DeleteDesignation = (designationId: string) => {
  return apiFetch(`/api/designations/${designationId}`, "DELETE");
};

export const DeleteEmployee = (employeeId: string) => {
  return apiFetch(`/api/employees/${employeeId}`, "DELETE");
};
