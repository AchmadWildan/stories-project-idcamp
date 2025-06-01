export default class NotFoundPage {
  async render() {
    return `
      <section class="not-found">
        <h1>404 - Page Not Found</h1>
        <p>Maaf, halaman yang Anda cari tidak ditemukan.</p>
        <a href="/" class="btn">Kembali ke Home</a>
      </section>
    `;
  }
}