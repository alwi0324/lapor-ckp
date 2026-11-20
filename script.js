const GAS_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycby_dZfQom6eGY4uu4nFLzV2cDTyQDXnFmrbCrw5Y15qJr8E69Kc1zAhC_nREgRBVG4C/exec";

document.addEventListener("DOMContentLoaded", () => {
  const daftarPegawai = [
    "Ahwan Hadi, S.ST., M.Ak",
    "Dewi Utari",
    "Abdul Farid, SE",
    "Ismail, SE",
    "Rita, S.Sos",
    "Iksan",
    "Suwardin, S.M.",
    "Muhlis",
    "Muhammad Ali, SE",
    "Abdul Mufakhir S.Psi., M.Ak",
    "Bonny Leo Wattimena, SE",
    "Baiq Ema S. Yulyanti, S.Pd",
    "Octavianus Yakobus Nggoe SST",
    "Mardiati, SST",
    "Hernanda Novitasari, SST",
    "Anggraeni Mutyasari, S.ST",
    "Aditya Dwi Yulianto, S.Tr.Stat",
    "Nurfitriati, SST",
    "Indra Dwi Wicaksono, S.Tr.Stat.",
    "Agung Yuniarta Sosiawan, S.Tr.Stat.",
    "Emalia Septiani Hirma, S.Tr.Stat.",
    "Wayan Delva Budi Darmika, A.Md.Stat",
    "M. Chumaidi Rahman, A.Md.Stat.",
    "Inas Zaizafun Satira, S.Tr.Stat",
    "Salsabila Puspita Wahyuni, A.Md.Stat",
    "Muhammad Rianbarenito Gunawan, A.Md.Stat",
    "Erwin Muspian Hakiki, A.Md.Stat.",
    "Nabila Putri Lestari, S.Tr.Stat",
    "Maulana Rizki Rahmat, A.Md.Stat.",
    "Miftahur Rahim, A.Md.Stat.",
    "Putra Bimo As'ari, A.Md.Stat.",
    "Rizky Wahyuda Manik, S.Tr.Stat.",
    "Nurwadarahmah SST",
    "I Gde Adnyana, SST., M.Si",
    "Nicholas Rahardian Kurnia Sandy S.Tr.Stat.",
    "Tiara Putri Setia Puspita S.Tr.Stat.",
    "Rijal",
    "Iswahyudin",
    "Sukriawan",
    "Syarifuddin",
    "Ikhlas",
  ];

  if (loadingNamaBadge) loadingNamaBadge.classList.add("hidden");

  // Langsung aktifkan tombol dropdown nama
  namaTrigger.disabled = false;
  namaTrigger.classList.remove("bg-slate-100");
  namaTrigger.classList.add(
    "bg-slate-50",
    "hover:bg-slate-100/80",
    "cursor-pointer",
  );
  namaTriggerText.textContent = "-- Cari atau Pilih Nama --";

  let selectedIndex = 0;
  let currentFiltered = [];

  function selectNama(nama) {
    selectedNamaInput.value = nama;
    namaTriggerText.textContent = nama;
    namaTriggerText.classList.remove("text-slate-400");
    namaTriggerText.classList.add("text-slate-800", "font-medium");
    closeDropdown();
    namaSearchInput.value = "";
    clearSearchBtn.classList.add("hidden");
  }

  function renderNamaList(filterText = "") {
    namaList.innerHTML = "";
    const keyword = filterText.toLowerCase().trim();
    currentFiltered = daftarPegawai.filter((nama) =>
      nama.toLowerCase().includes(keyword),
    );

    if (currentFiltered.length === 0) {
      namaList.classList.add("hidden");
      namaEmptyState.classList.remove("hidden");
      selectedIndex = 0;
      return;
    }

    namaList.classList.remove("hidden");
    namaEmptyState.classList.add("hidden");

    if (selectedIndex >= currentFiltered.length) {
      selectedIndex = currentFiltered.length - 1;
    }
    if (selectedIndex < 0) {
      selectedIndex = 0;
    }

    currentFiltered.forEach((nama, index) => {
      const li = document.createElement("li");
      const isSelected = selectedNamaInput.value === nama;
      const isHighlighted = index === selectedIndex;

      // Berikan warna latar berbeda pada item yang sedang disorot keyboard (isHighlighted)
      li.className = `px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
        isHighlighted
          ? "bg-blue-100 text-blue-900 font-semibold"
          : isSelected
            ? "bg-blue-50 text-blue-700 font-semibold"
            : "text-slate-700 hover:bg-slate-50"
      }`;

      li.innerHTML = `
        <span class="truncate pr-2">${nama}</span>
        ${isSelected ? '<i class="bi bi-check2 text-blue-600 text-base shrink-0"></i>' : ""}
      `;

      li.addEventListener("click", () => {
        selectedIndex = index;
        selectNama(nama);
      });

      namaList.appendChild(li);
    });
  }

  function scrollActiveIntoView() {
    const items = namaList.querySelectorAll("li");
    if (items[selectedIndex]) {
      items[selectedIndex].scrollIntoView({ block: "nearest" });
    }
  }

  function openDropdown() {
    namaMenu.classList.remove("hidden");
    namaChevron.classList.add("rotate-180");
    selectedIndex = 0;
    renderNamaList(namaSearchInput.value);
    setTimeout(() => namaSearchInput.focus(), 50);
  }

  function closeDropdown() {
    namaMenu.classList.add("hidden");
    namaChevron.classList.remove("rotate-180");
  }

  namaTrigger.addEventListener("click", () => {
    namaMenu.classList.contains("hidden") ? openDropdown() : closeDropdown();
  });

  namaSearchInput.addEventListener("input", (e) => {
    const val = e.target.value;
    clearSearchBtn.classList.toggle("hidden", val.length === 0);
    selectedIndex = 0; // Reset ke indeks pertama saat mengetik
    renderNamaList(val);
  });

  // Navigasi & Pemilihan via Keyboard (Arrow Up, Arrow Down, Enter, Escape)
  namaSearchInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (currentFiltered.length > 0) {
        selectedIndex = (selectedIndex + 1) % currentFiltered.length;
        renderNamaList(namaSearchInput.value);
        scrollActiveIntoView();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (currentFiltered.length > 0) {
        selectedIndex =
          (selectedIndex - 1 + currentFiltered.length) % currentFiltered.length;
        renderNamaList(namaSearchInput.value);
        scrollActiveIntoView();
      }
    } else if (e.key === "Enter") {
      e.preventDefault(); // Mencegah form tersubmit otomatis
      if (currentFiltered.length === 1) {
        selectNama(currentFiltered[0]);
      } else if (
        currentFiltered.length > 0 &&
        selectedIndex >= 0 &&
        selectedIndex < currentFiltered.length
      ) {
        selectNama(currentFiltered[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      closeDropdown();
    }
  });

  clearSearchBtn.addEventListener("click", () => {
    namaSearchInput.value = "";
    clearSearchBtn.classList.add("hidden");
    selectedIndex = 0;
    renderNamaList("");
    namaSearchInput.focus();
  });

  document.addEventListener("click", (e) => {
    if (!namaDropdownContainer.contains(e.target)) closeDropdown();
  });

  // Validasi file PDF & Ukuran
  function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  function validateAndSetFile(file) {
    if (!file) return;
    if (
      !file.type.includes("pdf") &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      fileInput.value = "";
      Swal.fire({
        icon: "warning",
        title: "Format Salah",
        text: "Hanya file PDF (.pdf) yang diperbolehkan.",
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      fileInput.value = "";
      Swal.fire({
        icon: "warning",
        title: "File Terlalu Besar",
        text: "Maksimal ukuran file adalah 10 MB.",
      });
      return;
    }
    fileNameEl.textContent = file.name;
    fileSizeEl.textContent = formatBytes(file.size);
    uploadPlaceholder.classList.add("hidden");
    filePreview.classList.remove("hidden");
  }

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) validateAndSetFile(e.target.files[0]);
  });

  removeFileBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileInput.value = "";
    filePreview.classList.add("hidden");
    uploadPlaceholder.classList.remove("hidden");
  });

  // Drag & Drop support
  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add("drag-over");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove("drag-over");
    });
  });

  dropZone.addEventListener("drop", (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(files[0]);
      fileInput.files = dataTransfer.files;
      validateAndSetFile(files[0]);
    }
  });

  // Validasi Batas Triwulan
  function isTriwulanPassed(jenisDok, tahunPilih) {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Aturan khusus untuk SKP Penilaian: Harus sudah lewat tahun pelaporannya (Tahun Sekarang > Tahun Pelaporan)
    if (jenisDok === "SKP Penilaian") {
      return currentYear > tahunPilih;
    }
    let deadline;

    if (jenisDok === "SKP Triwulan I") {
      deadline = new Date(tahunPilih, 2, 31, 23, 59, 59); // 31 Maret
    } else if (jenisDok === "SKP Triwulan II") {
      deadline = new Date(tahunPilih, 5, 30, 23, 59, 59); // 30 Juni
    } else if (jenisDok === "SKP Triwulan III") {
      deadline = new Date(tahunPilih, 8, 30, 23, 59, 59); // 30 September
    } else if (jenisDok === "SKP Triwulan IV") {
      deadline = new Date(tahunPilih, 11, 31, 23, 59, 59); // 31 Desember
    } else {
      return true; // Dokumen non-triwulanan (Penetapan, IKI, Penilaian) lolos otomatis
    }

    return now > deadline;
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  }

  function setLoadingState(isLoading) {
    submitBtn.disabled = isLoading;
    if (isLoading) {
      submitIcon.classList.add("hidden");
      submitSpinner.classList.remove("hidden");
      submitText.textContent = "Mengunggah...";
    } else {
      submitIcon.classList.remove("hidden");
      submitSpinner.classList.add("hidden");
      submitText.textContent = "Kirim Laporan";
    }
  }

  reportForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!selectedNamaInput.value) {
      Swal.fire({
        icon: "warning",
        title: "Nama Kosong",
        text: "Pilih Nama Pegawai terlebih dahulu.",
      });
      return;
    }
    if (!jenisDokumenSelect.value) {
      Swal.fire({
        icon: "warning",
        title: "Form Belum Lengkap",
        text: "Pilih Jenis Dokumen.",
      });
      return;
    }
    if (!tahunDropdown.value) {
      Swal.fire({
        icon: "warning",
        title: "Tahun Kosong",
        text: "Pilih Tahun Pelaporan.",
      });
      return;
    }
    if (!fileInput.files || fileInput.files.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "File Kosong",
        text: "Unggah file PDF dokumen terlebih dahulu.",
      });
      return;
    }

    const nama = selectedNamaInput.value;
    const jenisDokumen = jenisDokumenSelect.value;
    const tahun = tahunDropdown.value;

    if (!isTriwulanPassed(jenisDokumen, parseInt(tahun))) {
      const pesanError =
        jenisDokumen === "SKP Penilaian"
          ? `Pelaporan untuk "${jenisDokumen}" tahun ${tahun} baru dapat dilakukan pada tahun berikutnya.`
          : `Pelaporan untuk "${jenisDokumen}" tahun ${tahun} belum dapat dilakukan karena periode triwulannya belum terlewati.`;

      Swal.fire({
        icon: "error",
        title: "Periode Belum Berakhir",
        text: pesanError,
      });
      return;
    }

    setLoadingState(true);
    Swal.fire({
      title: "Mengunggah Laporan...",
      html: `Menyimpan <b>${jenisDokumen} (${tahun})</b> atas nama <b>${nama}</b>.`,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const base64Data = await fileToBase64(fileInput.files[0]);

      const payload = {
        tahun: tahun,
        nama: nama,
        jenisDokumen: jenisDokumen,
        fileData: base64Data,
      };

      const response = await fetch(GAS_WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Berhasil Terkirim!",
          html: `Dokumen berhasil disimpan dan link tercatat di Spreadsheet.`,
        });
        reportForm.reset();
        selectedNamaInput.value = "";
        tahunDropdown.value = "2026";
        namaTriggerText.textContent = "-- Cari atau Pilih Nama --";
        namaTriggerText.classList.add("text-slate-400");
        namaTriggerText.classList.remove("text-slate-800", "font-medium");
        fileInput.value = "";
        filePreview.classList.add("hidden");
        uploadPlaceholder.classList.remove("hidden");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message || "Terjadi gangguan koneksi ke server.",
      });
    } finally {
      setLoadingState(false);
    }
  });

  // Render awal list nama
  renderNamaList();
});
