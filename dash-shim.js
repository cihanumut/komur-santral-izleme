// claude.ai Dashboard API'sinin (dash.*) bağımsız site için küçük bir karşılığı.
// Veriler veri.js içinde gömülüdür; sayfa internet bağlantısı olmadan, dosyaya çift tıklayarak da açılır (d3 hariç).
(function () {
  const ham = window.SANTRAL_VERI || {};
  const veri = {};
  for (const [id, csv] of Object.entries(ham)) {
    const rows = d3.csvParse(csv);
    veri[id] = { status: 'ok', data: rows, columns: rows.columns, message: '', refreshing: false, meta: [] };
  }

  const calcs = {};
  const calcSonuc = {};
  const cizimler = new Map(); // ad -> fn | {mount, update, unmount}
  const kurulanlar = new WeakMap(); // eleman -> mount sonucu
  const dinleyiciler = [];
  let params = {};

  const bos = { status: 'missing', data: [], columns: [], message: '', refreshing: false, meta: [] };

  function data(id) {
    if (veri[id]) return veri[id];
    if (calcs[id]) {
      if (!calcSonuc[id]) {
        const c = calcs[id];
        const girdiler = c.inputs.map((i) => data(i).data);
        let sonuc;
        try {
          sonuc = c.fn(...girdiler);
        } catch (e) {
          console.error('Hesaplama hatası:', id, e);
          return { ...bos, status: 'error', message: String(e) };
        }
        const rows = Array.isArray(sonuc) ? sonuc : [sonuc];
        calcSonuc[id] = { status: 'ok', data: rows, columns: rows.length ? Object.keys(rows[0]) : [], message: '', refreshing: false, meta: [] };
      }
      return calcSonuc[id];
    }
    return bos;
  }

  const gizliMi = (el) => !!el.closest('[hidden]');

  function ciz(ad) {
    const f = cizimler.get(ad);
    if (!f) return;
    document.querySelectorAll(`[data-draw="${ad}"]`).forEach((el) => {
      if (gizliMi(el)) return;
      try {
        if (typeof f === 'function') {
          f(el);
        } else {
          if (!kurulanlar.has(el)) kurulanlar.set(el, f.mount ? f.mount(el) : undefined);
          if (f.update) f.update(el, kurulanlar.get(el));
        }
      } catch (e) {
        console.error('Çizim hatası:', ad, e);
      }
    });
  }

  function hepsiniCiz() {
    dinleyiciler.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });
    for (const ad of cizimler.keys()) ciz(ad);
  }

  window.dash = {
    colors: ['#2f6fdb', '#e07b39', '#2a9d8f', '#8e5bd6', '#d6a21e', '#c2477a', '#5b8c3a', '#7a7f87'],
    data,
    calc(id, tanim) { calcs[id] = tanim; },
    loader() {},
    onData(fn) { dinleyiciler.push(fn); try { fn(); } catch (e) { console.error(e); } },
    draw(ad, f) {
      if (f === undefined) return ciz(ad);
      cizimler.set(ad, f);
    },
    refresh() {},
    params() { return { ...params }; },
    setParams(p) { params = { ...params, ...p }; hepsiniCiz(); },
    resetParams() { params = {}; hepsiniCiz(); },
    setLink(ad) { try { history.replaceState(null, '', '#' + ad); } catch (e) { /* dosyadan açılınca olmayabilir */ } },
  };

  // Sayfa betikleri çalıştıktan sonra ilk çizim; sekme açılınca ve pencere boyutu değişince yeniden çizim
  document.addEventListener('DOMContentLoaded', () => {
    hepsiniCiz();
    let bekle = null;
    // Yalnızca sekme bölümlerinin görünürlüğü izlenir (çizimlerin kendi hidden değişiklikleri döngü yaratmasın)
    const gozcu = new MutationObserver(() => { clearTimeout(bekle); bekle = setTimeout(hepsiniCiz, 0); });
    document.querySelectorAll('[data-page]').forEach((s) => gozcu.observe(s, { attributes: true, attributeFilter: ['hidden'] }));
    let gen = window.innerWidth;
    window.addEventListener('resize', () => {
      if (Math.abs(window.innerWidth - gen) < 8) return;
      gen = window.innerWidth;
      clearTimeout(bekle);
      bekle = setTimeout(hepsiniCiz, 150);
    });
  });
})();
