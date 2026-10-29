# Kömür Santralleri Emisyon ve Üretim İzleme

Türkiye'deki kömür santrallerinin üretim ve emisyon verilerini SCADA/IoT tarzında izleyen web paneli.

**Canlı site:** https://cihanumut.github.io/komur-santral-izleme/

## Sekmeler

- **Türkiye geneli:** Ember'in aylık verisiyle 2018–2026 arasında kömürden elektrik üretimi, kömürün payı ve CO₂ salımı.
- **Santral izleme (EPİAŞ):** 15 kömür santralinin 2025 yılı saatlik gerçek zamanlı üretimi. Veriler bir SCADA ekranı gibi saat saat yeniden oynatılır; düşük yük ve duruş alarmları verilir. CO₂, üretimden IPCC 2006 emisyon faktörleriyle hesaplanır.
- **Emisyon ölçümü örneği (ABD):** Türkiye'de santral bazında baca gazı ölçümü kamuya açık olmadığı için, ABD'deki Coal Creek linyit santralinin EPA'nın yayımladığı saatlik SO₂, NOx ve CO₂ ölçümleriyle sınır aşımı alarmı örneği.

## Dosyalar

| Dosya | İçerik |
| --- | --- |
| `index.html` | Panelin sayfası ve çizim kodu (d3.js) |
| `dash-shim.js` | Veri yükleme, hesaplama ve çizimleri yöneten küçük katman |
| `veri.js` | Dört veri setinin sayfaya gömülü hali |
| `veri/*.csv` | Ham veri dosyaları |

## Veri kaynakları

- EPİAŞ Şeffaflık Platformu, santral bazında gerçek zamanlı üretim (2025)
- Ember, Monthly Electricity Data, Türkiye (CC BY 4.0)
- ABD EPA, Clean Air Markets Program Data (2024)
- IPCC (2006), Guidelines for National Greenhouse Gas Inventories, Cilt 2, Bölüm 2
