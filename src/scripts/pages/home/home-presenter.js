export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showReportsListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showReportsListMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialGalleryAndMap() {
    this.#view.showLoading();
    try {
      await this.showReportsListMap();

      const response = await this.#model.getAllReports();
      if (!response.ok) {
        console.error('initialGalleryAndMap: response:', response);
        this.#view.populateReportsListError(response.message);
        return;
      }
      let timerInterval;
      Swal.fire({
        title: "Fetching Story Data...",
        html: "Fetching story content in <b></b> milliseconds. <br> please be patient.",
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup().querySelector("b");
          timerInterval = setInterval(() => {
            timer.textContent = `${Swal.getTimerLeft()}`;
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          this.#view.populateReportsList(response.message, response.listStory);
        }
      });
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populateReportsListError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}
