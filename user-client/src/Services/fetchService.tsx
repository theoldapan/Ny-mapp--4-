const BASE_URL = " http://localhost:8080/api";

const headers: HeadersInit = {
  "Content-Type": "application/json",
};

export const fetchRequest = async <T,>(
  url: string,
  options: RequestInit = {}
): Promise<T | null> => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Something went wrong");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Fetch error:", error);
  }
  return null;
};
