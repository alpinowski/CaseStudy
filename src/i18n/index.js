let currentLang = 'tr';
let listeners = [];

const translations = {
  tr: {
    employeeList: 'Çalışan Listesi',
    addNew: 'Yeni Ekle',
    edit: 'Düzenle',
    delete: 'Sil',
    actions: 'İşlemler',
    firstName: 'Ad',
    lastName: 'Soyad',
    email: 'E-posta',
    phone: 'Telefon',
    department: 'Departman',
    position: 'Pozisyon',
    confirmDelete: 'Bu çalışan silinecek. Emin misiniz?',
    confirmUpdate: 'Bu çalışan güncellenecek. Emin misiniz?',
    cancel: 'İptal',
    confirm: 'Sil',
    dob: 'Doğum Tarihi',
    doe: 'İşe Giriş Tarihi',
    listview: 'Liste Gorünümü ',
    tableview: 'Kare Gorünümü',
    previous: 'Geri',
    next: 'İleri' 
  },
  en: {
    employeeList: 'Employee List',
    addNew: 'Add New',
    edit: 'Edit',
    delete: 'Delete',
    actions: 'Actions',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone Number',
    department: 'Department',
    position: 'Position',
    confirmDelete: 'This employee will be deleted. Are you sure?',
    confirmUpdate: 'This employee will be updated. Are you sure?',
    cancel: 'Cancel',
    confirm: 'Delete',
    dob: 'Date of Birth',
    doe: 'Date of Employment',
    listview: 'List View',
    tableview: 'Table View',
    previous: 'Previous',
    next: 'Next' 
  }
};

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  listeners.forEach(cb => cb());
}

export function getTranslation() {
  const saved = localStorage.getItem('lang');
  const lang = saved || currentLang;
  return translations[lang] || translations.tr;
}

export function subscribe(cb) {
  listeners.push(cb);
}

export function initLang() {
  const saved = localStorage.getItem('lang');
  if (saved) {
    currentLang = saved;
  } else {
    const htmlLang = document.documentElement.lang || 'en';
    currentLang = htmlLang;
  }
}