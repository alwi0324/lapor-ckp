const GAS_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycby_dZfQom6eGY4uu4nFLzV2cDTyQDXnFmrbCrw5Y15qJr8E69Kc1zAhC_nREgRBVG4C/exec";

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("tableBody");
  const searchTableInput = document.getElementById("searchTableInput");
  const refreshBtn = document.getElementById("refreshBtn");
  const refreshIcon = document.getElementById("refreshIcon");
  const totalDataInfo = document.getElementById("totalDataInfo");

  let allRecords = [];

  // Membuat sel status centang yang dapat diklik
  function renderStatusCell(url, labelDokumen) {
    if (url && url.startsWith("http")) {
      return `
        <td class="py-3 px-3 text-center bg-emerald-50/40">
          <a href="${url}" target="_blank" rel="noopener noreferrer" 
             title="Buka dokumen ${labelDokumen}"
             class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 hover:bg-emerald-600 text-emerald-700 hover:text-white shadow-xs transition-all transform hover:scale-110">
            <i class="bi bi-check-lg text-base font-bold"></i>
          </a>
        </td>
      `;
    }

    return `
      <td class="py-3 px-3 text-center">
        <span class="inline-flex items-center justify-center w-7 h-7 rounded-full text-slate-300" title="Belum diunggah">
          <i class="bi bi-dash"></i>
        </span>
      </td>
    `;
  }

  // Render seluruh baris tabel
  function renderTable(dataList) {
    tableBody.innerHTML = "";

    if (dataList.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" class="py-10 text-center text-slate-400 text-sm">
            <i class="bi bi-search text-2xl block mb-1 text-slate-300"></i>
            Data pegawai tidak ditemukan.
          </td>
        </tr>
      `;
      totalDataInfo.textContent = "Menampilkan 0 pegawai";
      return;
    }

    dataList.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.className = "hover:bg-slate-50/90 transition-colors group";

      // Jika linkFolder ada, jadikan nama pegawai tautan ke folder Drive di tab baru
      const namaHtml =
        item.linkFolder && item.linkFolder.startsWith("http")
          ? `<a href="${item.linkFolder}" target="_blank" rel="noopener noreferrer" 
                title="Buka folder Google Drive ${item.nama}"
                class="font-medium text-slate-800 hover:text-blue-600 inline-flex items-center gap-1.5 transition-colors">
               <span>${item.nama}</span>
               <i class="bi bi-folder2-open text-xs text-blue-500 opacity-75 group-hover:opacity-100"></i>
             </a>`
          : `<span class="font-medium text-slate-700" title="Folder belum dibuat">${item.nama}</span>`;

      tr.innerHTML = `
        <td class="py-3.5 px-4 text-center text-slate-500 font-medium border-r border-slate-100">
          ${index + 1}
        </td>
        <td class="py-3.5 px-4 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-100">
          ${namaHtml}
        </td>
        ${renderStatusCell(item.skpPenetapan, "SKP Penetapan")}
        ${renderStatusCell(item.iki, "IKI")}
        ${renderStatusCell(item.skpTw1, "SKP Triwulan I")}
        ${renderStatusCell(item.skpTw2, "SKP Triwulan II")}
        ${renderStatusCell(item.skpTw3, "SKP Triwulan III")}
        ${renderStatusCell(item.skpTw4, "SKP Triwulan IV")}
        ${renderStatusCell(item.skpPenilaian, "SKP Penilaian")}
      `;

      tableBody.appendChild(tr);
    });

    totalDataInfo.textContent = `Menampilkan ${dataList.length} dari ${allRecords.length} pegawai`;
  }

  // Ambil data dari Spreadsheet via GAS
  async function loadDashboardData() {
    refreshIcon.classList.add("animate-spin");
    refreshBtn.disabled = true;

    try {
      const response = await fetch(GAS_WEB_APP_URL);
      const result = await response.json();

      if (result.status === "success" && Array.isArray(result.data)) {
        allRecords = result.data;
        renderTable(allRecords);
      } else {
        throw new Error(result.message || "Gagal memuat data monitoring.");
      }
    } catch (error) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" class="py-10 text-center text-rose-600 text-sm">
            <i class="bi bi-exclamation-triangle-fill text-2xl block mb-1"></i>
            Gagal memuat data: ${error.message}
          </td>
        </tr>
      `;
    } finally {
      refreshIcon.classList.remove("animate-spin");
      refreshBtn.disabled = false;
    }
  }

  // Pencarian real-time di tabel
  searchTableInput.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    const filtered = allRecords.filter((item) =>
      item.nama.toLowerCase().includes(keyword),
    );
    renderTable(filtered);
  });

  // Tombol Refresh manual
  refreshBtn.addEventListener("click", () => {
    searchTableInput.value = "";
    loadDashboardData();
  });

  // Muat data pertama kali
  loadDashboardData();
});
