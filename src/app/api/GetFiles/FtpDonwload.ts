import apiClient from "../client/ApiClient";

const downloadFile = async (path: string) => {
  try {
    const response = await apiClient.post(
      "/download",
      { path },
      {
        responseType: "blob", // Manejar datos binarios
      }
    );

    // Extraer el nombre del archivo del encabezado Content-Disposition
    const contentDisposition = response.headers["content-disposition"];
    let fileName = "archivo-descargado"; // Nombre por defecto

    if (contentDisposition) {
      const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) {
        fileName = match[1].replace(/['"]/g, ""); // Eliminar comillas
      }
    } else {
      // Si no hay encabezado, intentar extraer el nombre del archivo de la ruta
      const pathParts = path.split("/");
      fileName = pathParts[pathParts.length - 1] || fileName;
    }

    // Crear un enlace temporal para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // Usar el nombre del archivo con extensión
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error al descargar el archivo:", error);
  }
};

export default downloadFile;