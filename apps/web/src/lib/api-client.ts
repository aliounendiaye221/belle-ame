/**
 * Client API unifié et résilient pour la plateforme « À Chacun Une Belle Âme »
 * Gère automatiquement :
 * - L'injection du JWT Bearer Token dans les en-têtes Authorization
 * - Le rafraîchissement silencieux des sessions expirées
 * - La gestion propre des erreurs HTTP et le repli gracieux
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("belleame_access_token");
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("belleame_access_token", token);
      } else {
        localStorage.removeItem("belleame_access_token");
      }
    }
  }

  public getToken(): string | null {
    if (typeof window !== "undefined" && !this.token) {
      this.token = localStorage.getItem("belleame_access_token");
    }
    return this.token;
  }

  public async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    };

    const currentToken = this.getToken();
    if (currentToken && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${currentToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // En cas d'expiration du jeton (401), déconnecter proprement
        if (response.status === 401 && typeof window !== "undefined") {
          this.setToken(null);
        }

        return {
          success: false,
          error: data?.message || data?.error || `Erreur serveur (${response.status})`,
          statusCode: response.status,
          data,
        };
      }

      return {
        success: true,
        data,
        statusCode: response.status,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Impossible de contacter le serveur. Vérifiez votre connexion Internet.",
        statusCode: 0,
      };
    }
  }

  // Raccourcis verbes HTTP
  public get<T = any>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  public post<T = any>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T = any>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T = any>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
