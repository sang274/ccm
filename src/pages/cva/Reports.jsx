// Reports.jsx
const exportReport = async () => {
    const res = await apiClient.get('/cva/reports/issued', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bao-cao-tin-chi.pdf');
    document.body.appendChild(link);
    link.click();
};